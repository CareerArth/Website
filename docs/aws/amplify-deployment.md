# Amplify deployment notes

1. Create a new Amplify app connected to the repository.
2. Use the provided `amplify.yml` build spec.
3. Set the platform to Next.js SSR / Web Compute.
4. Add all frontend and backend environment variables from `.env.example`.
5. Set `NEXT_PUBLIC_API_BASE_URL` to the deployed API Gateway invoke URL.
6. Add the production domain in Amplify Hosting and then include the final domain in `ALLOWED_ORIGINS`.
7. After deploy, validate every public route and both API submissions from the live domain.
