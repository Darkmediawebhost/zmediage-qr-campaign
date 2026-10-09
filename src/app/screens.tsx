import { motion } from 'motion/react';
import { useState, type FormEvent } from 'react';
import { Check, Instagram, MessageCircle, Phone, RotateCcw, Share2 } from 'lucide-react';
import { brand, shareText, story } from '../config/campaign';
import { isContact, submitLead, tap, whatsappLeadUrl, whatsappUrl, type Lead } from '../lib/lead';
import { Eyebrow, PrimaryButton, RiseLine, stagger } from './ui';

const card = 'flex flex-1 flex-col justify-center';

/* ---------------------------------------------------------------- 1. Hook */

export function HookCard() {
  const s = story.hook;
  return (
    <div className={card}>
      <motion.div {...stagger(0)}>
        <Eyebrow>{s.eyebrow}</Eyebrow>
      </motion.div>
      <h1 className="text-[clamp(2.7rem,12.5vw,4.4rem)] leading-[0.98]">
        <RiseLine i={1}>{s.title[0]}</RiseLine>
        <RiseLine i={2} className="text-gradient">
          {s.title[1]}
        </RiseLine>
      </h1>
      <motion.p {...stagger(5)} className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
        {s.body}
      </motion.p>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Stop. Look. Act. */

export function StopCard() {
  const s = story.stop;
  return (
    <div className={card}>
      <div className="font-display text-[clamp(4.2rem,22vw,7rem)] leading-[0.92] font-semibold">
        {s.words.map((w, i) => (
          <motion.span
            key={w}
            className={`block ${i === s.words.length - 1 ? 'text-gradient' : 'text-white'}`}
            initial={{ opacity: 0, scale: 1.6, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.15 + i * 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
          >
            {w}
          </motion.span>
        ))}
      </div>
      <motion.p {...stagger(19)} className="mt-8 max-w-xs text-xl leading-snug text-white/85">
        {s.body}
      </motion.p>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Meet Zmediage */

export function MeetCard() {
  const s = story.meet;
  return (
    <div className={card}>
      <motion.div
        className="relative mb-10 size-36"
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <div className="absolute inset-0 rounded-full bg-violet-500/45 blur-3xl" />
        <motion.div
          className="absolute -inset-4 rounded-full border border-dashed border-violet-300/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <img src="/z-mark.svg" alt="" className="relative size-full drop-shadow-[0_0_30px_rgba(139,92,246,0.7)]" />
      </motion.div>
      <motion.div {...stagger(2)}>
        <Eyebrow>{s.eyebrow}</Eyebrow>
      </motion.div>
      <h1 className="text-[clamp(2.8rem,13vw,4.4rem)] leading-[0.98]">
        <RiseLine i={3}>{s.title[0]}</RiseLine>
        <RiseLine i={4} className="text-gradient">
          {s.title[1]}
        </RiseLine>
      </h1>
      <motion.p {...stagger(7)} className="mt-5 max-w-sm text-lg leading-relaxed text-muted">
        {s.body}
      </motion.p>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Services */

export function ServicesCard() {
  const s = story.services;
  return (
    <div className={card}>
      <motion.div {...stagger(0)}>
        <Eyebrow>{s.eyebrow}</Eyebrow>
        <h2 className="text-[clamp(2rem,9vw,2.7rem)] leading-[1.02] [@media(max-height:760px)]:text-[1.75rem]">{s.title}</h2>
      </motion.div>
      <div className="mt-6 space-y-2.5 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:space-y-2">
        {s.items.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-line bg-panel/85 p-4 backdrop-blur-sm [@media(max-height:760px)]:py-3"
          >
            <p className="flex items-baseline gap-2.5">
              <span className="font-display text-sm font-semibold text-violet-300">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-lg font-bold text-white">{it.name}</span>
            </p>
            <p className="mt-0.5 text-[15px] leading-snug text-muted">{it.line}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 [@media(max-height:760px)]:hidden">
              {it.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-white/75">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. Approach */

export function ApproachCard() {
  const s = story.approach;
  return (
    <div className={card}>
      <motion.div {...stagger(0)}>
        <Eyebrow>{s.eyebrow}</Eyebrow>
        <h2 className="text-[clamp(2rem,9vw,2.7rem)] leading-[1.02]">{s.title}</h2>
      </motion.div>
      <motion.p {...stagger(2)} className="mt-4 font-display text-2xl leading-snug text-violet-200 italic">
        {s.question}
      </motion.p>
      <ol className="relative mt-7 space-y-5 pl-9">
        <motion.span
          aria-hidden
          className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-gradient-to-b from-violet-300 to-violet-700"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6, duration: 1.6, ease: 'easeInOut' }}
        />
        {s.steps.map((st, i) => (
          <motion.li key={st.name} {...stagger(5 + i * 2.2)} className="relative">
            <span className="absolute top-0.5 -left-9 grid size-6 place-items-center rounded-full bg-violet-500 text-[11px] font-bold text-white shadow-[0_0_16px_rgba(139,92,246,0.8)]">
              {i + 1}
            </span>
            <p className="text-lg font-bold text-white">{st.name}</p>
            <p className="text-[15px] text-muted">{st.line}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- 6. Anything marketing */

export function AnythingCard() {
  const s = story.anything;
  return (
    <div className={card}>
      <h1 className="text-[clamp(2.4rem,11vw,3.6rem)] leading-[1]">
        <RiseLine i={0}>{s.title[0]}</RiseLine>
        <RiseLine i={1} className="text-gradient">
          {s.title[1]}
        </RiseLine>
      </h1>
      <div className="mt-7 flex flex-wrap gap-2">
        {s.chips.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 260, damping: 16 }}
            className={`rounded-full border px-4 py-2 text-[15px] font-semibold ${
              i % 3 === 0 ? 'border-violet-400/50 bg-violet-500/20 text-white' : 'border-white/15 bg-white/[0.05] text-white/85'
            }`}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <motion.p {...stagger(12)} className="mt-7 max-w-sm text-lg leading-relaxed text-muted">
        {s.body}
      </motion.p>
    </div>
  );
}

/* ---------------------------------------------------------------- 7. Contact */

const input =
  'w-full rounded-2xl border border-line bg-white/[0.05] px-4 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition focus:border-violet-400 focus:bg-white/[0.08]';

export function ContactCard({ onReplay }: { onReplay: () => void }) {
  const s = story.contact;
  const [lead, setLead] = useState<Lead>({ name: '', contact: '', needs: [], message: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<{ msg: string; fallback?: boolean } | null>(null);

  const toggle = (n: string) => {
    tap();
    setLead((l) => ({ ...l, needs: l.needs.includes(n) ? l.needs.filter((x) => x !== n) : [...l.needs, n] }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    tap();
    if (!lead.name.trim()) return setError({ msg: 'What should we call you?' });
    if (!isContact(lead.contact)) return setError({ msg: 'Add a WhatsApp number or email so we can reach you.' });
    setBusy(true);
    setError(null);
    const res = await submitLead(lead);
    setBusy(false);
    if (res.ok) setSent(true);
    else setError({ msg: res.error, fallback: res.fallback });
  };

  const share = async () => {
    tap();
    try {
      if (navigator.share) await navigator.share({ title: 'Zmediage', text: shareText, url: location.origin });
      else await navigator.clipboard.writeText(`${shareText} ${location.origin}`);
    } catch {
      /* closed */
    }
  };

  return (
    <div className="flex flex-1 flex-col pt-4 pb-2">
      {sent ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="mx-auto grid size-20 place-items-center rounded-full bg-violet-500 shadow-[0_0_50px_rgba(139,92,246,0.8)]"
          >
            <Check className="size-10 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 text-[clamp(2.2rem,10vw,3rem)] leading-none">
            Thanks, <span className="text-gradient">{lead.name.trim().split(' ')[0]}.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-lg text-muted">{s.thanks}</p>
          <div className="mt-8 grid gap-2.5">
            <a
              href={`https://instagram.com/${brand.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-white font-bold text-ink active:scale-[0.98]"
            >
              <Instagram className="size-5" /> Follow @{brand.instagram}
            </a>
            <button type="button" onClick={share} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 font-bold active:scale-[0.98]">
              <Share2 className="size-4.5" /> Know someone who needs us? Share
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div {...stagger(0)}>
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h1 className="text-[clamp(2.2rem,10vw,3.1rem)] leading-[1]">
              {s.title[0]} <span className="text-gradient">{s.title[1]}</span>
            </h1>
            <p className="mt-3 text-[16px] text-muted">{s.body}</p>
          </motion.div>

          <motion.form {...stagger(2)} onSubmit={submit} className="mt-6 space-y-3" noValidate>
            <input className={input} placeholder="Your name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
            <input
              className={input}
              placeholder="WhatsApp number or email"
              autoComplete="tel"
              autoCapitalize="none"
              value={lead.contact}
              onChange={(e) => setLead({ ...lead, contact: e.target.value })}
            />
            <div>
              <p className="mb-2 px-1 text-sm text-white/70">What can we help with?</p>
              <div className="flex flex-wrap gap-2">
                {s.needs.map((n) => {
                  const on = lead.needs.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(n)}
                      className={`rounded-full border px-4 py-2 text-[15px] font-semibold transition ${
                        on ? 'border-violet-400 bg-violet-500 text-white' : 'border-white/15 bg-white/[0.05] text-white/80'
                      }`}
                    >
                      {on && <Check className="mr-1 -ml-1 inline size-4" strokeWidth={3} />}
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
            <textarea
              className={`${input} min-h-20 resize-none`}
              rows={2}
              placeholder="Anything else? (optional)"
              value={lead.message}
              onChange={(e) => setLead({ ...lead, message: e.target.value })}
            />
            <input tabIndex={-1} aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" value={lead.website} onChange={(e) => setLead({ ...lead, website: e.target.value })} />

            {error && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3.5 text-sm text-rose-100">
                {error.msg}
                {error.fallback && (
                  <a href={whatsappLeadUrl(lead)} className="mt-2 flex items-center gap-2 font-bold text-white underline underline-offset-4">
                    <MessageCircle className="size-4" /> Send it on WhatsApp instead
                  </a>
                )}
              </div>
            )}

            <PrimaryButton type="submit" disabled={busy} icon={!busy}>
              {busy ? 'Sending…' : 'Get in touch'}
            </PrimaryButton>
          </motion.form>

          <motion.div {...stagger(4)} className="mt-6">
            <p className="text-center text-sm text-muted">Rather just talk?</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a
                href={whatsappUrl('Hi Zmediage! I scanned your QR box and want to know more.')}
                onClick={tap}
                className="flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/20 text-sm font-bold active:scale-[0.97]"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a href={`tel:${brand.phone}`} onClick={tap} className="flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/20 text-sm font-bold active:scale-[0.97]">
                <Phone className="size-4" /> Call
              </a>
              <a
                href={`https://instagram.com/${brand.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/20 text-sm font-bold active:scale-[0.97]"
              >
                <Instagram className="size-4" /> Insta
              </a>
            </div>
          </motion.div>
        </>
      )}

      <button type="button" onClick={onReplay} className="mx-auto mt-6 flex items-center gap-2 py-2 text-sm font-medium text-violet-300">
        <RotateCcw className="size-3.5" /> Watch the story again
      </button>
    </div>
  );
}
