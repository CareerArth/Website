import { PolicyPage } from '@/components/policy-page';
import { refundSections } from '@/lib/site-content';

export default function RefundPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Refund, Cancellation and Rescheduling Policy"
      description="The policy governing cancellations, rescheduling, duplicate charges, and approved refunds."
      sections={refundSections}
    />
  );
}
