'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';

export function TrackedConsultationLink({
  href = '/consultation',
  className,
  children,
  ctaType = 'link',
}: {
  href?: string;
  className: string;
  children: ReactNode;
  ctaType?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent('consultation_cta_click', { href, cta_type: ctaType })}
      className={className}
    >
      {children}
    </Link>
  );
}

