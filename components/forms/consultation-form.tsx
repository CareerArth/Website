'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FormMessage } from '@/components/forms/form-message';
import { apiUrl } from '@/lib/utils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConsultationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();

    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/consultation'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email,
          roleCompany: formData.get('roleCompany'),
          yearsExperience: formData.get('yearsExperience'),
          helpRequest: formData.get('helpRequest'),
          honeypot: formData.get('companyWebsite'),
          captchaToken:
            process.env.NEXT_PUBLIC_CAPTCHA_PLACEHOLDER_TOKEN || formData.get('captchaToken') || '',
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Could not submit the consultation request.');
      }

      router.push('/thank-you?source=consultation');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="captchaToken" value="" readOnly />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate uppercase mb-2">Name</label>
          <input name="name" type="text" required className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate uppercase mb-2">Email</label>
          <input
            name="email"
            type="email"
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
            title="Enter a valid email address"
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase mb-2">Role / Company</label>
        <input name="roleCompany" type="text" required className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase mb-2">Years of experience</label>
        <input name="yearsExperience" type="number" min="0" max="60" required className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase mb-2">
          What would you like help with?
        </label>
        <textarea
          name="helpRequest"
          rows={4}
          className="input-field"
          placeholder="Describe your current career inflection point..."
        />
      </div>
      <FormMessage type="error" message={error} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-forest text-ivory font-medium rounded btn-primary tracking-wide disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Request Consultation'}
      </button>
    </form>
  );
}
