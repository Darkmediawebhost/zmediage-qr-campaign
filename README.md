# Zmediage QR box campaign

A person wears a box with a QR code. Anyone can scan it, from any background. It opens a short, Instagram-style story that introduces Zmediage and ends with an easy way to get in touch.

## The story

Cards auto-advance (bars at the top). Tap right for next, tap left for back, press and hold to pause. "Talk to us" in the header jumps straight to the contact card.

| # | Card | Purpose |
|---|---|---|
| 1 | "Hey, you. 👀 You just scanned a walking box." | Pays off their curiosity |
| 2 | **Stop. Look. Act.** "That's exactly what we make people do. For brands." | The link between the box and what we do |
| 3 | Glowing Z. "We're Zmediage." A marketing agency from Mangalore. | Who we are |
| 4 | What we do: Branding, Websites, Social media, Ads (with what's included) | Services |
| 5 | How we work: "We start with one question." Understand → Strategize → Execute → Improve | Credibility, with no claims or metrics |
| 6 | "If it's marketing, bring it to us." Chips: a new logo, a website, reels, ads, a launch… | Shows they can bring any marketing work |
| 7 | Contact: name, WhatsApp **or** email, "What can we help with?" chips, optional note. WhatsApp, Call and Insta buttons. | The lead |

There's no gift and no game. All text lives in `src/config/campaign.ts`, and card timings are in `durations` there. No client names, work, testimonials or metrics (same v1 rule as the main site).

## The QR (print/)

`print/qr-b.svg` is a plain QR with the Z logo in the centre. It opens **https://campaign.zmediage.online/** with no extra path and no text. Regenerate with `npm run qr`, or with `QR_URL=https://example.com npm run qr` if the URL changes. It uses error-correction H and has a 4-module white border. It's decode-tested from 200 px to 1200 px. At about 35 cm wide on the box it scans from a couple of metres.

**Print notes:** matte vinyl or card, not gloss (mall lights glare). Test-scan the printer's proof with an older Android phone before the full run.

**Field tips:**
- Walk slowly near queues, escalators and food courts. People waiting have 30 idle seconds.
- Pause, face people, and never chase.
- Film reactions for Instagram (with consent).

## Lead capture

`api/lead.ts` is a Vercel Function. Every enquiry is posted straight to the Google Sheet web app (`SHEET_WEBHOOK` in that file). In the sheet, go to Extensions → Apps Script, paste the snippet below, then Deploy → Web app (Execute as *me*, access *Anyone*).

Optional email (see `.env.example`):

- `RESEND_API_KEY` (+ `LEAD_NOTIFY_TO`): an email for every enquiry.
- `LEAD_FROM`: a verified Resend sender. This turns on a short thank-you reply when someone leaves an email.

If the sheet post fails, the page offers "Send it on WhatsApp instead" with the details prefilled, so no enquiry is lost.

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Date & time','Name','Email','Phone / WhatsApp',
                  'Interested in','Note','Page','Device']);
  }
  sh.appendRow([new Date(d.at), d.name, d.email, d.phone,
                d.needs, d.message, d.source, d.ua]);
  return ContentService.createTextOutput('ok');
}
```

Step-by-step setup for the team (Vercel + Sheet, plain English): `Zmediage-QR-Setup-Guide.pdf`.

## Dev

```
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run build
```

