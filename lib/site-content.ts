export const navigationLinks = [
  { href: '/#problem', label: 'The Problem' },
  { href: '/#framework', label: 'Framework' },
  { href: '/sample-score', label: 'Sample Score' },
];

export const footerLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/contact', label: 'Contact' },
];

export const contactInfo = {
  primaryEmail: 'contact@careerarth.com',
  privacyEmail: 'privacy@careerarth.com',
  socialPlaceholders: [
    'LinkedIn: PLACEHOLDER_LINKEDIN_URL',
    'Instagram: PLACEHOLDER_INSTAGRAM_URL',
    'X / Twitter: PLACEHOLDER_X_URL',
  ],
};

export const privacySections = [
  {
    title: '1. Data Collection',
    body:
      'We collect information necessary to provide your career diagnostic, including your name, professional role, years of experience, and email address. This information is used solely for generating your Career Arth report and subsequent strategic communication.',
  },
  {
    title: '2. Usage of Data',
    body:
      'Your data is used to calculate your ARTH score and provide context-aware professional advice. We do not sell, rent, or trade your personal data to third-party marketing companies.',
  },
  {
    title: '3. Security',
    body:
      'We implement industry-standard security measures to protect your information. Career diagnostics often contain sensitive professional context; we treat this data with the highest degree of confidentiality.',
  },
  {
    title: '4. Contact',
    body:
      'For any questions regarding your data or to request data deletion, please contact us at privacy@careerarth.com.',
  },
] as const;

export const termsSections = [
  {
    title: 'PLACEHOLDER: Approved terms required',
    body:
      'Replace this draft with the final approved Terms and Conditions copy before production launch. The page structure and routing are ready for deployment.',
  },
  {
    title: 'Use of Website',
    body:
      'Visitors may access the website and forms for lawful personal and business inquiry purposes only. Unauthorized scraping, abuse, or interference with the website is prohibited.',
  },
  {
    title: 'Consultation and Audit Services',
    body:
      'All advisory material, diagnostics, and consultation outputs are informational and strategic in nature. They do not constitute legal, tax, or financial advice unless explicitly stated in a signed agreement.',
  },
  {
    title: 'Intellectual Property',
    body:
      'All website copy, design, frameworks, diagnostic concepts, and brand assets remain the property of Career Arth unless otherwise licensed in writing.',
  },
] as const;

export const refundSections = [
  {
    title: 'PLACEHOLDER: Approved refund policy required',
    body:
      'Replace this draft with the final approved Refund, Cancellation and Rescheduling Policy before production launch.',
  },
  {
    title: 'Consultation Rescheduling',
    body:
      'Consultation sessions may be rescheduled with advance notice subject to calendar availability. Same-day changes should be handled manually by the operations team.',
  },
  {
    title: 'Cancellation',
    body:
      'Paid sessions may be eligible for cancellation or credit only under the final approved policy. Confirm the operational rules and timelines before accepting payments.',
  },
  {
    title: 'Refund Processing',
    body:
      'If a refund is approved under the final policy, the finance or payment operations owner should process it through the original payment method and notify the user by email.',
  },
] as const;
