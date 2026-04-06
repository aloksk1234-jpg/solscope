import type { Portfolio, YieldPool, Strategy, RiskTier } from "@/types";
import { DEFI_PROTOCOLS, SYMBOL_TO_MINT } from "./constants";

const SOL_MINT = "So11111111111111111111111111111111111111112";

/** Given a pool symbol like "USDC-SOL" or "mSOL", return the primary non-SOL token mint */
function resolvePrimaryTokenMint(symbol: string): string | undefined {
  const parts = symbol.toUpperCase().split(/[-/]/);
  for (const part of parts) {
    const mint = SYMBOL_TO_MINT[part.trim()];
    if (mint && mint !== SOL_MINT) return mint;
  }
  // If only SOL found, return SOL mint itself
  return SYMBOL_TO_MINT[parts[0]?.trim() ?? ""];
}

const CONSERVATIVE_PROJECTS = new Set(["marinade", "jito", "sanctum", "lido"]);
const MODERATE_PROJECTS = new Set(["kamino", "marginfi", "solend", "mango", "drift"]);

function categorizePool(pool: YieldPool): RiskTier {
  const project = pool.project.toLowerCase();
  const apy = pool.apy ?? 0;
  const tvl = pool.tvlUsd ?? 0;
  const symbol = (pool.symbol ?? "").toUpperCase();

  // Conservative: stablecoin pools with large TVL, or well-known LST protocols
  if ((pool.stablecoin && tvl > 5_000_000) || CONSERVATIVE_PROJECTS.has(project)) {
    return "conservative";
  }

  // Conservative: very low APY, stable pairs
  if (apy < 10 && tvl > 10_000_000 && pool.stablecoin) {
    return "conservative";
  }

  // Moderate: LST-related or SOL pairs, reasonable APY
  const isLSTRelated =
    symbol.includes("SOL") ||
    symbol.includes("MSOL") ||
    symbol.includes("JITOSOL") ||
    symbol.includes("BSOL") ||
    symbol.includes("STSOL");

  if (
    (isLSTRelated || MODERATE_PROJECTS.has(project)) &&
    tvl > 1_000_000 &&
    apy < 20
  ) {
    return "moderate";
  }

  // Moderate: stablecoin pairs with mid TVL
  if (pool.stablecoin && tvl > 1_000_000 && apy < 25) {
    return "moderate";
  }

  // Growth: concentrated liquidity, decent TVL, APY in 15-50%
  if (tvl > 500_000 && apy >= 15 && apy <= 50) {
    return "growth";
  }

  // Aggressive: everything else with high APY
  return "aggressive";
}

function getProtocolUrl(project: string, poolUrl?: string): string {
  const lowerProject = project.toLowerCase();
  if (poolUrl) return poolUrl;

  const known = DEFI_PROTOCOLS[lowerProject];
  if (known) return known.url;

  // Generate a best-guess URL
  return `https://defillama.com/protocol/${lowerProject}`;
}

function buildSteps(pool: YieldPool, portfolio: Portfolio): string[] {
  const project = pool.project;
  const symbol = pool.symbol;
  const protocolUrl = getProtocolUrl(pool.project, pool.url);

  const steps: string[] = [];

  // Generic steps based on pool type
  if (pool.stablecoin) {
    steps.push(`Acquire USDC or USDT via Jupiter Aggregator (jup.ag).`);
    steps.push(`Visit ${protocolUrl} and connect your Solana wallet.`);
    steps.push(`Navigate to the ${symbol} pool and deposit your stablecoins.`);
    steps.push(`Confirm the transaction in your wallet. You will receive LP tokens.`);
    steps.push(`Monitor your position and compound rewards periodically.`);
  } else if (
    symbol.toUpperCase().includes("SOL") ||
    CONSERVATIVE_PROJECTS.has(project.toLowerCase())
  ) {
    steps.push(`Ensure you have SOL in your wallet (keep ~0.05 SOL for transaction fees).`);
    steps.push(`Visit ${protocolUrl} and connect your Solana wallet.`);
    steps.push(`Find the ${symbol} pool and review the current APY.`);
    steps.push(`Deposit your desired SOL amount. You will receive ${symbol} tokens representing your stake.`);
    steps.push(`Your ${symbol} tokens will auto-compound yield. You can unstake at any time.`);
  } else {
    steps.push(`Ensure you hold the required tokens: ${symbol}.`);
    steps.push(`Visit ${protocolUrl} and connect your wallet.`);
    steps.push(`Navigate to the ${symbol} pool/vault.`);
    steps.push(`Approve token spending and deposit your tokens.`);
    steps.push(`Track your position and harvest rewards as they accumulate.`);
  }

  return steps;
}

