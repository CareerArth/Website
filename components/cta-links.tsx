import type { ReactNode } from 'react';
import Link from 'next/link';

export function PrimaryCtaLink({ href, children }: { href: string; children: ReactNode }) {
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
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
    >
      {children}
    </Link>
  );
}
