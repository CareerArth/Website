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
