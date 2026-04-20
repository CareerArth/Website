import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getMetadataBase, siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'Career Arth | Diagnose Your Career Health',
  description:
    'Diagnose where your career is quietly weakening before it limits your future options.',
  alternates: siteConfig.siteUrl
    ? {
        canonical: '/',
      }
    : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden bg-ivory text-charcoal">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
