# Private email delivery setup — 7 October 2026

Public contact and form destination: **htafl@africamail.com**.
Sending account: **dyrctkm@gmail.com**, chosen by the owner.
No other sender is configured. The recipient mailbox does not need SMTP access
to receive messages sent through this Gmail account.

Run `npm run email:setup` and open the printed local address. On the sending
Google account, enable two-step verification and create a Google App Password.
Enter that credential only in the masked local field, never in chat. Do not use
the normal account password. Some Google account configurations restrict App
Passwords; consult the official account guidance if the option is unavailable.

The helper verifies encrypted `smtp.gmail.com:465` authentication without sending
mail, then saves private Git-ignored settings. It preserves administrator details,
clears the browser credential field and closes after 30 minutes. The setup also
lets the owner privately configure reviewer access; only a salted hash is saved.

On Netlify, configure these privately with Functions scope:
`SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`,
`SMTP_USER=dyrctkm@gmail.com`, `SMTP_FROM=dyrctkm@gmail.com`, and verified `SMTP_PASS`.
The application delivers to htafl@africamail.com and retains each enquirer's
validated Reply-To address. The backend also supports port 587 with required
STARTTLS. Other account/provider settings do not enable sending.

Restart/redeploy, run `npm run backend:check`, then use `npm run email:test` for
the authorized participation submission. Confirm receipt in the africamail.com
inbox/spam folder independently; SMTP acceptance alone does not prove receipt.
Current local review: SMTP authentication passes, and an owner-authorized
participation submission was received at htafl@africamail.com, confirmed by the
owner. Administrator setup and deployed-host checks remain pending. See [Netlify launch](netlify-launch.md).
Never publish `.env` or send passwords in chat.

Official sources: [Google App Passwords](https://support.google.com/accounts/answer/185833),
[Nodemailer SMTP transport](https://nodemailer.com/smtp).
