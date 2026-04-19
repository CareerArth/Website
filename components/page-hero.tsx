import type { ReactNode } from 'react';
import { Reveal } from '@/components/reveal';

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="pt-32 pb-8 lg:pt-40">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">{eyebrow}</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest mb-6 leading-tight">{title}</h1>
          <p className="text-slate max-w-2xl leading-relaxed">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
