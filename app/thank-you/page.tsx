import Link from 'next/link';
import { PrimaryCtaLink, SecondaryCtaLink } from '@/components/cta-links';
import { Reveal } from '@/components/reveal';

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{ source?: string }>;
}) {
  const params = (await searchParams) || {};
  const source = params.source === 'consultation' ? 'consultation request' : 'audit request';

  return (
    <main className="min-h-[70vh] flex items-center pt-32 pb-20 lg:pt-40">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 w-full">
        <Reveal>
          <div className="bg-white border border-sand rounded-2xl shadow-sm p-12 lg:p-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Submission received</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-forest mb-6">Thank you.</h1>
            <p className="text-slate leading-relaxed max-w-2xl mx-auto mb-10">
              We received your {source}. The system is configured to store the record in DynamoDB and send the
              confirmation workflow through SES once the AWS environment variables are set.
            </p>
            <div className="flex flex-col items-center gap-6">
              <PrimaryCtaLink href="/sample-score">See Sample Score</PrimaryCtaLink>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <SecondaryCtaLink href="/consultation">Talk to a Career Expert</SecondaryCtaLink>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
                >
                  Contact Career Arth
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
