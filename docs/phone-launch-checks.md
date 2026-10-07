# Deployed phone checks — HTAFL

The owner has access to both Android and iPhone. Tests below must run on the actual
phones against the final HTTPS Netlify address. Local viewport emulation does not
count. On 7 October 2026 the owner reported that both phones passed the menu,
sideways-scrolling, resource-search and opening-a-form-from-Get-Involved checks
on `https://htafl-890.netlify.app/`. Device models, OS/browser versions and the
remaining checks have not been supplied or independently verified.

The owner subsequently selected `https://htaflco.netlify.app` as the final site.
The owner subsequently confirmed completing administrator sign-in and repeating
the menu, scrolling, resource-search and involvement-form checks on the final
site. These are owner-reported basic checks; the remaining detailed tests and
device/version details below still require recording.

Record the deployed URL, deployment ID, test date, phone model, OS and browser
version, and pass/fail for each check. Do not record passwords or private artwork.

| Check | Android / Chrome | iPhone / Safari |
| --- | --- | --- |
| HTTPS opens without a certificate warning | Pending | Pending |
| Home, About, Create, Overcome and Community load | Pending | Pending |
| Resources, Merchandise and all five involvement pathways load | Pending | Pending |
| No sideways scrolling in the owner's tested view | Owner reports pass | Owner reports pass |
| Mobile menu works in the owner's tested view | Owner reports pass | Owner reports pass |
| Landscape, clipped text and scrolling restoration | Pending | Pending |
| Background page stays still while the menu is open | Pending | Pending |
| Research and social links open separately without losing the site | Pending | Pending |
| Resource search works | Owner reports pass | Owner reports pass |
| Resource filters/reset and browser Back work | Pending | Pending |
| Opening a form from Get Involved works | Owner reports pass | Owner reports pass |
| Get Involved index itself contains no form | Live HTTP check passes | Live HTTP check passes |
| Onscreen keyboard leaves labels, errors and submit controls reachable | Pending | Pending |
| Invalid enquiry identifies the field; corrected enquiry gets a real result | Pending | Pending |
| Small owner-created JPEG/PNG selects, previews and uploads privately | Pending | Pending |
| Unsupported or oversized upload gets an understandable error | Pending | Pending |
| Slow connection and retry do not report false submission success | Pending | Pending |
| Reduced motion displays a static material study without pointer movement | Pending | Pending |
| Larger text remains readable and controls stay reachable | Pending | Pending |
| VoiceOver / TalkBack reads labels, menu state, errors and status | Pending | Pending |
| Review dashboard signs in, reviews, withdraws and signs out | Pending | Pending |

Use one owner-created test image with no identifiable people or third-party work.
Label it clearly as a launch test. Leave publication permission off: pending work
must not enter the public gallery. Confirm its private preview in the dashboard,
redeploy, then confirm the same record and image still exist privately. Withdraw
the test and check that its private image is no longer retrievable. Remove any
notification copies from the inbox as well. Do not publish a test as a fake member.

For a controlled enquiry, mark the message as an owner-authorized launch test and
confirm receipt at `htafl@africamail.com`. A successful on-screen response alone is
not inbox confirmation.

Stop launch for certificate errors, public access to pending images, lost uploads,
failed mail, unusable forms/menu or missing guardian procedures. Record defects
with the affected route and device; retest the affected checks after a fix.

## Detailed screen-reader run — owner to perform

On 7 October 2026 the owner confirmed being able to run both VoiceOver and
TalkBack. No detailed results or phone/OS versions have been supplied yet.
Use https://htaflco.netlify.app/ and record the deployment ID shown in the
hosting dashboard. Run on each phone separately, without relying on sight to
locate controls. Do not put passwords, private artwork or personal data in results.

