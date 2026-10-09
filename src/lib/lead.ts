import { brand } from '../config/campaign';

export interface Lead {
  name: string;
  contact: string; // email or phone, whichever they prefer
  needs: string[];
  message: string;
  website: string; // honeypot, real people never see it
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isContact = (v: string) => EMAIL.test(v.trim()) || v.replace(/\D/g, '').length >= 8;

export type SubmitResult = { ok: true } | { ok: false; error: string; fallback?: boolean };

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...lead, source: location.pathname + location.search }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return { ok: true };
    if (res.status === 422) return { ok: false, error: data.error || 'Please check your details.' };
    return { ok: false, error: 'Our inbox is having a moment.', fallback: true };
  } catch {
    return { ok: false, error: 'Looks like the signal dropped.', fallback: true };
  }
}

export const whatsappUrl = (text: string) => `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

/** Last resort so a lead is never lost: hand the same details to WhatsApp. */
export function whatsappLeadUrl(lead: Lead) {
  const lines = [
    'Hi Zmediage! I scanned your QR box.',
    `Name: ${lead.name}`,
    lead.needs.length > 0 && `Interested in: ${lead.needs.join(', ')}`,
    lead.message && `Note: ${lead.message}`,
  ].filter(Boolean);
  return whatsappUrl(lines.join('\n'));
}

export const tap = () => {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* unsupported */
  }
};
