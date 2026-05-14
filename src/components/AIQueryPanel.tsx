'use client';

import { useState } from 'react';
import { cn } from '../lib/utils.ts';

const EXAMPLE_QUERIES = [
  'Why are gas fees on Arc denominated in USDC?',
  'What does sub-second finality mean for capital markets?',
  'How does the Malachite consensus engine work?',
  'What is StableFX and how does PvP settlement work?',
  'How does Arc\'s opt-in privacy compare to other chains?',
];

interface AIQueryPanelProps {
  networkContext?: object;
}

export default function AIQueryPanel({ networkContext }: AIQueryPanelProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, networkContext }),
      });
      const json = await res.json();
      if (json.error) setError(json.error);
      else setResponse(json.response);
    } catch {
      setError('Request failed. Server may be starting up...');
    }
    setLoading(false);
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[0.2em]">
            Synthetic Cognition
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--border-dim)]"></div>
        <span className="text-[10px] text-purple-400/60 uppercase tracking-widest font-serif italic">
          Intelligence Layer
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-dim)] rounded-none p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(query)}
            placeholder="Inquire about Arc Network architecture..."
            className="flex-1 bg-[var(--page-bg)] border border-[var(--border-dim)] rounded-none px-4 py-3 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-deep-mute)] focus:outline-none focus:border-gold/40 font-serif"
          />
          <button
            onClick={() => submit(query)}
            disabled={loading || !query.trim()}
            className={cn(
              'px-8 py-3 rounded-none text-[10px] uppercase tracking-[0.2em] font-medium transition-all',
              loading || !query.trim()
                ? 'bg-[var(--text-bright)]/5 text-[var(--text-deep-mute)] cursor-not-allowed'
                : 'bg-gold/10 text-gold hover:bg-gold hover:text-black border border-gold/30'
            )}
          >
            {loading ? 'Cognition in Progress...' : 'Execute Query'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                submit(q);
              }}
              className="text-[9px] uppercase tracking-widest text-[var(--text-dim)] bg-[var(--text-bright)]/[0.02] hover:bg-[var(--text-bright)]/[0.05] hover:text-[var(--text-dim)] px-3 py-2 border border-[var(--border-dim)]/50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gold/60 py-4 font-serif italic">
            <span className="w-4 h-[1px] bg-gold animate-pulse" />
            Accessing decentralized knowledge clusters
          </div>
        )}

        {response && !loading && (
          <div className="bg-[var(--text-bright)]/[0.01] border border-[var(--border-dim)]/50 rounded-none p-6">
            <div className="text-[9px] text-gold/40 mb-4 uppercase tracking-[0.3em] font-medium">
              ArcPulse AI / Unified Response
            </div>
            <p className="text-sm text-[var(--text-dim)] leading-loose font-serif italic">{response}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/5 border border-red-500/10 rounded-none p-4 text-[10px] uppercase tracking-widest text-red-500/60">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
