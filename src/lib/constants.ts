export const ARC_RPC = 'https://rpc.testnet.arc.network';
export const BLOCKSCOUT_API = 'https://testnet.arcscan.app/api/v2';
export const CHAIN_ID = 5042002;
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
export const USDC_DECIMALS = 6;

export const STABLEFX_PAIRS = [
  { pair: 'USDC/AUDF', rate: 1.548, change: +0.12, vol24h: 234000 },
  { pair: 'USDC/BRLA', rate: 5.821, change: -0.34, vol24h: 189000 },
  { pair: 'USDC/JPYC', rate: 149.32, change: +0.08, vol24h: 412000 },
  { pair: 'USDC/KRW1', rate: 1342.5, change: -0.21, vol24h: 98000 },
  { pair: 'USDC/MXNB', rate: 17.42, change: +0.45, vol24h: 156000 },
  { pair: 'USDC/PHPC', rate: 56.18, change: -0.09, vol24h: 67000 },
  { pair: 'USDC/QCAD', rate: 1.365, change: +0.02, vol24h: 143000 },
  { pair: 'USDC/EURC', rate: 0.921, change: -0.15, vol24h: 887000 },
];

export const PARTNER_CLUSTERS = [
  { name: 'BlackRock', sector: 'Asset Manager', status: 'active' },
  { name: 'Visa', sector: 'Payments', status: 'active' },
  { name: 'HSBC', sector: 'Banking', status: 'active' },
  { name: 'Goldman Sachs', sector: 'Banking', status: 'building' },
  { name: 'Coinbase', sector: 'Exchange', status: 'active' },
  { name: 'Mastercard', sector: 'Payments', status: 'active' },
  { name: 'Anthropic', sector: 'AI', status: 'active' },
  { name: 'AWS', sector: 'Infrastructure', status: 'active' },
];
