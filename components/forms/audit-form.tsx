'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FormMessage } from '@/components/forms/form-message';
import { apiUrl } from '@/lib/utils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuditForm() {
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
      const response = await fetch(apiUrl('/api/audit-lead'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email,
          currentRole: formData.get('currentRole'),
          yearsExperience: formData.get('yearsExperience'),
          linkedInUrl: formData.get('linkedInUrl'),
          concern: formData.get('concern'),
          honeypot: formData.get('companyWebsite'),
          captchaToken:
            process.env.NEXT_PUBLIC_CAPTCHA_PLACEHOLDER_TOKEN || formData.get('captchaToken') || '',
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Could not submit the audit request.');
      }

      router.push('/thank-you?source=audit');
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
      <div>
        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">Full Name</label>
        <input name="fullName" type="text" required className="input-field" placeholder="Jane Doe" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">
          Work or Primary Email
        </label>
        <input
          name="email"
          type="email"
          required
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          title="Enter a valid email address"
          className="input-field"
          placeholder="jane@company.com"
        />
        <p className="text-[10px] text-slate/60 mt-1.5 italic">We'll send your diagnostic summary here. No spam.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">Current Role</label>
          <input name="currentRole" type="text" required className="input-field" placeholder="Director of Ops" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">Years of Exp.</label>
          <input
            name="yearsExperience"
            type="number"
            min="0"
            max="60"
            required
            className="input-field"
            placeholder="10"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">
          LinkedIn URL (Optional)
        </label>
        <input name="linkedInUrl" type="url" className="input-field" placeholder="https://linkedin.com/in/username" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">
          Biggest Career Concern?
        </label>
        <textarea
          name="concern"
          rows={3}
          className="input-field"
          placeholder="Stagnation, misalignment, industry shift..."
        />
      </div>
      <FormMessage type="error" message={error} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-forest text-ivory font-medium rounded btn-primary tracking-wide disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Continue to Assessment'}
      </button>
    </form>
  );
}
