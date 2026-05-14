/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import NetworkVitals from './components/NetworkVitals.tsx'
import TransactionFeed from './components/TransactionFeed.tsx'
import FeeChart from './components/FeeChart.tsx'
import ContractLeaderboard from './components/ContractLeaderboard.tsx'
import StableFXPanel from './components/StableFXPanel.tsx'
import AIQueryPanel from './components/AIQueryPanel.tsx'
import PartnerRadar from './components/PartnerRadar.tsx'

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-main)] antialiased transition-colors duration-400 selection:bg-gold/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <header className="border-b border-[var(--border-dim)] pb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 border border-gold text-gold text-[10px] uppercase tracking-[0.2em] font-medium">
                  Arc Network
                </div>
                <div className="w-10 h-[1px] bg-gold opacity-50"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  Testnet Active
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-serif text-[var(--text-bright)] leading-tight tracking-tight">
                ArcPulse<br/>Analytics
              </h1>
              
              <p className="text-sm text-[var(--text-dim)] max-w-md letter-spacing-wide">
                The high-performance analytics OS for Arc Network — the first stablecoin-native Layer 1 by Circle.
              </p>
            </div>

            <div className="text-right flex flex-col items-start md:items-end gap-6">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-dim)] rounded-none text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)] hover:text-gold hover:border-gold/30 transition-all group"
              >
                {isDarkMode ? (
                  <><Sun className="w-3 h-3 group-hover:rotate-45 transition-transform" /> Light Interface</>
                ) : (
                  <><Moon className="w-3 h-3 group-hover:-rotate-12 transition-transform" /> Dark Interface</>
                )}
              </button>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)] mb-1">Network</div>
                  <div className="text-sm text-[var(--text-dim)]">Arc Testnet</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)] mb-1">Chain ID</div>
                  <div className="text-sm text-[var(--text-dim)]">5042002</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)] mb-1">Status</div>
                  <div className="text-sm text-[var(--text-dim)]">Operational</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)] mb-1">Intelligence</div>
                  <div className="text-sm text-[var(--text-dim)]">Gemini 1.5 Pro</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Network vitals — live RPC data */}
        <NetworkVitals />

        {/* Fee intelligence + StableFX side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeeChart />
          <StableFXPanel />
        </div>

        {/* Live transaction feed */}
        <TransactionFeed />

        {/* Contract leaderboard + Partner radar side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContractLeaderboard />
          <PartnerRadar />
        </div>

        {/* AI query panel */}
        <AIQueryPanel />

        {/* Footer */}
        <footer className="border-t border-[var(--border-dim)] pt-12 pb-20 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-mute)]">
              Vanguard Strategic Design 2026
            </div>
            <div className="w-12 h-[1px] bg-gold opacity-30"></div>
            <p className="text-xs text-[var(--text-mute)] max-w-sm leading-loose opacity-70">
              ArcPulse is an independent analytics platform powered by Arc RPC, ArcScan API, and Gemini AI models.
            </p>
            <div className="flex gap-8">
              <a
                href="https://testnet.arcscan.app"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-bright)] transition-colors"
              >
                Explorer
              </a>
              <a
                href="https://docs.arc.network"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-bright)] transition-colors"
              >
                Docs
              </a>
              <a
                href="https://arc.network"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-bright)] transition-colors"
              >
                Network
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

