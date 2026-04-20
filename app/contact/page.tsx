import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { contactInfo } from '@/lib/site-content';
import { siteConfig } from '@/lib/site-config';

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Reach Career Arth"
        description="For diagnostic enquiries, strategic questions, and manual consultation requests, contact the Career Arth team directly."
      />
      <section className="pb-16 lg:pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-8">
          <Reveal className="bg-white rounded-xl border border-sand p-8">
            <h2 className="font-serif text-2xl text-forest mb-4">Primary Contact</h2>
            <div className="space-y-3 text-slate">
              <p>{siteConfig.companyName}</p>
              <p>{siteConfig.registeredOffice}</p>
              <p>
                General enquiries:{' '}
                <a className="text-forest border-b border-forest" href={`mailto:${contactInfo.primaryEmail}`}>
                  {contactInfo.primaryEmail}
                </a>
              </p>
              <p>
                Privacy requests:{' '}
                <a className="text-forest border-b border-forest" href={`mailto:${contactInfo.privacyEmail}`}>
                  {contactInfo.privacyEmail}
                </a>
              </p>
              <p>
                Consultation requests are handled manually by email.
              </p>
            </div>
          </Reveal>

          <Reveal className="bg-white rounded-xl border border-sand p-8 delay-100">
            <h2 className="font-serif text-2xl text-forest mb-4">Social Links</h2>
            <ul className="space-y-3 text-slate">
              {siteConfig.socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-forest border-b border-forest">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate mt-6">Follow Career Arth for new insights, videos, and brand updates.</p>
          </Reveal>
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-12 mt-12">
          <a
            href={siteConfig.consultationMailto}
            className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
          >
            Talk to a Career Expert
          </a>
        </div>
      </section>
    </main>
  );
}
