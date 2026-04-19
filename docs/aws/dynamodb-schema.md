# DynamoDB schema

Use a single table named `CareerArthApp`.

## Primary key
- `PK` (string)
- `SK` (string)

## Optional GSI
- `GSI1PK` (string)
- `GSI1SK` (string)

## Record shapes

### Submission records
- `PK`: `SUBMISSION#audit_lead` or `SUBMISSION#consultation`
- `SK`: `<ISO timestamp>#<uuid>`
- `GSI1PK`: `EMAIL#<normalized email>`
- `GSI1SK`: `<ISO timestamp>#<record type>`
- `recordType`: `audit_lead` or `consultation`
- `status`: `new`
- `createdAt`: ISO string
- `ttl`: epoch seconds
- form payload fields
- `sourceIpHash`
- `userAgent`
- `origin`

### Rate limit records
- `PK`: `RATE_LIMIT#<route>#<sha256-ip>`
- `SK`: `WINDOW#<windowStartEpoch>`
- `recordType`: `rate_limit`
- `count`: number
- `ttl`: epoch seconds

## Table settings
- Billing mode: On-demand
- TTL attribute: `ttl`
- Point-in-time recovery: Enabled
- SSE: AWS owned KMS or customer managed KMS
