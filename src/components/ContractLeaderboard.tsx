'use client';

import { useEffect, useState } from 'react';
import { SmartContract } from '../types.ts';
import { formatAddress } from '../lib/arc-client.ts';

export default function ContractLeaderboard() {
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch('/api/contracts');
        const json = await res.json();
        setContracts(json.contracts ?? []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchContracts();
  }, []);

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Immutable Architecture
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-widest">
          Verified Core
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-[var(--text-bright)]/5 rounded animate-pulse" />
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-mute)] text-[10px] uppercase tracking-widest font-serif italic">
            Scanning Smart Contracts...
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-dim)] text-[10px] uppercase tracking-wider text-[var(--text-mute)]">
                <th className="text-left p-4 font-medium">Index</th>
                <th className="text-left p-4 font-medium">Contract Name</th>
                <th className="text-left p-4 font-medium">Endpoint</th>
                <th className="text-left p-4 font-medium">Stack</th>
                <th className="text-right p-4 font-medium">Epoch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-dim)]/30">
              {contracts.map((c, i) => (
                <tr
                  key={c.address?.hash ?? i}
                  className="hover:bg-[var(--text-bright)]/[0.02] transition-colors"
                >
                  <td className="p-4 text-[var(--text-deep-mute)] font-mono">{i + 1}</td>
                  <td className="p-4 text-[var(--text-bright)] font-serif text-sm">
                    {c.name ?? c.address?.name ?? 'Anonymous'}
                  </td>
                  <td className="p-4">
                    <a
                      href={`https://testnet.arcscan.app/address/${c.address?.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-gold/60 hover:text-gold transition-colors"
                    >
                      {c.address ? formatAddress(c.address.hash) : '—'}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="border border-gold/20 text-gold/60 px-2 py-0.5 text-[9px] uppercase tracking-widest">
                      {c.language ?? 'Solidity'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[var(--text-mute)] font-mono">
                    {c.verified_at
                      ? new Date(c.verified_at).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="p-4 border-t border-[var(--border-dim)]/50 text-left bg-[var(--text-bright)]/[0.01]">
          <a
            href="https://testnet.arcscan.app/verified-contracts"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] hover:text-gold transition-colors inline-flex items-center gap-2"
          >
            Verified Registry <span className="text-gold">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
