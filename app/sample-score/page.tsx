import { PrimaryCtaLink } from '@/components/cta-links';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { siteConfig } from '@/lib/site-config';

export default function SampleScorePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pb-16 lg:pb-24">
      <PageHero
        eyebrow="Product Preview"
        title={
          <>
            A Preview of Your Career <br />
            Arth Score
          </>
        }
        description="This is what your diagnostic output looks like. We quantify the intangible risks in your professional path."
      />

      <Reveal className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden mb-12">
        <div className="p-10 lg:p-16 flex flex-col items-center border-b border-sand bg-ivory/30">
          <div className="relative flex flex-col items-center mb-4">
            <svg viewBox="0 0 100 50" className="w-64">
              <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#E6E1D6" strokeWidth="6" strokeLinecap="round" />
              <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#1E3329" strokeWidth="6" strokeLinecap="round" strokeDasharray="64 100" pathLength="100" />
            </svg>
            <div className="absolute bottom-0 text-center translate-y-2">
              <div className="font-serif text-7xl text-forest">64</div>
              <div className="text-xs uppercase tracking-widest text-slate">Arth Score</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-sand">
          {[
            ['Alignment', '72%', 'w-[72%]', 'bg-forest', 'High coherence with core skills but slight industry mismatch.'],
            ['Risk Exposure', '48%', 'w-[48%]', 'bg-gold', 'Exposure to sector volatility is moderate.'],
            ['Trajectory', '52%', 'w-[52%]', 'bg-slate', 'Momentum is leveling out; limited next-step growth.'],
            ['Human Capital', '81%', 'w-[81%]', 'bg-forest', 'Exceptional network leverage and transferability.'],
          ].map(([title, value, width, barColor, copy]) => (
            <div key={title} className="bg-white p-8">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate mb-1">{title}</div>
              <div className="text-xl font-serif text-charcoal mb-4">{value}</div>
              <div className="w-full bg-sand h-1.5 rounded-full overflow-hidden mb-3">
                <div className={`${barColor} h-full ${width}`} />
              </div>
              <p className="text-xs text-slate leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="bg-parchment/40 rounded-xl p-8 lg:p-12 border border-sand mb-16 delay-100">
        <h3 className="font-serif text-2xl text-forest mb-4">Strategic Interpretation</h3>
        <p className="text-slate leading-relaxed">
          Based on typical profiles at this stage, a score of 64 suggests moderate trajectory risk. While your human
          capital remains high, there is an emerging misalignment between your current role&apos;s responsibilities and
          your desired long-term positioning. If left unaddressed, this could lead to gilded stagnation where
          compensation increases but professional optionality narrows.
        </p>
      </Reveal>

      <Reveal className="text-center space-y-8 delay-200">
        <h4 className="font-serif text-3xl text-forest">Ready for your real diagnostic?</h4>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <PrimaryCtaLink href={siteConfig.diagnosticFormUrl}>Start the Career Audit</PrimaryCtaLink>
          <PrimaryCtaLink href="/consultation">Talk to a Career Expert</PrimaryCtaLink>
        </div>
      </Reveal>
    </main>
  );
}
