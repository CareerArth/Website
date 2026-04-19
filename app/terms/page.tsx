import { PolicyPage } from '@/components/policy-page';
import { termsSections } from '@/lib/site-content';

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="This route is wired for production. Replace the placeholder sections with the final approved legal copy before launch."
      sections={termsSections}
    />
  );
}
