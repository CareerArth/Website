import { z } from 'zod';

const cleanString = (value: unknown) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();

const optionalString = () =>
  z.preprocess((value) => {
    const cleaned = cleanString(value);
    return cleaned.length ? cleaned : undefined;
  }, z.string().max(500).optional());

export const auditLeadSchema = z.object({
  fullName: z.preprocess((value) => cleanString(value), z.string().min(2).max(120)),
  email: z.preprocess((value) => cleanString(value).toLowerCase(), z.string().email().max(320)),
  currentRole: z.preprocess((value) => cleanString(value), z.string().min(2).max(160)),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  linkedInUrl: z.preprocess((value) => {
    const cleaned = cleanString(value);
    return cleaned.length ? cleaned : undefined;
  }, z.string().url().max(500).optional()),
  concern: optionalString(),
  honeypot: optionalString(),
  captchaToken: z.preprocess((value) => cleanString(value), z.string().min(1).max(2048)),
});

export const consultationSchema = z.object({
  name: z.preprocess((value) => cleanString(value), z.string().min(2).max(120)),
  email: z.preprocess((value) => cleanString(value).toLowerCase(), z.string().email().max(320)),
  roleCompany: z.preprocess((value) => cleanString(value), z.string().min(2).max(160)),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  helpRequest: optionalString(),
  honeypot: optionalString(),
  captchaToken: z.preprocess((value) => cleanString(value), z.string().min(1).max(2048)),
});

export type AuditLeadInput = z.infer<typeof auditLeadSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
