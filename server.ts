import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { arcClient, formatUsdc } from "./src/lib/arc-client.ts";
import { getStats, getRecentBlocks, getRecentTransactions, getSmartContracts } from "./src/lib/blockscout.ts";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  app.get("/api/network", async (req, res) => {
    try {
      const blockNumber = await arcClient.getBlockNumber();
      const gasPrice = await arcClient.getGasPrice();
      const bsStats = await getStats().catch(() => null);

      const blocks = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          arcClient.getBlock({ blockNumber: blockNumber - BigInt(i) })
        )
      );

      const timestamps = blocks.map((b) => Number(b.timestamp));
      const intervals = timestamps
        .slice(0, -1)
        .map((t, i) => Math.abs(t - timestamps[i + 1]))
        .filter((d) => d > 0);

      const avgBlockTime =
        intervals.length > 0
          ? intervals.reduce((a, b) => a + b, 0) / intervals.length
          : 1;

      const txCounts = blocks.map((b) => b.transactions.length);
      const avgTxPerBlock = txCounts.reduce((a, b) => a + b, 0) / txCounts.length;
      const tps = avgBlockTime > 0 ? avgTxPerBlock / avgBlockTime : 0;

      const gasPriceUsdc = parseFloat(formatUsdc(gasPrice));

      res.json({
        blockNumber: blockNumber.toString(),
        gasPrice: gasPriceUsdc.toFixed(8),
        avgBlockTime: avgBlockTime.toFixed(3),
        tps: tps.toFixed(3),
        latestBlockTxCount: blocks[0].transactions.length,
        latestBlockTimestamp: Number(blocks[0].timestamp),
        totalTransactions: bsStats?.total_transactions ?? '—',
        totalAddresses: bsStats?.total_addresses ?? '—',
        txToday: bsStats?.transactions_today ?? '—',
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/blocks", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const blocks = await getRecentBlocks(limit);
      res.json({ blocks });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 25;
      const txs = await getRecentTransactions(limit);
      res.json({ transactions: txs });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await getSmartContracts(15);
      res.json({ contracts });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/gas-history", async (req, res) => {
    try {
      const latest = await arcClient.getBlockNumber();
      const blocks = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
          arcClient.getBlock({ blockNumber: latest - BigInt(i * 5) })
        )
      );

      const history = blocks
        .reverse()
        .map((b) => ({
          block: Number(b.number),
          gasPrice: b.baseFeePerGas
            ? parseFloat(parseFloat(formatUsdc(b.baseFeePerGas)).toFixed(8))
            : 0,
          txCount: b.transactions.length,
          timestamp: new Date(Number(b.timestamp) * 1000).toLocaleTimeString(),
        }));

      res.json({ history });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post("/api/ai-query", async (req, res) => {
    try {
      const { query, networkContext } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query required" });
      }

      const promptTemplate = `You are ArcPulse AI — the analytics intelligence layer for Arc Network, 
Circle's stablecoin-native Layer-1 blockchain. 

Key facts about Arc Network:
- Chain ID: 5042002 | Testnet | Mainnet coming 2026
- Native gas token: USDC (6 decimals) — fees are dollar-denominated, no volatility
- Consensus: Malachite BFT (Tendermint-based) — deterministic sub-second finality
- Built-in StableFX engine: institutional-grade RFQ + 24/7 PvP on-chain settlement
- Opt-in privacy via TEE (Trusted Execution Environments)
- Full Circle platform integration: USDC, EURC, CCTP, Gateway, Paymaster
- EVM-compatible (Reth execution layer) — Solidity, Hardhat, Foundry work natively
- Explorer: testnet.arcscan.app

Current live network data: ${JSON.stringify(networkContext ?? {})}

Query: ${query}

Answer in 2-4 sentences. Be concise, analytical, and specific to Arc's architecture.
If data is unavailable or you're unsure, say so briefly.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptTemplate,
      });
      const text = result.text || "I was unable to process your request at this time.";

      res.json({ response: text });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Catch-all for SPA in dev mode
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ArcPulse Analytics</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
