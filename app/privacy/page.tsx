import { PolicyPage } from '@/components/policy-page';
import { privacySections } from '@/lib/site-content';

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="The current approved privacy copy from the static website has been preserved here."
      sections={privacySections}
    />
  );
}
