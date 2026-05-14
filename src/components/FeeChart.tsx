'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { GasDataPoint } from '../types.ts';

export default function FeeChart() {
  const [data, setData] = useState<GasDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/gas-history');
      const json = await res.json();
      setData(json.history ?? []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Monetary Intelligence
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-[var(--text-mute)] uppercase tracking-widest">
          USDC Gas Density
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none p-6">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-mute)] mb-6">
          Base Fee History (USDC) — Arc native dollar-denominated settlement engine.
        </p>

        {loading ? (
          <div className="h-48 bg-[var(--text-bright)]/5 rounded animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-[var(--text-mute)] text-[10px] uppercase tracking-widest italic font-serif">
            Syncing data points...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tick={{ fill: 'var(--text-deep-mute)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-deep-mute)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v.toFixed(6)}`}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--page-bg)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 0,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
                itemStyle={{ color: '#c5a059' }}
                cursor={{ stroke: 'var(--border-dim)' }}
                formatter={(value: number) => [`$${value.toFixed(8)}`, 'Gas Price']}
              />
              <Line
                type="monotone"
                dataKey="gasPrice"
                stroke="#c5a059"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4, fill: '#c5a059', stroke: 'var(--page-bg)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {data.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-[var(--border-dim)]">
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)] mb-1">Index Min</div>
              <div className="text-sm font-serif text-[var(--text-bright)]">
                ${Math.min(...data.map((d) => d.gasPrice)).toFixed(8)}
              </div>
            </div>
            <div className="text-left border-l border-[var(--border-dim)]/50 pl-6">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)] mb-1">Mean Gas</div>
              <div className="text-sm font-serif text-gold">
                ${(data.reduce((s, d) => s + d.gasPrice, 0) / data.length).toFixed(8)}
              </div>
            </div>
            <div className="text-left border-l border-[var(--border-dim)]/50 pl-6">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)] mb-1">Peak Load</div>
              <div className="text-sm font-serif text-[var(--text-bright)]">
                ${Math.max(...data.map((d) => d.gasPrice)).toFixed(8)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
