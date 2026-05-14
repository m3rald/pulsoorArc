'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '../types.ts';
import { formatAddress, formatHash } from '../lib/arc-client.ts';
import { cn } from '../lib/utils.ts';

export default function TransactionFeed() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTxs = async () => {
    try {
      const res = await fetch('/api/transactions?limit=20');
      const json = await res.json();
      setTxs(json.transactions ?? []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTxs();
    const interval = setInterval(fetchTxs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Live transaction history
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-widest">
          {txs.length} records detected
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-[var(--text-bright)]/5 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border-dim)] text-[10px] uppercase tracking-wider text-[var(--text-mute)]">
                  <th className="text-left p-4 font-medium">Identity / Hash</th>
                  <th className="text-left p-4 font-medium">Origin</th>
                  <th className="text-left p-4 font-medium">Destination</th>
                  <th className="text-right p-4 font-medium">USDC Flow</th>
                  <th className="text-right p-4 font-medium">Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-dim)]/30">
                {txs.map((tx, i) => (
                  <tr
                    key={tx.hash}
                    className={cn(
                      'hover:bg-[var(--text-bright)]/[0.02] transition-colors',
                      i === 0 && 'bg-gold/[0.02]'
                    )}
                  >
                    <td className="p-4">
                      <a
                        href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-serif text-[var(--text-bright)] hover:text-gold transition-colors"
                      >
                        {formatHash(tx.hash)}
                      </a>
                    </td>
                    <td className="p-4 font-mono text-[var(--text-dim)]">
                      <a
                        href={`https://testnet.arcscan.app/address/${tx.from?.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[var(--text-bright)]"
                      >
                        {tx.from ? formatAddress(tx.from.hash) : '—'}
                      </a>
                    </td>
                    <td className="p-4 font-mono text-[var(--text-dim)]">
                      {tx.to ? (
                        <a
                          href={`https://testnet.arcscan.app/address/${tx.to.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[var(--text-bright)]"
                        >
                          {formatAddress(tx.to.hash)}
                        </a>
                      ) : (
                        <span className="text-gold/60 italic text-[10px] uppercase tracking-wider">Deployment</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-serif text-[var(--text-bright)]">
                      {tx.value && tx.value !== '0'
                        ? (parseInt(tx.value) / 1e6).toFixed(2)
                        : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={cn(
                          'px-2 py-0.5 border text-[9px] uppercase tracking-widest font-medium',
                          tx.status === 'ok'
                            ? 'border-emerald-500/20 text-emerald-500/60'
                            : 'border-red-500/20 text-red-500/60'
                        )}
                      >
                        {tx.status === 'ok' ? 'confirmed' : 'reverted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-[var(--border-dim)]/50 text-left bg-[var(--text-bright)]/[0.01]">
          <a
            href="https://testnet.arcscan.app/txs"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] hover:text-gold transition-colors inline-flex items-center gap-2"
          >
            Access Full Registry <span className="text-gold">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
