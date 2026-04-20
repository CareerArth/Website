import { ConsultationForm } from '@/components/forms/consultation-form';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { siteConfig } from '@/lib/site-config';

export default function ConsultationPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
      <PageHero
        eyebrow="Strategic Advisory"
        title={
          <>
            Discuss Your <br />
            Career Strategy
          </>
        }
        description="A high-impact conversation for professionals navigating critical career decisions, shifts, or stagnation."
      />
      <div className="grid lg:grid-cols-2 gap-20 items-start mt-8">
        <Reveal>
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-charcoal">What this includes:</h3>
            <ul className="space-y-4">
              {[
                ['Positioning Analysis:', 'Audit of your current market value.'],
                ['Risk Identification:', 'Pinpointing the invisible erosion points.'],
                ['Strategic Direction:', 'Mapping the next 24-36 months.'],
              ].map(([title, copy]) => (
                <li key={title} className="flex items-start space-x-3 text-sm text-slate">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2" />
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
              <h2 className="font-serif text-2xl text-forest mb-3">Request a consultation</h2>
              <p className="text-sm text-slate leading-relaxed">
                Consultation requests are handled manually. Share your contact details below and the Career Arth team
                will review your request and follow up directly.
              </p>
            </div>
            <div className="bg-ivory border border-sand rounded-xl p-6 space-y-3 text-sm text-slate">
              <p>{siteConfig.companyName}</p>
              <p>{siteConfig.registeredOffice}</p>
              <p>
                Contact:{' '}
                <a className="text-forest border-b border-forest" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>
              </p>
              <p>Consultation remains a manual follow-up flow.</p>
            </div>
            <ConsultationForm />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
