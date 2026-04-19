import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ZodError } from 'zod';
import { sendConsultationEmails } from '../shared/email';
import { json } from '../shared/http';
import { getRequestOrigin, getSourceIp, hashIp, rejectBot, verifyCaptcha } from '../shared/security';
import { incrementRateLimit, storeSubmission } from '../shared/storage';
import { consultationSchema } from '../shared/validation';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = getRequestOrigin(event);
  if (!origin) {
    return json(403, { error: 'Origin not allowed.' });
  }

  let rawBody: unknown = {};
  try {
    rawBody = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: 'Invalid JSON body.' }, origin);
  }

  try {
    const payload = consultationSchema.parse(rawBody);

    if (rejectBot(payload.honeypot)) {
      return json(200, { ok: true }, origin);
    }

    const sourceIpHash = hashIp(getSourceIp(event));
    const rateLimit = await incrementRateLimit('consultation', sourceIpHash);
    if (!rateLimit.allowed) {
      return json(429, { error: 'Too many requests. Please try again later.' }, origin);
    }

    const captchaValid = await verifyCaptcha(payload.captchaToken);
    if (!captchaValid) {
      return json(400, { error: 'Captcha verification failed.' }, origin);
    }

    const { honeypot, captchaToken, ...record } = payload;
    const stored = await storeSubmission('consultation', {
      ...record,
      sourceIpHash,
      userAgent: event.headers['user-agent'] || '',
      origin,
    });

    await sendConsultationEmails(payload.email, payload.name, stored.id);

    return json(201, { ok: true, id: stored.id }, origin);
  } catch (error) {
    if (error instanceof ZodError) {
      return json(400, { error: 'Invalid request payload.', issues: error.flatten() }, origin);
    }

    return json(500, { error: 'Internal server error.' }, origin);
  }
};
