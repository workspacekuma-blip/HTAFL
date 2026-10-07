# Private email delivery setup — 7 October 2026

The public contact and all form delivery now use **htafl@africamail.com**.
The owner asked for free sending after confirming this mailbox lacks mail.com
Premium/SMTP access. The existing **htaflco@gmail.com** account is retained only
as the sending account via Gmail SMTP; it is not a public website contact.
No paid mail.com upgrade is needed to receive mail at the new inbox.

Run `npm run email:setup` locally and open the printed loopback address.
Create an App Password for the sending Google account with two-step verification,
then enter it only in the masked local field. The helper verifies TLS access to
`smtp.gmail.com:465` before atomically saving private Git-ignored configuration.
It sends no email during verification, preserves other settings, clears secrets
from the browser and closes after 30 minutes. Credentials are never logged.
The same screen stores only a salted administrator hash and the reviewer assignment.

Restart the local website after saving. Run `npm run backend:check` and then
`npm run email:test` to make the owner-authorized participation submission.
Confirm actual receipt in the africamail.com inbox/spam folder: SMTP acceptance
alone is not inbox confirmation. No real submission has been sent yet.

On Netlify, enter these privately with Functions scope:
`SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`,
`SMTP_USER=htaflco@gmail.com`, `SMTP_FROM=htaflco@gmail.com`, and the verified
`SMTP_PASS`. The application recipient remains htafl@africamail.com.
Never publish `.env` or paste passwords in chat. See [Netlify deployment](netlify-launch.md).

Official sources: [Google App Passwords](https://support.google.com/accounts/answer/185833),
[mail.com domains](https://www.mail.com/mail/domains/),
[mail.com SMTP and Premium restrictions](https://www.mail.com/blog/posts/what-is-imap-pop3/86/).
SMTP access is only a sending requirement; the recipient's free inbox can receive mail.
