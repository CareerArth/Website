export const siteConfig = {
  brandName: 'Career Arth',
  companyName: 'Symplfyd Education Private Limited',
  registeredOffice: 'B-9 Vasant Kunj, New Delhi, 110070, India',
  contactEmail: 'contact@careerarth.com',
  diagnosticFormUrl: 'https://forms.gle/XujesuyJ23NeHufK6',
  // Paste the deployed Google Apps Script web app URL here.
  consultationEndpoint: 'https://script.google.com/macros/s/AKfycbwDgUSAvgLEiZPjw8AU-D-s50SPC6QJlidmk2D9dfFxRamBpImOObKzligZNn5bsGVwvQ/exec',
  consultationMailto:
    'mailto:contact@careerarth.com?subject=Career%20Arth%20Consultation%20Request',
  socialLinks: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/careerarth/?viewAsMember=true',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/careerarth/',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@CareerArth',
    },
  ],
  // Leave blank until the final production domain is confirmed.
  siteUrl: '',
} as const;

export function getMetadataBase() {
  return siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined;
}