function buildRiskFactors(pool: YieldPool, tier: RiskTier): string[] {
  const factors: string[] = [];

  if (tier === "aggressive") {
    factors.push("High impermanent loss risk if assets diverge significantly in price.");
    factors.push("Smart contract risk — protocol may have unaudited or newer contracts.");
    factors.push("APY is variable and may decrease as TVL grows.");
  } else if (tier === "growth") {
    factors.push("Moderate impermanent loss risk in volatile market conditions.");
    factors.push("Reward token emissions may decrease over time, reducing APY.");
    factors.push("Protocol smart contract risk.");
  } else if (tier === "moderate") {
    factors.push("Small impermanent loss risk for non-stable pairs.");
    factors.push("Liquid staking protocols carry slashing risk (very low historically).");
    factors.push("APY may fluctuate based on staking demand.");
  } else {
    factors.push("Stablecoin depeg risk (low probability but exists).");
    factors.push("Protocol smart contract risk (audited protocols only).");
    factors.push("Yield may be lower than inflation in some market conditions.");
  }

  if (pool.tvlUsd < 1_000_000) {
    factors.push("Low TVL pool — higher risk of liquidity issues or rug pull.");
  }

  return factors;
}

function buildMatchReason(pool: YieldPool, portfolio: Portfolio): string {
  const { breakdown, tokens } = portfolio;
  const totalUsd = portfolio.totalUsdValue;

  if (totalUsd === 0) return "Diversify your portfolio with yield-bearing assets.";

  const solPct = Math.round((breakdown.sol / totalUsd) * 100);
  const stablePct = Math.round((breakdown.stablecoins / totalUsd) * 100);

  if (pool.stablecoin && stablePct > 10) {
    return `You have ${stablePct}% in stablecoins — put them to work earning yield.`;
  }

  if (
    (pool.symbol.toUpperCase().includes("SOL") || CONSERVATIVE_PROJECTS.has(pool.project.toLowerCase())) &&
    solPct > 20
  ) {
    return `${solPct}% of your portfolio is in SOL — liquid staking keeps it productive.`;
  }

  if (tokens.length > 5) {
    return `Diversified portfolio with ${tokens.length} tokens — this pool complements your holdings.`;
  }

  return "This pool offers competitive yield with manageable risk for your portfolio size.";
}

export function getStrategyRecommendations(
  portfolio: Portfolio,
  pools: YieldPool[]
): Record<RiskTier, Strategy[]> {
  const tiers: Record<RiskTier, Strategy[]> = {
    conservative: [],
    moderate: [],
    growth: [],
    aggressive: [],
  };

  // Filter out zero-TVL and invalid pools
  const validPools = pools.filter(
    (p) => p.tvlUsd > 100_000 && p.apy >= 0 && p.apy < 10000
  );

  // Score and categorize
  const categorized: Array<{ pool: YieldPool; tier: RiskTier; score: number }> = validPools.map(
    (pool) => {
      const tier = categorizePool(pool);

      // Score: balance TVL (stability signal) and APY (yield attractiveness)
      const tvlScore = Math.log10(Math.max(pool.tvlUsd, 1)) / 10; // 0-1 range
      const apyScore = Math.min(pool.apy / 100, 1); // cap at 100% APY
      const score = tvlScore * 0.6 + apyScore * 0.4;

      return { pool, tier, score };
    }
  );

  // Group by tier, sort by score descending, take top 5
  for (const { pool, tier, score: _score } of categorized) {
    if (tiers[tier].length >= 5) continue;

    const protocolUrl = getProtocolUrl(pool.project, pool.url);
    const steps = buildSteps(pool, portfolio);
    const riskFactors = buildRiskFactors(pool, tier);
    const matchReason = buildMatchReason(pool, portfolio);

    const tokenSymbols = pool.symbol.split(/[-/]/).map((s) => s.trim());
    const primaryTokenMint = resolvePrimaryTokenMint(pool.symbol);

    const strategy: Strategy = {
      id: pool.pool,
      protocol: pool.project,
      protocolUrl,
      title: `${pool.symbol} on ${pool.project}`,
      description: `Earn ${pool.apy.toFixed(1)}% APY by providing liquidity to the ${pool.symbol} pool on ${pool.project}. TVL: $${(pool.tvlUsd / 1_000_000).toFixed(1)}M.`,
      apy: pool.apy,
      apyBase: pool.apyBase,
      apyReward: pool.apyReward,
      tvlUsd: pool.tvlUsd,
      riskTier: tier,
      riskFactors,
      steps,
      tokens: tokenSymbols,
      primaryTokenMint,
      matchReason,
    };

    tiers[tier].push(strategy);
  }

  return tiers;
}
