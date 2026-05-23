import { NextResponse } from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ConsultationPayload = {
  name?: unknown;
  email?: unknown;
  roleCompany?: unknown;
  yearsExperience?: unknown;
  helpRequest?: unknown;
  honeypot?: unknown;
};

function clean(value: unknown) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.CONSULTATION_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Consultation endpoint is not configured.' }, { status: 500 });
  }

  let body: ConsultationPayload;
  try {
    body = (await request.json()) as ConsultationPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const roleCompany = clean(body.roleCompany);
  const yearsExperience = toNumber(body.yearsExperience);
  const helpRequest = clean(body.helpRequest);
  const honeypot = clean(body.honeypot);

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !roleCompany || yearsExperience === null) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (yearsExperience < 0 || yearsExperience > 60) {
    return NextResponse.json({ error: 'Invalid years of experience.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        roleCompany,
        yearsExperience,
        helpRequest,
        source: 'website',
      }),
    });

    const text = await upstream.text();
    let parsed: { ok?: boolean; error?: string } | null = null;
    try {
      parsed = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null;
    } catch {
      parsed = null;
    }

    if (!upstream.ok || parsed?.ok === false) {
      return NextResponse.json(
        { error: parsed?.error || 'Could not submit the consultation request.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Consultation service is temporarily unavailable.' }, { status: 502 });
  }
}

