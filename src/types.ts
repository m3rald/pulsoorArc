export interface NetworkStats {
  blockNumber: string;
  gasPrice: string;          // in USDC (e.g. "0.00000021")
  avgBlockTime: string;      // seconds
  tps: string;
  latestBlockTxCount: number;
  latestBlockTimestamp: number;
  totalTransactions: string;
  totalAddresses: string;
  txToday: number | string;
}

export interface Block {
  height: number;
  hash: string;
  timestamp: string;
  tx_count: number;
  gas_used: string;
  gas_limit: string;
  miner: { hash: string };
}

export interface Transaction {
  hash: string;
  from: { hash: string } | null;
  to: { hash: string } | null;
  value: string;
  gas_price: string;
  timestamp: string;
  status: 'ok' | 'error';
  method: string | null;
  block: number;
}

export interface SmartContract {
  address: { hash: string; name: string | null };
  name: string | null;
  language: string;
  verified_at: string | null;
}

export interface GasDataPoint {
  block: number;
  gasPrice: number;
  txCount: number;
  timestamp: string;
}
