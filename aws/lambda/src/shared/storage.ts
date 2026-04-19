import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { env } from './env';

const client = new DynamoDBClient({ region: env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client);

export async function storeSubmission(recordType: 'audit_lead' | 'consultation', payload: Record<string, unknown>) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 2;

  await documentClient.send(
    new PutCommand({
      TableName: env.DDB_TABLE_NAME,
      Item: {
        PK: `SUBMISSION#${recordType}`,
        SK: `${createdAt}#${id}`,
        GSI1PK: `EMAIL#${payload.email}`,
        GSI1SK: `${createdAt}#${recordType}`,
        id,
        recordType,
        createdAt,
        status: 'new',
        ttl,
        ...payload,
      },
    }),
  );

  return { id, createdAt };
}

export async function incrementRateLimit(routeKey: string, ipHash: string) {
  const windowSeconds = env.RATE_LIMIT_WINDOW_SECONDS;
  const currentWindow = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const expiresAt = currentWindow + windowSeconds * 2;

  const result = await documentClient.send(
    new UpdateCommand({
      TableName: env.DDB_TABLE_NAME,
      Key: {
        PK: `RATE_LIMIT#${routeKey}#${ipHash}`,
        SK: `WINDOW#${currentWindow}`,
      },
      UpdateExpression:
        'SET #count = if_not_exists(#count, :zero) + :one, #ttl = :ttl, #recordType = :recordType',
      ExpressionAttributeNames: {
        '#count': 'count',
        '#ttl': 'ttl',
        '#recordType': 'recordType',
      },
      ExpressionAttributeValues: {
        ':zero': 0,
        ':one': 1,
        ':ttl': expiresAt,
        ':recordType': 'rate_limit',
      },
      ReturnValues: 'ALL_NEW',
    }),
  );

  const count = Number(result.Attributes?.count || 0);
  return {
    count,
    allowed: count <= env.RATE_LIMIT_MAX,
    remaining: Math.max(env.RATE_LIMIT_MAX - count, 0),
  };
}
