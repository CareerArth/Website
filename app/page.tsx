import { PrimaryCtaLink, SecondaryCtaLink } from '@/components/cta-links';
import { Reveal } from '@/components/reveal';

export default function HomePage() {
  return (
    <main>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <Reveal active className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-widest text-slate mb-4 flex items-center">
                <span className="w-8 h-px bg-gold mr-4" />
                Most professionals don't know this number
              </p>
              <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-charcoal mb-6">
                What's your <br />
                <span className="text-forest italic">Career Arth?</span>
              </h1>
              <p className="text-lg text-slate mb-10 leading-relaxed max-w-lg">
                Diagnose where your career is quietly weakening before it limits your future options. A strategic
                assessment framework for ambitious professionals.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <PrimaryCtaLink href="/audit">Start the Career Audit</PrimaryCtaLink>
                <SecondaryCtaLink href="/sample-score">See Sample Score</SecondaryCtaLink>
              </div>
              <p className="text-xs text-slate opacity-70 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Free Diagnostic</span>
                <span>&bull;</span>
                <span>5-Minute Assessment</span>
                <span>&bull;</span>
                <span>Immediate Insight</span>
              </p>
            </Reveal>

            <Reveal active className="relative lg:h-[500px] flex justify-center lg:justify-end delay-100">
              <div className="w-full max-w-md bg-white rounded-xl shadow-card border border-sand p-8 relative z-10 overflow-hidden group">
                <div className="flex justify-between items-center mb-10 border-b border-sand pb-4">
                  <div className="text-xs font-semibold text-slate tracking-widest uppercase">Diagnostic Report</div>
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>

                <div className="relative flex flex-col items-center mb-8">
                  <svg viewBox="0 0 100 50" className="w-full max-w-[240px] drop-shadow-sm">
                    <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#F0ECE1" strokeWidth="6" strokeLinecap="round" />
                    <path
                      d="M 10 45 A 40 40 0 0 1 90 45"
                      fill="none"
                      stroke="#1E3329"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="0 100"
                      pathLength="100"
                      className="gauge-fill"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-center">
                    <div className="font-serif text-5xl text-forest leading-none mb-1">68</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate">Arth Score</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>Trajectory Risk</span>
                      <span className="text-forest font-medium">Elevated</span>
                    </div>
                    <div className="w-full bg-sand h-1 rounded-full overflow-hidden">
                      <div className="bg-gold h-full w-[70%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>Alignment</span>
                      <span className="text-forest font-medium">Stable</span>
                    </div>
                    <div className="w-full bg-sand h-1 rounded-full overflow-hidden">
                      <div className="bg-forest h-full w-[45%]" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-[length:20px_20px] pointer-events-none" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-parchment rounded-full blur-3xl opacity-40 -z-10" />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="problem" className="py-24 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            <Reveal className="lg:col-span-5">
              <h2 className="font-serif text-4xl lg:text-5xl text-forest leading-tight mb-6">
                Most careers don't break. <br />
                <span className="italic text-slate">They erode.</span>
              </h2>
              <p className="text-slate leading-relaxed mb-6">
                You work hard, take on new roles, and earn more. Yet, without a diagnostic framework, you may be
                quietly losing momentum, strategic clarity, or future optionality.
              </p>
            </Reveal>

            <Reveal className="lg:col-span-6 lg:col-start-7 flex flex-col border-t border-b border-sand delay-100">
              <div className="p-8 border-b border-sand hover:bg-ivory transition-colors">
                <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-3">The Blindspot</div>
                <h3 className="text-xl font-serif text-charcoal mb-2">False Security</h3>
                <p className="text-sm text-slate">
                  High compensation often masks structural career stagnation, leading to a narrower set of options in
                  the following decade.
                </p>
              </div>
              <div className="p-8 hover:bg-ivory transition-colors">
                <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-3">The Catalyst</div>
                <h3 className="text-xl font-serif text-charcoal mb-2">Inflection Points</h3>
                <p className="text-sm text-slate">
                  Without a baseline measurement, professionals navigate critical career pivots using intuition rather
                  than objective strategic assessment.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="framework" className="py-24 bg-ivory scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-medium uppercase tracking-widest text-slate mb-4">The Methodology</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-forest mb-6">The ARTH Score</h2>
            <p className="text-slate">
              A proprietary 4-dimension diagnostic identifying where your career is gaining strength and where risks
              are accumulating.
            </p>
          </Reveal>

          <Reveal className="grid md:grid-cols-2 gap-px bg-sand rounded-xl overflow-hidden border border-sand delay-100">
            {[
              ['A', 'Alignment', 'Measures the coherence between your current role and your long-term ambitions.'],
              ['R', 'Risk Exposure', 'Evaluates vulnerability to industry shifts and skill obsolescence.'],
              ['T', 'Trajectory', 'Assesses current momentum - are options expanding or narrowing over time?'],
              ['H', 'Human Capital', 'Quantifies the strength of your network and brand equity.'],
            ].map(([letter, title, copy]) => (
              <div key={title} className="bg-white p-10 lg:p-14 relative group hover:bg-ivory transition-colors">
                <div className="absolute top-8 right-8 font-serif text-7xl text-sand group-hover:text-parchment transition-colors pointer-events-none">
                  {letter}
                </div>
                <h3 className="font-serif text-2xl text-charcoal mb-3 relative z-10">{title}</h3>
                <p className="text-sm text-slate leading-relaxed max-w-xs relative z-10">{copy}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-32 bg-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="bg-white p-12 lg:p-20 rounded-2xl shadow-sm border border-sand">
              <h2 className="font-serif text-4xl lg:text-5xl text-forest mb-6">
                Better career decisions start with <span className="italic text-slate">better diagnostics.</span>
              </h2>
              <div className="flex flex-col items-center space-y-6">
                <PrimaryCtaLink href="/audit">Start the Career Audit</PrimaryCtaLink>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <SecondaryCtaLink href="/sample-score">See Sample Score</SecondaryCtaLink>
                  <SecondaryCtaLink href="/consultation">Talk to a Career Expert</SecondaryCtaLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
