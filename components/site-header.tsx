'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { navigationLinks } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300 bg-ivory/80 backdrop-blur-md border-b',
        isScrolled ? 'shadow-sm border-sand' : 'border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif font-semibold text-2xl tracking-tight text-forest">
          Career<span className="italic text-gold">Arth</span>.
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest transition-colors">
              {link.label}
            </Link>
          ))}
          <a
            href={siteConfig.diagnosticFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-forest text-ivory rounded hover:bg-slate transition-colors btn-primary"
          >
            Start the Career Audit
          </a>
        </div>
        <button
          type="button"
          className="md:hidden text-forest"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isOpen ? (
        <div className="md:hidden border-t border-sand bg-ivory/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.diagnosticFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="px-5 py-3 bg-forest text-ivory rounded text-center btn-primary"
            >
              Start the Career Audit
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
