import { PolicyPage } from '@/components/policy-page';
import { termsSections } from '@/lib/site-content';

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="The terms governing access to the Career Arth website, services, content, and consultations."
      sections={termsSections}
    />
  );
}
