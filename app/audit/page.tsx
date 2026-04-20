import { PrimaryCtaLink } from '@/components/cta-links';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { siteConfig } from '@/lib/site-config';

export default function AuditPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-12 pb-12 lg:pb-24">
      <PageHero
        eyebrow="Step 1: Diagnostic Entry"
        title={
          <>
            Start Your Career <br />
            Arth Diagnostic
          </>
        }
        description="A 5-minute assessment to identify hidden risks in your career trajectory and measure strategic alignment."
      />
      <div className="grid lg:grid-cols-2 gap-20 items-start mt-8">
        <Reveal>
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-charcoal">What you'll get:</h3>
            <ul className="space-y-4">
              {[
                ['Your Career Arth Score:', 'A quantitative baseline for your professional health.'],
                ['4-Dimension Breakdown:', 'Detailed insights into Alignment, Risk, Trajectory, and Capital.'],
                ['Strategic Insights:', 'Clear identification of immediate risk signals.'],
              ].map(([title, copy]) => (
                <li key={title} className="flex items-start space-x-3 text-sm text-slate">
                  <span className="text-gold mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </span>
                  <span>
                    <strong>{title}</strong> {copy}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="delay-100 bg-white p-8 lg:p-12 rounded-xl shadow-sm border border-sand">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-forest mb-3">Open the Career Arth Diagnostic</h2>
              <p className="text-sm text-slate leading-relaxed">
                The final diagnostic now runs through the live Google Form. Use the button below to open it in a new
                tab and submit your responses directly.
              </p>
            </div>
            <div className="bg-ivory border border-sand rounded-xl p-6 space-y-3 text-sm text-slate">
              <p>Brand: Career Arth</p>
              <p>Contact: {siteConfig.contactEmail}</p>
              <p>Consultation requests are handled manually after your diagnostic is submitted.</p>
            </div>
            <PrimaryCtaLink href={siteConfig.diagnosticFormUrl}>Start the Career Audit</PrimaryCtaLink>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
