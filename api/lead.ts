// Vercel Function: POST /api/lead
// Delivery targets are all optional and env-gated (see .env.example):
//   LEAD_SHEET_WEBHOOK  Google Apps Script web-app URL; appends a row to the team sheet
//   RESEND_API_KEY      emails each enquiry to LEAD_NOTIFY_TO
//   LEAD_FROM           verified Resend sender; also turns on a short "thanks, here's who we are" reply
// A lead counts as delivered when the sheet or the team email succeeds. Otherwise we return 503
// and the page falls back to WhatsApp so the enquiry isn't lost.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NEEDS = new Set(['Branding', 'Website', 'Social media', 'Ads', 'Not sure yet']);

type Lead = {
  at: string;
  name: string;
  email: string;
  phone: string;
  needs: string;
  message: string;
  source: string;
  ua: string;
};

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: 'Bad request' }, { status: 400 });

  // Bots fill every field; people never see this one.
  if (clip(body.website, 200)) return Response.json({ ok: true });

  const contact = clip(body.contact, 120);
  const isEmail = EMAIL.test(contact);
  const lead: Lead = {
    at: new Date().toISOString(),
    name: clip(body.name, 80),
    email: isEmail ? contact.toLowerCase() : '',
    phone: isEmail ? '' : contact,
    needs: (Array.isArray(body.needs) ? body.needs : []).filter((n): n is string => NEEDS.has(n as string)).join(', '),
    message: clip(body.message, 600),
    source: clip(body.source, 100),
    ua: clip(request.headers.get('user-agent'), 200),
  };

  if (!lead.name) return Response.json({ ok: false, error: 'What should we call you?' }, { status: 422 });
  if (!isEmail && contact.replace(/\D/g, '').length < 8)
    return Response.json({ ok: false, error: 'Add a WhatsApp number or email so we can reach you.' }, { status: 422 });

  const env = process.env;
  const jobs: Promise<unknown>[] = [];
  if (env.LEAD_SHEET_WEBHOOK) jobs.push(postSheet(env.LEAD_SHEET_WEBHOOK, lead));
  if (env.RESEND_API_KEY) jobs.push(notifyTeam(env.RESEND_API_KEY, lead));

  if (jobs.length === 0) {
    if (env.VERCEL_ENV === 'production') {
      console.error('[lead] no delivery target configured', lead.name);
      return Response.json({ ok: false, error: 'Not configured' }, { status: 503 });
    }
    console.log('[lead] (dev, not delivered)', lead);
    return Response.json({ ok: true, dev: true });
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('[lead] delivery failed', r.reason));
  if (!results.some((r) => r.status === 'fulfilled'))
    return Response.json({ ok: false, error: 'Delivery failed' }, { status: 503 });

  // The reply is a bonus; its failure never fails the lead.
  if (env.RESEND_API_KEY && env.LEAD_FROM && lead.email) {
    await autoReply(env.RESEND_API_KEY, env.LEAD_FROM, lead).catch((e) => console.error('[lead] auto-reply failed', e));
  }
  return Response.json({ ok: true });
}

async function postSheet(url: string, lead: Lead) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'text/plain;charset=utf-8' }, // Apps Script rejects JSON preflights
    body: JSON.stringify(lead),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`sheet ${res.status}`);
}

async function sendEmail(key: string, payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

function notifyTeam(key: string, lead: Lead) {
  const rows = Object.entries(lead)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${esc(String(v))}</td></tr>`)
    .join('');
  return sendEmail(key, {
    from: process.env.LEAD_FROM || 'Zmediage QR <onboarding@resend.dev>',
    to: (process.env.LEAD_NOTIFY_TO || 'info@zmediage.com').split(','),
    ...(lead.email && { reply_to: lead.email }),
    subject: `📦 QR enquiry: ${lead.name}${lead.needs ? ` (${lead.needs})` : ''}`,
    html: `<h2 style="font-family:sans-serif">New enquiry from the QR box</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
  });
}

function autoReply(key: string, from: string, lead: Lead) {
  const first = esc(lead.name.split(' ')[0]);
  return sendEmail(key, {
    from,
    to: [lead.email],
    subject: `Thanks for scanning, ${first} 👋`,
    html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:520px">
<p>Hi ${first},</p>
<p>Thanks for scanning our box and saying hello. Someone from our team will get in touch soon.</p>
<p>In the meantime, here's who we are: Zmediage is a marketing agency in Mangalore. We do branding, websites, social media and ads. If it's marketing, bring it to us.</p>
<p>Reply to this email anytime, or WhatsApp us on +91 95268 40020.</p>
<p>The Zmediage team</p></div>`,
  });
}
