'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
        'fixed w-full z-50 transition-all duration-300 bg-ivory/85 backdrop-blur-lg border-b',
        isScrolled ? 'shadow-[0_8px_30px_rgba(43,57,48,0.08)] border-sand' : 'border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
            alt="CareerArth"
            width={1924}
            height={468}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-sand/80 bg-white/80 px-2 py-2 text-sm font-medium text-slate font-work-sans">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 rounded-full hover:text-forest hover:bg-ivory transition-colors">
              {link.label}
            </Link>
          ))}
          <Link
            href="https://forms.gle/XujesuyJ23NeHufK6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-forest text-ivory font-semibold rounded-full hover:bg-slate transition-colors btn-primary"
          >
            Get My Free Career Diagnostic
          </Link>
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
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate font-work-sans">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="https://forms.gle/XujesuyJ23NeHufK6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="px-5 py-3 bg-forest text-ivory font-semibold rounded text-center btn-primary"
            >
              Get My Free Career Diagnostic
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
