import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { footerLinks } from '@/lib/site-content';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-sand pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif font-semibold text-2xl tracking-tight text-forest mb-2">
              Career<span className="italic text-gold">Arth</span>.
            </div>
            <p className="text-sm text-slate">A diagnostic platform for professional strategy.</p>
            <p className="text-sm text-slate mt-2">{siteConfig.companyName}</p>
            <p className="text-sm text-slate">{siteConfig.registeredOffice}</p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-block text-sm text-forest border-b border-forest mt-2"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-forest transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate mb-8">
          {siteConfig.socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-forest transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        <div className="text-center text-xs text-slate opacity-60 border-t border-sand pt-8">
          &copy; {new Date().getFullYear()} Career Arth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
