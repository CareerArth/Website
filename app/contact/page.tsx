import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { TrackedConsultationLink } from '@/components/tracked-consultation-link';
import { contactInfo } from '@/lib/site-content';

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Reach Career Arth"
        description="For diagnostic queries, privacy requests, and consultation support, connect with Career Arth directly."
      />
      <section className="pb-16 lg:pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-8">
          <Reveal className="bg-white rounded-xl border border-sand p-8">
            <h2 className="font-serif text-2xl text-forest mb-4">Primary Contact</h2>
            <div className="space-y-3 text-slate">
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
                Website routes: Home, Audit, Sample Score, Consultation, Thank You, Privacy, Terms, Refund, Contact.
              </p>
            </div>
          </Reveal>

          <Reveal className="bg-white rounded-xl border border-sand p-8 delay-100">
            <h2 className="font-serif text-2xl text-forest mb-4">Social</h2>
            <ul className="space-y-3 text-slate">
              {contactInfo.socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest border-b border-forest"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-12 mt-12">
          <TrackedConsultationLink
            href="/consultation"
            className="text-sm font-medium text-slate hover:text-forest border-b border-slate hover:border-forest pb-0.5 transition-colors"
            ctaType="contact_page"
          >
            Talk to a Career Expert
          </TrackedConsultationLink>
        </div>
      </section>
    </main>
  );
}
