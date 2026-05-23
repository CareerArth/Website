'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '@/lib/analytics';

export function AnalyticsPageview() {
  const pathname = usePathname();

  useEffect(() => {
    const query = typeof window !== 'undefined' ? window.location.search : '';
    const url = query ? `${pathname}${query}` : pathname;
    pageview(url);
  }, [pathname]);

  return null;
}
