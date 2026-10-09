import { motion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/** Ambient glow; `tone` shifts it per card so each tap feels like a new scene. */
export function Backdrop({ tone = 0 }: { tone?: number }) {
  const spots = [
    ['-20%', '-30%'],
    ['30%', '-10%'],
    ['-10%', '40%'],
    ['45%', '20%'],
    ['10%', '-35%'],
    ['-25%', '10%'],
    ['20%', '30%'],
  ];
  const [top, left] = spots[tone % spots.length];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute h-[75vh] w-[110vw] rounded-full bg-[radial-gradient(closest-side,rgba(109,40,217,0.5),transparent)] blur-2xl"
        animate={{ top, left }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="animate-drift-rev absolute -right-[35%] bottom-[-20%] h-[60vh] w-[95vw] rounded-full bg-[radial-gradient(closest-side,rgba(76,29,149,0.45),transparent)] blur-2xl" />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}

export function PrimaryButton({
  children,
  icon = true,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: boolean }) {
  return (
    <button
      {...rest}
      className={`btn-shimmer group relative flex min-h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#8b5cf6] px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-8px_rgba(124,58,237,0.75)] transition active:scale-[0.97] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 ${className}`}
    >
      <span className="relative">{children}</span>
      {icon && <ArrowRight className="relative size-5" strokeWidth={2.5} />}
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-violet-300">{children}</p>;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const stagger = (i: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 + i * 0.09, duration: 0.55, ease },
});

/** A line of display type that rises out of a mask. */
export function RiseLine({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
