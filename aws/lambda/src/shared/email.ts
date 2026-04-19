import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { env } from './env';

const ses = new SESv2Client({ region: env.AWS_REGION });

async function sendEmail(toAddress: string, subject: string, html: string, text: string) {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [toAddress],
      },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: html },
            Text: { Data: text },
          },
        },
      },
    }),
  );
}

export async function sendAuditEmails(email: string, fullName: string, submissionId: string) {
  await Promise.all([
    sendEmail(
      email,
      'Your Career Arth diagnostic request was received',
      `<p>Hi ${fullName},</p><p>We received your Career Arth diagnostic request.</p><p>Reference ID: <strong>${submissionId}</strong></p>`,
      `Hi ${fullName},\n\nWe received your Career Arth diagnostic request.\nReference ID: ${submissionId}`,
    ),
    sendEmail(
      env.SES_NOTIFY_EMAIL,
      'New Career Arth audit lead',
      `<p>A new audit lead was submitted.</p><p>Email: ${email}</p><p>Reference ID: <strong>${submissionId}</strong></p>`,
      `A new audit lead was submitted.\nEmail: ${email}\nReference ID: ${submissionId}`,
    ),
  ]);
}

export async function sendConsultationEmails(email: string, name: string, submissionId: string) {
  await Promise.all([
    sendEmail(
      email,
      'Your Career Arth consultation request was received',
      `<p>Hi ${name},</p><p>We received your consultation request.</p><p>Reference ID: <strong>${submissionId}</strong></p>`,
      `Hi ${name},\n\nWe received your consultation request.\nReference ID: ${submissionId}`,
    ),
    sendEmail(
      env.SES_NOTIFY_EMAIL,
      'New Career Arth consultation request',
      `<p>A new consultation request was submitted.</p><p>Email: ${email}</p><p>Reference ID: <strong>${submissionId}</strong></p>`,
      `A new consultation request was submitted.\nEmail: ${email}\nReference ID: ${submissionId}`,
    ),
  ]);
}
