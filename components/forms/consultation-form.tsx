'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { siteConfig } from '@/lib/site-config';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormValues = {
  name: string;
  email: string;
  linkedin: string;
  phone: string;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  linkedin: '',
  phone: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[0-9\s\-()]{7,20}$/;

function normalizeLinkedin(value: string) {
  if (!value) {
    return '';
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function ConsultationForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const endpointConfigured = useMemo(() => Boolean(siteConfig.consultationEndpoint), []);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const linkedin = normalizeLinkedin(values.linkedin.trim());
    const phone = values.phone.trim();

    if (!name) {
      return { ok: false as const, message: 'Enter your name.' };
    }

    if (!emailPattern.test(email)) {
      return { ok: false as const, message: 'Enter a valid email address.' };
    }

    if (linkedin && !/^https?:\/\/.+/i.test(linkedin)) {
      return { ok: false as const, message: 'Enter a valid LinkedIn URL.' };
    }

    if (phone && !phonePattern.test(phone)) {
      return { ok: false as const, message: 'Enter a valid phone number or leave it blank.' };
    }

    return {
      ok: true as const,
      payload: {
        name,
        email,
        linkedin,
        phone,
        source: 'careerarth_website',
      },
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpointConfigured) {
      setStatus('error');
      setMessage('Consultation form endpoint is not configured yet.');
      return;
    }

    const validation = validate();
    if (!validation.ok) {
      setStatus('error');
      setMessage(validation.message);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(siteConfig.consultationEndpoint, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(validation.payload),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Could not submit your consultation request.');
      }

      setStatus('success');
      setMessage('Consultation request received. Redirecting...');
      setValues(initialValues);

      window.setTimeout(() => {
        router.push('/thank-you?source=consultation');
      }, 900);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not submit your consultation request.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate uppercase mb-2">Name</label>
          <input
            name="name"
            type="text"
            required
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="input-field"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate uppercase mb-2">Email</label>
          <input
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="input-field"
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase mb-2">LinkedIn</label>
        <input
          name="linkedin"
          type="url"
          value={values.linkedin}
          onChange={(event) => updateField('linkedin', event.target.value)}
          className="input-field"
          placeholder="https://linkedin.com/in/your-profile"
          autoComplete="url"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase mb-2">Phone Number</label>
        <input
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          className="input-field"
          autoComplete="tel"
        />
      </div>
      {message ? (
        <p className={status === 'error' ? 'text-sm text-red-700' : 'text-sm text-forest'}>{message}</p>
      ) : null}
      {status === 'error' ? (
        <p className="text-xs text-slate">
          If this keeps failing, confirm the Apps Script uses the `/exec` deployment URL, is shared as
          `Anyone`, and the sheet is accessible to the account running the script.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-forest text-ivory font-medium rounded btn-primary tracking-wide disabled:opacity-70"
      >
        {status === 'loading' ? 'Submitting...' : 'Request Consultation'}
      </button>
    </form>
  );
}
