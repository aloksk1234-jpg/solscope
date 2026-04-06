// ── Bags.fm API Types ──────────────────────────────────────────────────────

export interface BagsFeedToken {
  tokenMint: string;
  name: string;
  symbol: string;
  image?: string;
  description?: string;
  website?: string;
  twitter?: string;
  createdAt?: number; // unix timestamp
  status?: string;
}

export interface BagsCreator {
  wallet: string;
  provider?: string; // 'twitter' | 'kick' | 'github' | 'tiktok'
  providerUsername?: string;
  username?: string;
  pfp?: string;
  royaltyBps?: number;
  isCreator: boolean;
}

export interface BagsPool {
  tokenMint: string;
  poolAddress: string;
  meteoraDbcPool?: string;
  dammV2Pool?: string;
}

export interface BagsTokenFees {
  tokenMint: string;
  feesLamports: number;
  feesSOL: number;
  feesUSD: number;
}

export interface BagsClaimStat {
  wallet: string;
  totalClaimedLamports: number;
  totalClaimedSOL: number;
  isCreator: boolean;
}

export interface BagsTradeQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string; // base units
  outputAmount: string; // base units
  priceImpact: number; // percentage
  slippage?: number;
  routePlan?: unknown;
}

// ── Enriched types used in the UI ─────────────────────────────────────────

export interface BagsWalletToken {
  tokenMint: string;
  name: string;
  symbol: string;
  image?: string;
  pool: BagsPool;
  isCreator: boolean;
  creator?: BagsCreator;
  lifetimeFees?: BagsTokenFees;
  claimStats?: BagsClaimStat[];
}
