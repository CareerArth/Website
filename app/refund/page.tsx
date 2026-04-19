import { PolicyPage } from '@/components/policy-page';
import { refundSections } from '@/lib/site-content';

export default function RefundPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Refund, Cancellation and Rescheduling Policy"
      description="This route is wired for production. Replace the placeholder sections with the final approved policy before launch."
      sections={refundSections}
    />
  );
}
