import { PrimaryCtaLink, SecondaryCtaLink } from '@/components/cta-links';
import { Reveal } from '@/components/reveal';

const DIAGNOSTIC_FORM_URL = 'https://forms.gle/XujesuyJ23NeHufK6';

export default function HomePage() {
  return (
    <main>
      <section className="hero-section relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.08] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
            <Reveal active className="max-w-2xl">
              <p className="eyebrow-kicker mb-6">Strategic Career Diagnostic</p>
              <h1 className="font-work-sans text-5xl lg:text-7xl leading-[1.08] text-charcoal mb-7">
                Know your career risk <br />
                <span className="text-forest italic tracking-[-0.035em]">before it becomes expensive.</span>
              </h1>
              <p className="text-lg text-slate mb-11 leading-relaxed max-w-[34rem]">
                A 5-minute strategic diagnostic for ambitious professionals to identify hidden growth risks,
                capability gaps, and trajectory blind spots.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-7 mb-9">
                <PrimaryCtaLink href={DIAGNOSTIC_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Get My Free Career Diagnostic
                </PrimaryCtaLink>
                <SecondaryCtaLink href="/sample-score">Preview Sample Diagnostic Report</SecondaryCtaLink>
              </div>
              <p className="text-sm text-slate opacity-65 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Free diagnostic</span>
                <span>&bull;</span>
                <span>5 minutes</span>
                <span>&bull;</span>
                <span>Personalised report</span>
              </p>
            </Reveal>

            <Reveal active className="relative lg:h-[500px] flex justify-center lg:justify-end delay-100">
              <div className="diagnostic-card-dark w-full max-w-[36rem] p-9 lg:p-10 relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-b border-[#4b6254]/40 pb-5">
                  <div>
                    <div className="meta-label text-[#9cb4a5] mb-2">Career Arth</div>
                    <div className="text-[1.2rem] lg:text-[1.45rem] font-semibold tracking-[0.14em] uppercase text-[#edf2ed]">
                      Diagnostic Report
                    </div>
                  </div>
                  <div className="meta-label text-[#9cbf7f] inline-flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#9cbf7f] mr-2" />
                    Active
                  </div>
                </div>

                <div className="relative flex flex-col items-center mb-9">
                  <svg viewBox="0 0 100 50" className="w-full max-w-[260px]">
                    <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#3a4f45" strokeWidth="6" strokeLinecap="round" />
                    <path
                      d="M 10 45 A 40 40 0 0 1 90 45"
                      fill="none"
                      stroke="#b0a769"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="0 100"
                      pathLength="100"
                      className="gauge-fill"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-center">
                    <div className="text-6xl text-[#f4f7f2] leading-none mb-1 font-black">68</div>
                    <div className="score-label">Arth Score</div>
                  </div>
                </div>

                <div className="space-y-5 border-t border-[#4b6254]/40 pt-7">
                  <div>
                    <div className="flex justify-between text-sm uppercase tracking-[0.16em] text-[#9cb4a5] mb-2">
                      <span>Trajectory Risk</span>
                      <span className="text-[#d8c26f] normal-case tracking-normal font-semibold">Elevated</span>
                    </div>
                    <div className="w-full bg-[#3f5549] h-[3px] rounded-full overflow-hidden">
                      <div className="bg-[#d8c26f] h-full w-[70%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm uppercase tracking-[0.16em] text-[#9cb4a5] mb-2">
                      <span>Alignment</span>
                      <span className="text-[#edf2ed] normal-case tracking-normal font-semibold">Stable</span>
                    </div>
                    <div className="w-full bg-[#3f5549] h-[3px] rounded-full overflow-hidden">
                      <div className="bg-[#ecf2ed] h-full w-[45%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm uppercase tracking-[0.16em] text-[#9cb4a5] mb-2">
                      <span>Human Capital</span>
                      <span className="text-[#edf2ed] normal-case tracking-normal font-semibold">Growing</span>
                    </div>
                    <div className="w-full bg-[#3f5549] h-[3px] rounded-full overflow-hidden">
                      <div className="bg-[#d7dfd8] h-full w-[62%]" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-10 pt-4 text-[11px] text-[#6f8377] tracking-[0.12em] uppercase border-t border-[#4b6254]/40">
                  <span>Ref #CA-2026-0847</span>
                  <span>Career Arth Platform</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118%] h-[118%] bg-parchment rounded-full blur-3xl opacity-50 -z-10" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="content-section section-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-slate mb-4">How It Works</p>
            <h2 className="font-work-sans text-4xl lg:text-5xl text-forest tracking-tight">Three steps. Strategic clarity.</h2>
          </Reveal>
          <Reveal className="grid md:grid-cols-3 gap-6 delay-100">
            {[
              ['01', 'Take the 5-minute diagnostic', 'Answer focused questions designed to surface strategic blind spots.'],
              ['02', 'Get your Career Arth Score', 'Receive a concise diagnostic view across the core career dimensions.'],
              ['03', 'Decide your next move', 'Use your score to act directly or request an optional strategic consultation.'],
            ].map(([step, title, copy]) => (
              <div key={step} className="surface-card p-8">
                <p className="text-xs font-semibold text-gold tracking-[0.2em] uppercase mb-4">{step}</p>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{title}</h3>
                <p className="text-sm text-slate leading-relaxed">{copy}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-8 section-ivory border-y border-sand/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-center text-sm md:text-base text-slate">
            Built using strategic career diagnostic frameworks for ambitious professionals.
          </p>
        </div>
      </section>

      <section id="problem" className="content-section bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            <Reveal className="lg:col-span-5">
              <h2 className="font-work-sans text-4xl lg:text-5xl text-forest leading-tight tracking-tight mb-6">
                Hard work does not always <br />
                <span className="italic text-slate">create strategic progress.</span>
              </h2>
              <p className="text-slate leading-relaxed mb-6">
                You can be executing well and still drift into stagnation. Career Arth is built to detect silent risk
                before it compounds into expensive decisions.
              </p>
            </Reveal>

            <Reveal className="lg:col-span-6 lg:col-start-7 flex flex-col border-t border-b border-sand delay-100">
              <div className="p-8 border-b border-sand hover:bg-ivory/70 transition-colors">
                <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-3">Hidden Risks</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">Weak positioning and poor decision timing</h3>
                <p className="text-sm text-slate">
                  Market value can plateau when your role narrative, signal, and timing are misaligned with where the
                  market is moving.
                </p>
              </div>
              <div className="p-8 hover:bg-ivory/70 transition-colors">
                <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-3">What This Looks Like</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">Compensation plateaus and low-signal growth</h3>
                <p className="text-sm text-slate">
                  Common signals include plateaued compensation trajectory, low-signal skill growth, and unclear market
                  narrative during key inflection points.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="framework" className="content-section section-ivory scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-medium uppercase tracking-widest text-slate mb-4">The Methodology</p>
            <h2 className="font-work-sans text-4xl lg:text-5xl text-forest tracking-tight mb-6">The ARTH Score</h2>
            <p className="text-slate">
              A branded four-part diagnostic that reveals where your strategy is aligned, exposed, or compounding.
            </p>
          </Reveal>

          <Reveal className="framework-shell delay-100">
            <div className="grid md:grid-cols-2 gap-px bg-sand rounded-xl overflow-hidden border border-sand">
              {[
                ['A', 'Alignment', 'Are your strengths, ambitions, and current path actually aligned?'],
                ['R', 'Risk Exposure', 'How vulnerable is your career to disruption, stagnation, or weak positioning?'],
                ['T', 'Trajectory', 'Is your career compounding upward—or quietly plateauing?'],
                ['H', 'Human Capital', 'Are you building durable, high-signal capabilities that create long-term leverage?'],
              ].map(([letter, title, copy]) => (
                <div key={title} className="bg-white p-10 lg:p-14 relative group hover:bg-ivory transition-colors">
                  <div className="absolute top-8 right-8 text-7xl text-sand group-hover:text-parchment transition-colors pointer-events-none font-black">
                    {letter}
                  </div>
                  <h3 className="text-2xl font-semibold text-charcoal mb-3 relative z-10">{title}</h3>
                  <p className="text-sm text-slate leading-relaxed max-w-xs relative z-10">{copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="cta-section section-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="surface-card cta-dark-shell p-12 lg:p-20">
              <h2 className="font-work-sans text-4xl lg:text-5xl text-ivory tracking-tight mb-6">
                Better career decisions start with <span className="italic text-[#b8c8be]">better diagnostics.</span>
              </h2>
              <p className="text-[#d6e1d9] mb-8 max-w-2xl mx-auto">
                The diagnostic identifies signals. Consultation helps interpret those signals and build a practical
                action plan.
              </p>
              <div className="flex flex-col items-center space-y-6">
                <PrimaryCtaLink href={DIAGNOSTIC_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Get My Free Career Diagnostic
                </PrimaryCtaLink>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <SecondaryCtaLink
                    href="/sample-score"
                    className="!text-ivory !border-ivory/80 hover:!text-white hover:!border-white bg-white/5 px-2 py-1 rounded-sm"
                  >
                    Preview Sample Diagnostic Report
                  </SecondaryCtaLink>
                  <SecondaryCtaLink
                    href="/consultation"
                    className="!text-ivory !border-ivory/80 hover:!text-white hover:!border-white bg-white/5 px-2 py-1 rounded-sm"
                  >
                    Request Strategic Consultation
                  </SecondaryCtaLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-section section-soft">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <Reveal className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-slate mb-4">FAQ</p>
            <h2 className="font-work-sans text-4xl lg:text-5xl text-forest tracking-tight">Common Questions</h2>
          </Reveal>
          <Reveal className="surface-card surface-card-soft faq-shell p-8 lg:p-10 space-y-7 delay-100">
            {[
              ['Is this free?', 'Yes. The diagnostic is free and takes about 5 minutes.'],
              ['Who is this for?', 'Ambitious professionals who want strategic clarity on growth, positioning, and next moves.'],
              ['Is this generic AI advice?', 'No. The framework is diagnostic-led and designed for strategic career decision quality, not generic output.'],
              ['Will someone contact me?', 'Only if you request consultation. Consultation remains a manual follow-up flow.'],
            ].map(([q, a]) => (
              <div key={q} className="border-b border-sand pb-5 last:border-b-0 last:pb-0">
                <h3 className="text-2xl font-semibold text-charcoal mb-2">{q}</h3>
                <p className="text-slate">{a}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
