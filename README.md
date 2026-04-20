# Career Arth website

Career Arth is a Next.js + TypeScript + Tailwind website prepared for Firebase App Hosting.

## Production details

- Brand: Career Arth
- Company: Symplfyd Education Private Limited
- Registered office: B-9 Vasant Kunj, New Delhi, 110070, India
- Contact: contact@careerarth.com
- Diagnostic form: https://forms.gle/XujesuyJ23NeHufK6
- Consultation flow: manual via email

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Firebase App Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in:
   ```bash
   firebase login
   ```
3. Create an App Hosting backend in Firebase Console and connect this repository.
4. Set the app root to the repository root.
5. Roll out the production branch.

If the final production domain changes, update `siteUrl` in `lib/site-config.ts`.

## Deploy fix note

- Removed unused AWS, API, captcha, and backend placeholder flow from the production website
- Switched the diagnostic path to the live Google Form
- Switched consultation handling to manual email-based contact
- Replaced placeholder legal, company, contact, address, and social values with production values
- Upgraded Next.js and cleaned unused backend dependencies from the app package
