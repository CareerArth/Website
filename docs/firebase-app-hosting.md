# Firebase App Hosting

This project is set up for Firebase App Hosting, which Firebase currently recommends for full-stack Next.js apps.

Official references:
- https://firebase.google.com/docs/app-hosting/get-started
- https://firebase.google.com/docs/app-hosting/configure
- https://firebase.google.com/docs/hosting/frameworks/nextjs

## Files added for Firebase

- `apphosting.yaml`: App Hosting runtime and environment configuration
- `.firebaserc.example`: placeholder Firebase project mapping

## Deploy steps

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in:
   ```bash
   firebase login
   ```
3. Copy `.firebaserc.example` to `.firebaserc` and set your Firebase project id.
4. In Firebase Console, create an App Hosting backend for this repo.
5. Point the backend to the repository root.
6. Add the values from `apphosting.yaml` in the backend config if you prefer managing them in Console instead of source.
7. Set `NEXT_PUBLIC_API_BASE_URL` to the live AWS API Gateway base URL.
8. Set the live branch and trigger the first rollout.

## Notes

- The Next.js frontend deploys on Firebase App Hosting.
- The form APIs remain on AWS API Gateway and Lambda.
- `NEXT_PUBLIC_API_BASE_URL` must stay configured, otherwise the forms will post to same-origin `/api/*`, which this Firebase frontend does not implement locally.
- If you later migrate the API to Firebase Functions or Cloud Run, update `NEXT_PUBLIC_API_BASE_URL` accordingly.
