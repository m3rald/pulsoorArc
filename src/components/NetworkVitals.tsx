'use client';

import { useEffect, useState } from 'react';
import StatCard from './StatCard.tsx';
import { NetworkStats } from '../types.ts';

export default function NetworkVitals() {
  const [data, setData] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/network');
      const json = await res.json();
      setData(json);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const finality = data ? parseFloat(data.avgBlockTime) : null;

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${pulse ? 'bg-gold' : 'bg-gold/40'} transition-all duration-500`}
          />
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Network vitals
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-widest">
          Live RPC Sync
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-dim)] border border-[var(--border-dim)]">
        <div className="bg-[var(--page-bg)]">
          <StatCard
            label="Latest block"
            value={data ? `#${parseInt(data.blockNumber).toLocaleString()}` : '—'}
            sub={
              data
                ? new Date(data.latestBlockTimestamp * 1000).toLocaleTimeString()
                : ''
            }
            accent="cyan"
            loading={loading}
            mono
          />
        </div>
        <div className="bg-[var(--page-bg)]">
          <StatCard
            label="Gas price (USDC)"
            value={data ? `$${parseFloat(data.gasPrice).toFixed(6)}` : '—'}
            sub="Dollar-denominated fees"
            accent="green"
            loading={loading}
            mono
          />
        </div>
        <div className="bg-[var(--page-bg)]">
          <StatCard
            label="Avg block time"
            value={
              finality !== null
                ? `${finality.toFixed(3)}s`
                : '—'
            }
            sub={
              finality !== null && finality < 1
                ? '✓ Sub-second finality'
                : finality !== null
                ? '⚠ Above 1s target'
                : ''
            }
            accent={
              finality !== null && finality < 1 ? 'green' : 'amber'
            }
            loading={loading}
          />
        </div>
        <div className="bg-[var(--page-bg)]">
          <StatCard
            label="TPS (estimated)"
            value={data ? parseFloat(data.tps).toFixed(2) : '—'}
            sub={`${data?.latestBlockTxCount ?? '—'} txs in latest block`}
            accent="blue"
            loading={loading}
          />
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-dim)] border border-[var(--border-dim)] border-t-0">
          <div className="bg-[var(--page-bg)]">
            <StatCard
              label="Total transactions"
              value={parseInt(data.totalTransactions).toLocaleString()}
              accent="cyan"
            />
          </div>
          <div className="bg-[var(--page-bg)]">
            <StatCard
              label="Total addresses"
              value={parseInt(data.totalAddresses).toLocaleString()}
              accent="blue"
            />
          </div>
          <div className="bg-[var(--page-bg)]">
            <StatCard
              label="Txs today"
              value={data.txToday?.toLocaleString() ?? '—'}
              accent="green"
            />
          </div>
        </div>
      )}
    </section>
  );
}
