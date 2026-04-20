# Career Arth AWS deployment project

This repository now contains:
- a production-oriented Next.js + TypeScript + Tailwind frontend
- AWS Lambda handlers for API Gateway-backed form submissions
- DynamoDB persistence design
- SES email workflow wiring
- Amplify hosting configuration
- Firebase App Hosting configuration

## Project structure

```text
app/                     Next.js App Router pages
components/              Shared UI and form components
lib/                     Shared frontend content and helpers
aws/lambda/src/          Lambda handlers and shared server utilities
docs/aws/                AWS deployment notes
legacy html files        Original approved static source used for migration
```

## Implemented routes

Frontend:
- `/`
- `/audit`
- `/sample-score`
- `/consultation`
- `/thank-you`
- `/privacy`
- `/terms`
- `/refund`
- `/contact`

Backend via API Gateway + Lambda:
- `POST /api/audit-lead`
- `POST /api/consultation`

## Placeholders that must be replaced before launch

- `CAPTCHA_VERIFY_URL`
- `CAPTCHA_SECRET_KEY`
- `CAPTCHA_PLACEHOLDER_TOKEN`
- `NEXT_PUBLIC_CAPTCHA_PLACEHOLDER_TOKEN`
- `NEXT_PUBLIC_SITE_URL` in `apphosting.yaml`
- `NEXT_PUBLIC_API_BASE_URL` in `apphosting.yaml`
- Terms and refund legal copy in `lib/site-content.ts`
- Social URLs in `lib/site-content.ts`

## Local setup

1. Install dependencies.
   ```bash
   npm install
   ```
2. Copy the environment template.
   ```bash
   cp .env.example .env.local
   ```
3. Fill every placeholder value in `.env.local`.
4. Start the frontend.
   ```bash
   npm run dev
   ```

## AWS setup

### 1. DynamoDB

1. Create the `CareerArthApp` table with:
   - partition key: `PK` (string)
   - sort key: `SK` (string)
2. Add GSI 1:
   - partition key: `GSI1PK` (string)
   - sort key: `GSI1SK` (string)
3. Enable TTL on the `ttl` attribute.
4. Enable point-in-time recovery.
5. Review `docs/aws/dynamodb-schema.md`.

### 2. SES

1. Verify the sender domain or mailbox used by `SES_FROM_EMAIL`.
2. Verify `contact@careerarth.com` while SES is in sandbox.
3. Move SES out of sandbox for production use.
4. Add DKIM, SPF, and DMARC for the sender domain.
5. Review `docs/aws/ses-setup.md`.

### 3. Lambda build and deploy

1. Build the Lambda bundles.
   ```bash
   npm run lambda:build
   ```
2. Create two Lambda functions using Node.js 20.x.
3. Upload:
   - `dist/lambda/audit-lead.js`
   - `dist/lambda/consultation.js`
4. Set environment variables on both functions:
   - `APP_ENV`
   - `ALLOWED_ORIGINS`
   - `DDB_TABLE_NAME`
   - `AWS_REGION`
   - `SES_FROM_EMAIL`
   - `SES_NOTIFY_EMAIL`
   - `CAPTCHA_VERIFY_URL`
   - `CAPTCHA_SECRET_KEY`
   - `CAPTCHA_PLACEHOLDER_TOKEN`
   - `RATE_LIMIT_MAX`
   - `RATE_LIMIT_WINDOW_SECONDS`
5. Attach an IAM role with permissions for:
   - `dynamodb:PutItem`
   - `dynamodb:UpdateItem`
   - `ses:SendEmail`
   - `ses:SendRawEmail` if you later switch to raw emails

### 4. API Gateway

1. Create an HTTP API.
2. Add integrations for both Lambda functions.
3. Create routes exactly as documented in `docs/aws/api-gateway-route-mapping.md`.
4. Configure CORS for the final public domain only.
5. Deploy the API and copy the invoke URL.

### 5. Amplify Hosting

1. Create a new Amplify app connected to this repository.
2. Use the provided `amplify.yml`.
3. Set the app type to Next.js SSR / Web Compute.
4. Add environment variables in Amplify:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_CAPTCHA_PLACEHOLDER_TOKEN`
5. Trigger a build and deploy.
6. Review `docs/aws/amplify-deployment.md`.

## Firebase App Hosting setup

Firebase currently recommends App Hosting for full-stack Next.js apps rather than framework-aware Hosting preview. I configured this repo for that path.

1. Install Firebase CLI.
   ```bash
   npm install -g firebase-tools
   ```
2. Log in.
   ```bash
   firebase login
   ```
3. Copy `.firebaserc.example` to `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID`.
4. Review `apphosting.yaml` and replace:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_CAPTCHA_PLACEHOLDER_TOKEN`
5. In Firebase Console, create an App Hosting backend and connect this repository.
6. Set the app root to the repository root.
7. Use the desired live branch, usually `main`.
8. Trigger the first rollout.
9. Review `docs/firebase-app-hosting.md`.

Firebase App Hosting notes:
- This deploys the Next.js frontend.
- The backend APIs stay on AWS unless you intentionally migrate them.
- `NEXT_PUBLIC_API_BASE_URL` must point at your deployed AWS API Gateway base URL.

## Deploy fix note

- Upgraded `next` from `15.3.2` to `15.5.3`
- Upgraded `react` and `react-dom` to `19.1.1`
- Updated React type packages to current compatible 19.1 releases
- Removed invalid placeholder env values from `apphosting.yaml` so Firebase App Hosting does not inherit broken deploy-time values
- Environment values such as `NEXT_PUBLIC_API_BASE_URL` should now be set in Firebase App Hosting configuration instead of committed placeholder values

## Security controls included

- secure headers in `next.config.mjs`
- no client-side secrets
- origin allowlist checks in Lambda
- honeypot field on both forms
- zod validation and sanitization on the server
- rate limiting in DynamoDB
- captcha verification hook with a clearly marked placeholder path
- SES notifications and user confirmations routed from Lambda only

## Operational checks before go-live

1. Replace placeholder legal copy and social links.
2. Replace the captcha placeholders with a real provider integration.
3. Confirm SES production access.
4. Confirm API Gateway CORS matches the final domain.
5. Submit both forms from the live Amplify domain.
6. Verify DynamoDB writes and both SES emails.
