# SES setup notes

1. Verify the sending domain or the exact sender mailbox used in `SES_FROM_EMAIL`.
2. Verify `contact@careerarth.com` if SES is still in sandbox.
3. Move SES out of sandbox before public launch.
4. Add SPF, DKIM, and DMARC records for the domain.
5. Use `no-reply@careerarth.com` or another approved transactional sender for user confirmations.
6. Review bounce and complaint metrics in SES and route them into SNS if operations need alerting.
