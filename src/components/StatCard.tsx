'use client';

import { cn } from '@/src/lib/utils.ts';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'cyan' | 'green' | 'blue' | 'amber' | 'red';
  loading?: boolean;
  mono?: boolean;
}

const accentMap = {
  cyan: 'text-[var(--text-bright)] border-gold/30',
  green: 'text-emerald-500 border-emerald-500/10',
  blue: 'text-blue-500 border-blue-500/10',
  amber: 'text-gold border-gold/20',
  red: 'text-red-500 border-red-500/10',
};

export default function StatCard({
  label,
  value,
  sub,
  accent = 'cyan',
  loading,
  mono,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none p-5 flex flex-col gap-1 transition-all duration-300 hover:border-gold/30 group',
        accent === 'amber' || accent === 'cyan' ? 'border-l-gold/40 border-l-2' : ''
      )}
    >
      <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-[0.2em] font-medium group-hover:text-gold/60 transition-colors">
        {label}
      </span>
      {loading ? (
        <div className="h-8 w-24 bg-[var(--text-mute)]/10 animate-pulse mt-1" />
      ) : (
        <span
          className={cn(
            'text-2xl font-serif leading-tight',
            accentMap[accent].split(' ')[0],
            mono && 'font-mono text-xl'
          )}
        >
          {value}
        </span>
      )}
      {sub && (
        <span className="text-[10px] text-[var(--text-mute)] letter-spacing-wide mt-1 italic opacity-80">{sub}</span>
      )}
    </div>
  );
}
