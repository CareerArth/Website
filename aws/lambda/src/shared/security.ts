import crypto from 'crypto';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { allowedOrigins, env } from './env';

export function getRequestOrigin(event: APIGatewayProxyEventV2) {
  const origin = event.headers.origin || event.headers.Origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return null;
  }

  return origin;
}

export function getSourceIp(event: APIGatewayProxyEventV2) {
  const forwarded = event.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return event.requestContext.http.sourceIp || 'unknown';
}

export function hashIp(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function rejectBot(honeypot?: string | null) {
  return Boolean(honeypot && honeypot.trim());
}

export async function verifyCaptcha(token: string) {
  if (!token) {
    return false;
  }

  if (token === env.CAPTCHA_PLACEHOLDER_TOKEN) {
    return true;
  }

  if (!env.CAPTCHA_VERIFY_URL || !env.CAPTCHA_SECRET_KEY) {
    return false;
  }

  const response = await fetch(env.CAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: env.CAPTCHA_SECRET_KEY,
      token,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { success?: boolean };
  return Boolean(payload.success);
}
