import Link from 'next/link';
import Image from 'next/image';
import { footerLinks } from '@/lib/site-content';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-sand pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-8">
          <div className="text-center md:text-left">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logofooter.png`}
              alt="CareerArth"
              width={409}
              height={469}
              className="h-10 w-auto object-contain mb-2"
            />
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3">
              <a
                href="https://www.youtube.com/@CareerArth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-sand bg-ivory/70 text-slate hover:text-forest hover:border-forest/40 transition-colors inline-flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/careerarth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-sand bg-ivory/70 text-slate hover:text-forest hover:border-forest/40 transition-colors inline-flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm8.7 1.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/careerarth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-sand bg-ivory/70 text-slate hover:text-forest hover:border-forest/40 transition-colors inline-flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M4.7 3.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM3.2 8.8h3v12h-3v-12Zm6 0h2.9v1.6h.1c.4-.8 1.5-1.9 3.1-1.9 3.3 0 3.9 2.1 3.9 4.9v7.4h-3v-6.6c0-1.6 0-3.5-2.1-3.5-2.1 0-2.4 1.7-2.4 3.4v6.7h-3v-12Z" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-slate">A diagnostic platform for professional strategy.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-forest transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-xs text-slate opacity-60 border-t border-sand pt-8">
          &copy; {new Date().getFullYear()} Career Arth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
