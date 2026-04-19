import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';

export function PolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <main>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="pb-16 lg:pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <Reveal className="space-y-8 text-slate">
            {sections.map((section) => (
              <section key={section.title} className="bg-white border border-sand rounded-xl p-8">
                <h2 className="text-xl font-serif text-charcoal mb-4">{section.title}</h2>
                <p className="leading-relaxed">{section.body}</p>
              </section>
            ))}
          </Reveal>
          <div className="mt-20 pt-8 border-t border-sand">
            <Link href="/" className="text-sm text-forest border-b border-forest">
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
