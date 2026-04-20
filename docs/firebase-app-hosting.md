# Firebase App Hosting

This project is set up for Firebase App Hosting.

Official references:
- https://firebase.google.com/docs/app-hosting/get-started
- https://firebase.google.com/docs/app-hosting/configure
- https://firebase.google.com/docs/hosting/frameworks/nextjs

## Files used for Firebase

- `apphosting.yaml`: App Hosting runtime configuration
- `package.json`: standard Next.js build scripts

## Deploy steps

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in:
   ```bash
   firebase login
   ```
3. In Firebase Console, create an App Hosting backend for this repo.
4. Point the backend to the repository root.
5. Set the live branch and trigger the rollout.
6. If you have a final custom domain, set it in `lib/site-config.ts` under `siteUrl`.

## Notes

- The Next.js frontend deploys on Firebase App Hosting.
- The diagnostic CTA opens the live Google Form directly.
- Consultation requests are handled manually through `contact@careerarth.com`.