On iPhone enable VoiceOver in Settings > Accessibility > VoiceOver. In Safari,
swipe left/right to move and double-tap to activate. Use the rotor's headings,
links and form controls, then swipe up/down to navigate that kind of item.
See [Apple's VoiceOver Safari instructions](https://support.apple.com/en-gb/guide/iphone/iphe4ee74be8/ios).

On Android enable TalkBack in Settings > Accessibility > TalkBack; exact menus
vary by device. In Chrome, swipe left/right between items and double-tap to
activate. Cycle reading controls with down-then-up or up-then-down, choosing
Headings, Links or Controls; swipe up/down to move within the chosen category.
See [Google's TalkBack Chrome instructions](https://support.google.com/accessibility/android/answer/2633135?hl=en).

| ID | Action on each phone | Expected result |
| --- | --- | --- |
| SR1 | Start Home; navigate headings and links | Page title, single main heading and logical section order; meaningful link names; decorative textile/canvas does not interrupt reading |
| SR2 | Open mobile menu, swipe through it, close it | Menu button name/state announced; background content is unavailable while open; focus returns to the button and page scroll works again |
| SR3 | Navigate the footer social controls | Instagram, X and TikTok have spoken names; activation opens the intended account separately; returning preserves the page |
| SR4 | On Create open a process photograph and close it | Dialog title and Close are reachable; background unavailable; image description understandable; focus returns to the opener |
| SR5 | On Resources enter a query with no match, filter, then reset | Label and selected category announced; result/empty status understandable; Reset restores the library state; browser Back restores URL state |
| SR6 | Open Get Involved, then each pathway | Index has no form; selected route has its own labelled questionnaire and adult-only/guardian notice |
| SR7 | Submit an empty pathway form | Error summary receives focus; each error identifies its field; activating the summary link reaches that field; labels and required state announced |
| SR8 | Fill one owner-authorized test enquiry using the onscreen keyboard | Fields and choices editable; submit reachable with keyboard open; response consent and adult-only confirmation both required; sending and final result announced; confirm email receipt |
| SR9 | Community: select a small owner-created image; leave public permission off | File control, selected filename, preview description and separate permission choices understandable; private receipt/reference announced; verify it remains unpublished, then withdraw and delete test email |
| SR10 | Try an invalid file and unsupported/oversized image | Understandable error; no success announcement; valid replacement remains possible without re-entering all details |
| SR11 | Simulate a failed/slow connection before an enquiry; reconnect | No false sent message; entered details remain usable; retry gets a real server result; avoid repeating a submission already accepted |
| SR12 | Sign in to /admin/ and sign out | Fields named; password remains concealed; private dashboard controls and permissions understandable; sign-out removes access; do not publish a test |

For menu/dialog dismissal use the visible Close control. If using an external
keyboard also check Tab/Shift+Tab containment, Escape dismissal, focus restoration
and a visible focus indicator. Never accept a focus trap with no way to exit.

## Large text, zoom, touch and motion

1. Turn screen reader off for visual inspection. Increase phone text size to
   the largest practical setting, then separately test browser zoom at 200%.
   On narrow screens all text, consent choices, errors and controls must remain
   readable and operable without clipped labels or sideways page scrolling.
2. Repeat menu and one questionnaire in portrait and landscape. Open the
   keyboard at the last field: submit/reset must remain reachable by scrolling.
   Dismiss the keyboard and check the page does not jump into inaccessible content.
3. Tap adjacent links, menu, close, filter, consent and form controls with one
   finger. Targets must be reliably selectable without activating a neighbour.
4. Enable the phone's Reduce Motion/remove animations option, reload Home, then
   scroll and touch the textile study. No idle/parallax/assembly movement should
   run. Toggle back and ensure normal controls still work. Device option names
   differ; record the actual setting used.
5. Inspect outdoors/high brightness and with dark appearance enabled: text,
   field borders, errors and focus must stay visible. Record any contrast issue;
   dark appearance must not make the logo or consent controls disappear.

## Results to return

Use one record per phone:

```
Date / final URL / deployment ID:
Phone model / OS / browser / screen-reader version:
SR1–SR12: pass, fail or not tested (with reason)
Large text / 200% zoom / landscape / keyboard / touch / reduced motion:
Failed route + action + what happened + expected result:
Test email received / private image withdrawn / inbox copy deleted:
```

Treat every “not tested” as pending. An automated accessibility scan does not
confirm announcements, gesture behavior or real device usability. Retest defects
on both devices after the affected code is fixed.
