import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { durations } from '../config/campaign';
import { tap } from '../lib/lead';
import { Backdrop } from './ui';
import { AnythingCard, ApproachCard, ContactCard, HookCard, MeetCard, ServicesCard, StopCard } from './screens';

// Instagram-story mechanics: bars fill and auto-advance, tap right = next, tap left = back,
// press and hold = pause. The last card (contact) never auto-advances and scrolls normally.
const CARDS = [HookCard, StopCard, MeetCard, ServicesCard, ApproachCard, AnythingCard];
const LAST = CARDS.length; // index of the contact card
const HOLD_MS = 220;

export function Experience() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [held, setHeld] = useState(false);
  const elapsed = useRef(0);
  const down = useRef<{ t: number; x: number } | null>(null);
  const reduced = useRef(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const go = useCallback((n: number) => {
    elapsed.current = 0;
    setProgress(0);
    setIdx(Math.max(0, Math.min(LAST, n)));
  }, []);

  // Timer: rAF so the bar is smooth; pauses while held or when the tab is hidden.
  useEffect(() => {
    if (idx >= LAST || held || reduced.current) return;
    let raf = 0;
    let last = performance.now();
    const total = durations[idx] * 1000;
    const loop = (now: number) => {
      if (!document.hidden) elapsed.current += now - last;
      last = now;
      const p = Math.min(1, elapsed.current / total);
      setProgress(p);
      if (p >= 1) go(idx + 1);
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [idx, held, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowLeft') go(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, go]);

  const onDown = (e: PointerEvent) => {
    down.current = { t: performance.now(), x: e.clientX };
    setHeld(true);
  };
  const onUp = (e: PointerEvent) => {
    setHeld(false);
    const d = down.current;
    down.current = null;
    if (!d || performance.now() - d.t > HOLD_MS || Math.abs(e.clientX - d.x) > 30) return; // was a hold or a swipe
    tap();
    go(e.clientX < window.innerWidth * 0.3 ? idx - 1 : idx + 1);
  };

  const Card = idx < LAST ? CARDS[idx] : null;

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden">
      <Backdrop tone={idx} />

      <header className="relative z-20 mx-auto w-full max-w-md px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex gap-1">
          {Array.from({ length: LAST + 1 }, (_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${i < idx ? 100 : i === idx ? (idx === LAST ? 100 : progress * 100) : 0}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <img src="/z-mark.svg" alt="" className="size-8" />
          <p className="flex-1 text-[15px] font-bold tracking-wide">
            zmediage <span className="font-normal text-white/50">· marketing agency</span>
          </p>
          {idx < LAST && (
            <button
              type="button"
              onClick={() => {
                tap();
                go(LAST);
              }}
              className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-bold backdrop-blur"
            >
              Talk to us
            </button>
          )}
        </div>
      </header>

      {Card ? (
        <div
          className="relative z-10 mx-auto flex w-full max-w-md flex-1 cursor-pointer touch-manipulation flex-col px-6 select-none"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: held ? 0.92 : 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              <Card />
            </motion.div>
          </AnimatePresence>
          <motion.p
            key={`hint-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: idx === 0 ? 2 : 1.2, duration: 2 }}
            className="pb-safe flex items-center justify-center gap-1 pt-4 text-sm font-medium text-white/60"
          >
            {idx === 0 ? 'Tap to continue' : 'Tap for next'} <ChevronRight className="size-4" />
          </motion.p>
        </div>
      ) : (
        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-safe mx-auto flex min-h-full w-full max-w-md flex-col px-6"
          >
            <ContactCard onReplay={() => go(0)} />
          </motion.div>
        </div>
      )}
    </main>
  );
}
