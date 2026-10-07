# Private backup and recovery

Target: https://htaflco.netlify.app, private `htafl-community-production` store.
Tools use the existing Netlify package and native Node crypto; no dependency added.

## Create, verify and store

1. Use a trusted, updated computer with Netlify CLI signed in. Pause review and
   new uploads while taking a recovery snapshot if consistency is essential.
2. Run `npm run backup:create`. It checks the linked final project and HTTPS
   address, reads every page of private records and their WebP images with strong
   consistency, and checks each record again before sealing it. A changed/missing
   record stops the backup; retry after review activity stops.
3. The result is an AES-256-GCM authenticated, compressed `.htaflbk` archive under
   ignored `var/backups/`. The separate random recovery key is in
   `var/secrets/backup.key`. No credentials, administrator sessions, SMTP secrets
   or access tokens are included. Never upload the key alongside the archive.
4. Run `npm run backup:verify -- <archive-path>` after creation and after copying
   back from remote storage. A wrong key, changed ciphertext or image integrity
   failure stops verification. Keep the key separately in a protected password
   manager attachment or separate secure offline storage; losing it makes the
   archive unrecoverable.
5. Owner-selected remote destination: **mail.com Drive**, signed in as
   **htafl@africamail.com**. Upload only the encrypted `.htaflbk` file through your
   signed-in Drive interface. Use a private folder, disable public/shared links,
   enable the account's available sign-in protection and download the copy for
   verification. No connected Drive uploader is configured; remote upload must
   be confirmed by the owner. Never send passwords or keys in chat.

Use backups after a review batch and before a significant deployment; check them
at least weekly while submissions are active. This is an owner-run process, not
an automatic scheduled service. Keep only recovery copies that remain necessary;
delete/replace old archives after withdrawals. Windows folder ACLs must restrict
access to the operator, necessary local execution account and SYSTEM; POSIX file
modes alone do not set Windows ACLs. These private folder ACLs were applied on
this workstation, including access for its actual `clint` owner.

The small-library tool has a 64 MB uncompressed archive ceiling and aborts rather
than silently omitting records. Move to a streaming backup if the library grows.
Snapshots are not a transactional freeze of the entire store; pause submissions
and review for a coordinated snapshot. Hosting and SMTP configuration must be
recreated separately from privately maintained configuration/password-manager
records. GitHub holds website code; it does not back up community submissions.

## Recovery drill and actual recovery

1. Download the private archive and restore the separate key locally if needed.
   Verify first. Never place either under public assets or commit them to Git.
2. Run `npm run backup:recover -- <archive-path>`. Authentication and all entries
   are checked before writing. Output goes to a new ignored `var/recovery/`
   directory. Existing folders are refused. No live store is overwritten.
3. Check recovered record/image counts and the affected images privately. Records
   are pending, publication permission is false, and old approval dates are
   removed. Recovery never automatically republishes work.
4. Compare references against the private deletion/withdrawal ledger. Remove any
   withdrawn or expired records and recheck consent. Recovered data may be stale.
5. For a local service, set `UPLOAD_DIR` to the verified private recovery folder
   and restart only after inspection. For Netlify, use an operator-reviewed
   migration into the correct private store; this tool deliberately provides no
   live overwrite command. Obtain fresh permission before approval. Keep live
   writes paused during a real migration and test private/public boundaries again.
6. Delete the temporary recovery folder after the drill unless it is the agreed
   replacement private store. Record counts, date, outcome and the operator in a
   private recovery log, without embedding submitter details in the public repo.

Automated tests exercise a real WebP round-trip, pending/private recovered state,
tampered archive/wrong-key refusal, unsafe identifiers and overwrite refusal.
An empty production store produces a valid **zero-record** archive; that verifies
connectivity and encryption, not a live non-empty disaster recovery.

Official references checked 7 October 2026:
[Netlify Blobs consistency and pagination](https://docs.netlify.com/build/data-and-storage/netlify-blobs/),
[Node authenticated encryption](https://nodejs.org/api/crypto.html).

## First setup evidence — 7 October 2026

The final production store was read successfully. It contained zero records.
An encrypted 215-byte archive was created locally, authenticated, and recovered
to a new private folder with zero records and no publication. The real-image
recovery drill uses isolated test data; no fake community work was published.
The archive and separate key are ignored by Git and excluded from the public
build. Upload to mail.com Drive and a downloaded-copy verification remain pending
owner action. Keep the recovery key separately before removing this workstation.
