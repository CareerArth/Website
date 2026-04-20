import type { ReactNode } from 'react';
import Link from 'next/link';

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
}

export function PrimaryCtaLink({ href, children }: { href: string; children: ReactNode }) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="inline-block px-8 py-4 bg-forest text-ivory text-sm font-medium rounded tracking-wide btn-primary w-full sm:w-auto text-center"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="inline-block px-8 py-4 bg-forest text-ivory text-sm font-medium rounded tracking-wide btn-primary w-full sm:w-auto text-center"
    >
      {children}
    </Link>
  );
}

export function SecondaryCtaLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
    >
      {children}
    </Link>
  );
}
