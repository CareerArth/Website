import { PolicyPage } from '@/components/policy-page';
import { privacySections } from '@/lib/site-content';

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Career Arth collects, uses, stores, and protects your personal data."
      sections={privacySections}
    />
  );
}
