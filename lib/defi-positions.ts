import type { TokenHolding } from "@/types";

export type PositionType = "liquid-staking" | "lending" | "lp" | "farming";

export interface DeFiPosition {
  protocol: string;
  protocolUrl: string;
  type: PositionType;
  tokenSymbol: string;
  tokenMint: string;
  usdValue: number;
  apy?: number;
  description: string;
}

// Known receipt token mints → position metadata
const RECEIPT_TOKENS: Record<
  string,
  {
    protocol: string;
    url: string;
    type: PositionType;
    description: string;
    estimatedApy?: number;
  }
> = {
  // Liquid staking
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: {
    protocol: "Marinade",
    url: "https://marinade.finance",
    type: "liquid-staking",
    description: "Marinade staked SOL",
    estimatedApy: 7.5,
  },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: {
    protocol: "Jito",
    url: "https://www.jito.network",
    type: "liquid-staking",
    description: "Jito staked SOL",
    estimatedApy: 8.1,
  },
  bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1: {
    protocol: "BlazeStake",
    url: "https://stake.solblaze.org",
    type: "liquid-staking",
    description: "BlazeStake staked SOL",
    estimatedApy: 7.3,
  },
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": {
    protocol: "Lido",
    url: "https://solana.lido.fi",
    type: "liquid-staking",
    description: "Lido staked SOL",
    estimatedApy: 6.5,
  },
  "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm": {
    protocol: "Sanctum",
    url: "https://app.sanctum.so",
    type: "liquid-staking",
    description: "Sanctum Infinity LST",
    estimatedApy: 8.0,
  },
  jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v: {
    protocol: "Jupiter",
    url: "https://jup.ag/swap/SOL-JupSOL",
    type: "liquid-staking",
    description: "Jupiter staked SOL",
    estimatedApy: 8.2,
  },
  // Kamino lending receipt tokens
  FBSyPnxtHKLBZ4UeeUyAnbtFuAmTHLtso9YtsqRDRWpM: {
    protocol: "Kamino",
    url: "https://app.kamino.finance",
    type: "lending",
    description: "Kamino USDC deposit",
    estimatedApy: 5.2,
  },
  d4A2prbA2whesmvHaL88BH6Ewn5N4bTSU2Ze8P6Bc4Q: {
    protocol: "Kamino",
    url: "https://app.kamino.finance",
    type: "lending",
    description: "Kamino SOL deposit",
    estimatedApy: 4.8,
  },
  // MarginFi
  "3hFhFRDQhh5bVCHQDTCBWJuNnUNdFBGnpDTDSBv2jQ6S": {
    protocol: "MarginFi",
    url: "https://app.marginfi.com",
    type: "lending",
    description: "MarginFi USDC deposit",
  },
};

export function detectDeFiPositions(tokens: TokenHolding[]): DeFiPosition[] {
  const positions: DeFiPosition[] = [];

  for (const token of tokens) {
    const meta = RECEIPT_TOKENS[token.mint];
    if (!meta) continue;

    positions.push({
      protocol: meta.protocol,
      protocolUrl: meta.url,
      type: meta.type,
      tokenSymbol: token.symbol,
      tokenMint: token.mint,
      usdValue: token.usdValue ?? 0,
      apy: meta.estimatedApy,
      description: meta.description,
    });
  }

  // Sort by USD value descending
  positions.sort((a, b) => b.usdValue - a.usdValue);

  return positions;
}
