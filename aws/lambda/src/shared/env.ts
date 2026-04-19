import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.string().default('production'),
  ALLOWED_ORIGINS: z.string().min(1),
  DDB_TABLE_NAME: z.string().min(1),
  AWS_REGION: z.string().min(1),
  SES_FROM_EMAIL: z.string().email(),
  SES_NOTIFY_EMAIL: z.string().email().default('contact@careerarth.com'),
  CAPTCHA_VERIFY_URL: z.string().optional(),
  CAPTCHA_SECRET_KEY: z.string().optional(),
  CAPTCHA_PLACEHOLDER_TOKEN: z.string().min(1),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
});

export const env = envSchema.parse(process.env);
export const allowedOrigins = env.ALLOWED_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
