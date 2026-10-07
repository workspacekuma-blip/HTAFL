# Private email delivery setup — 7 October 2026

HTAFL uses only **htafl@africamail.com** as its contact, sending account and form
recipient. The mailbox is hosted by mail.com. No alternative sender or fallback
email provider is configured.

The owner confirmed this account lacks mail.com Premium/SMTP access. Mail.com’s
current documentation says SMTP requires Premium. Delivery therefore remains
unavailable until SMTP access is enabled for this account and verified privately.
No subscription has been purchased or changed. The existing contact links still
open the user's email application; uploads remain stored privately for review.

Run `npm run email:setup` and open the local address printed on your computer.
After enabling SMTP, enter the provider's credential only in the masked field.
Use an application-specific password when two-factor authentication is enabled.
The helper checks encrypted `smtp.mail.com:465` authentication without sending
mail, then saves private Git-ignored settings. It preserves administrator settings,
clears the browser credential field and closes after 30 minutes.

The same account must be configured in the host's private Functions environment:
`SMTP_HOST=smtp.mail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`,
`SMTP_USER=htafl@africamail.com`, `SMTP_FROM=htafl@africamail.com`, `SMTP_PASS`.
Port 587 with required STARTTLS is also supported by the backend. The sender and
host are checked before enabling delivery; incompatible legacy settings cannot
silently activate another account.

Restart/redeploy, run `npm run backend:check`, then use `npm run email:test` for
the authorized participation submission. Confirm inbox receipt independently;
SMTP acceptance alone does not prove receipt. No real email has been sent.
See [Netlify launch](netlify-launch.md). Never publish `.env` or send passwords in chat.

Official sources: [mail.com domains](https://www.mail.com/mail/domains/),
[SMTP settings](https://support.mail.com/premium/imap/server.html),
[SMTP/Premium and application-password requirements](https://www.mail.com/blog/posts/what-is-imap-pop3/86/).
