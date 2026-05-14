import { createPublicClient, http, defineChain, formatUnits } from 'viem';
import { ARC_RPC, CHAIN_ID, USDC_DECIMALS } from './constants';

export const arcTestnet = defineChain({
  id: CHAIN_ID,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: USDC_DECIMALS },
  rpcUrls: {
    default: { http: [ARC_RPC] },
    public: { http: [ARC_RPC] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
});

export const arcClient = createPublicClient({
  chain: arcTestnet,
  transport: http(ARC_RPC, { timeout: 10_000 }),
});

export function formatUsdc(wei: bigint): string {
  return formatUnits(wei, USDC_DECIMALS);
}

export function formatAddress(addr: string): string {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatHash(hash: string): string {
  if (!hash) return '—';
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}
