import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const defaultHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

export function json(statusCode: number, body: Record<string, unknown>, origin?: string): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      ...defaultHeaders,
      ...(origin
        ? {
            'Access-Control-Allow-Origin': origin,
            Vary: 'Origin',
          }
        : {}),
    },
    body: JSON.stringify(body),
  };
}
