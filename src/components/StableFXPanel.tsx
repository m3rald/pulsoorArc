'use client';

import { STABLEFX_PAIRS } from '../lib/constants.ts';
import { cn } from '../lib/utils.ts';

export default function StableFXPanel() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            On-Chain Foreign Exchange
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-gold uppercase tracking-widest font-serif italic">
          StableFX Engine
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none overflow-hidden">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] px-4 pt-4 pb-2">
          Real-time PvP settlement liquidity between global stablecoin pairs.
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-dim)] text-[10px] uppercase tracking-wider text-[var(--text-mute)]">
              <th className="text-left p-4 font-medium">Asset Pair</th>
              <th className="text-right p-4 font-medium">Spot Rate</th>
              <th className="text-right p-4 font-medium">Volatility</th>
              <th className="text-right p-4 font-medium">24h liquidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-dim)]/30">
            {STABLEFX_PAIRS.map((pair) => (
              <tr
                key={pair.pair}
                className="hover:bg-[var(--text-bright)]/[0.02] transition-colors"
              >
                <td className="p-4 font-serif text-[var(--text-bright)] font-medium">
                  {pair.pair}
                </td>
                <td className="p-4 text-right font-mono text-[var(--text-bright)]">
                  {pair.rate.toLocaleString()}
                </td>
                <td
                  className={cn(
                    'p-4 text-right font-mono text-[10px]',
                    pair.change >= 0 ? 'text-emerald-500/60' : 'text-red-500/60'
                  )}
                >
                  {pair.change >= 0 ? '+' : ''}
                  {pair.change.toFixed(2)}%
                </td>
                <td className="p-4 text-right font-mono text-[var(--text-mute)]">
                  ${pair.vol24h.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-[var(--border-dim)]/50 text-left bg-[var(--text-bright)]/[0.01]">
          <a
            href="https://docs.arc.network"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] hover:text-gold transition-colors inline-flex items-center gap-2"
          >
            StableFX Documentation <span className="text-gold">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
