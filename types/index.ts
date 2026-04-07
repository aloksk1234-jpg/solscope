export interface TokenHolding {
  mint: string;
  name: string;
  symbol: string;
  logoURI?: string;
  balance: number;
  decimals: number;
  usdValue?: number;
  priceUsd?: number;
  change24h?: number;
}

export interface NFTHolding {
  mint: string;
  name: string;
  image?: string;
  collection?: string;
  collectionMint?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface Portfolio {
  address: string;
  domain?: string;
  solBalance: number;
  solUsdValue: number;
  totalUsdValue: number;
  tokens: TokenHolding[];
  nfts: NFTHolding[];
  breakdown: {
    sol: number;
    stablecoins: number;
    defiTokens: number;
    nfts: number;
    other: number;
  };
}

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  ilRisk?: string;
  stablecoin?: boolean;
  exposure?: string;
  url?: string;
}

export type RiskTier = "conservative" | "moderate" | "growth" | "aggressive";

export interface Strategy {
  id: string;
  protocol: string;
  protocolUrl: string;
  title: string;
  description: string;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  tvlUsd: number;
  riskTier: RiskTier;
  riskFactors: string[];
  steps: string[];
  tokens: string[];
  /** Primary non-SOL token mint address, used for Bags swap integration */
  primaryTokenMint?: string;
  matchReason?: string;
  /** Override protocol logo URL (e.g. from DefiLlama) */
  protocolLogoUrl?: string;
}

export interface HealthScore {
  total: number;
  grade: string;
  breakdown: {
    diversification: number;
    riskExposure: number;
    defiUtilization: number;
    stablecoinRatio: number;
    nftQuality: number;
  };
  tips: string[];
}
