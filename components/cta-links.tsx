'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

function getCtaEventName(href: string) {
  if (href.includes('forms.gle') || href === '/audit') return 'start_career_audit_click';
  if (href.includes('/sample-score')) return 'preview_sample_report_click';
  if (href.includes('/consultation')) return 'consultation_cta_click';
  return null;
}

export function PrimaryCtaLink({
  href,
  children,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}) {
  const eventName = getCtaEventName(href);

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={() => {
        if (eventName) trackEvent(eventName, { href, cta_type: 'primary' });
      }}
      className="inline-block px-8 py-4 bg-forest text-ivory text-sm font-medium rounded tracking-wide btn-primary w-full sm:w-auto text-center"
    >
      {children}
    </Link>
  );
}

export function SecondaryCtaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const eventName = getCtaEventName(href);

  return (
    <Link
      href={href}
      onClick={() => {
        if (eventName) trackEvent(eventName, { href, cta_type: 'secondary' });
      }}
      className={`text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors ${className ?? ''}`}
    >
      {children}
    </Link>
  );
}
