# API Gateway route mapping

Create an HTTP API in Amazon API Gateway and map the following routes:

| Method | Route | Lambda handler |
| --- | --- | --- |
| POST | `/api/audit-lead` | `dist/lambda/audit-lead.js` export `handler` |
| POST | `/api/consultation` | `dist/lambda/consultation.js` export `handler` |
| OPTIONS | `/api/audit-lead` | Mock or Lambda-based CORS response |
| OPTIONS | `/api/consultation` | Mock or Lambda-based CORS response |

Recommended API Gateway settings:
- Enable only the approved origins from `ALLOWED_ORIGINS`.
- Pass through `Origin`, `X-Forwarded-For`, and `User-Agent` headers.
- Use stage variables only for non-secret values.
- Attach CloudWatch logging at the stage level.
