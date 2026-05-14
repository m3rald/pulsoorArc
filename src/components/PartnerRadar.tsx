'use client';

import { PARTNER_CLUSTERS } from '../lib/constants.ts';
import { cn } from '../lib/utils.ts';

export default function PartnerRadar() {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    building: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    exploring: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Strategic Ecosystem
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-widest">
          Institutional Access
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none p-6">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] mb-6">
          Global participants engaged in Arc Network's stablecoin mission.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-dim)] border border-[var(--border-dim)]">
          {PARTNER_CLUSTERS.map((p) => (
            <div
              key={p.name}
              className="bg-[var(--page-bg)] p-4 flex flex-col gap-1 group hover:bg-[var(--text-bright)]/[0.01] transition-colors"
            >
              <span className="text-sm font-serif text-[var(--text-bright)] group-hover:text-gold transition-colors">
                {p.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-mute)]">{p.sector}</span>
              <span
                className={cn(
                  'text-[8px] px-2 py-0.5 border w-fit mt-2 uppercase tracking-widest',
                  statusColors[p.status]
                )}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] italic text-[var(--text-deep-mute)] mt-6 pt-6 border-t border-[var(--border-dim)]/50 leading-relaxed">
          The Arc ecosystem extends to 80+ additional global tier-1 institutions exploring programmable stablecoin liquidity.
        </p>
      </div>
    </section>
  );
}
