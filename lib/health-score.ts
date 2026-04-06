import type { Portfolio, HealthScore } from "@/types";
import { STABLE_MINTS, LST_MINTS } from "./constants";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function calculateHealthScore(portfolio: Portfolio): HealthScore {
  const { breakdown, tokens, nfts, totalUsdValue } = portfolio;

  const tips: string[] = [];

  // ── 1. Diversification (30 pts) ─────────────────────────────────────────
  // Score based on number of non-zero asset classes
  const assetClasses = [
    breakdown.sol > 0 ? 1 : 0,
    breakdown.stablecoins > 0 ? 1 : 0,
    breakdown.defiTokens > 0 ? 1 : 0,
    breakdown.other > 0 ? 1 : 0,
    breakdown.nfts > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Also consider how many tokens exist
  const tokenDiversity = clamp(tokens.length / 5, 0, 1); // 5+ tokens = full bonus

  // Concentration penalty: if SOL is >80% of portfolio, penalize
  const solConcentration = totalUsdValue > 0 ? breakdown.sol / totalUsdValue : 0;
  const concentrationPenalty = solConcentration > 0.8 ? 0.5 : solConcentration > 0.6 ? 0.75 : 1;

  const diversificationScore = clamp(
    Math.round(((assetClasses / 5) * 0.6 + tokenDiversity * 0.4) * 30 * concentrationPenalty),
    0,
    30
  );

  if (assetClasses < 3) {
    tips.push("Diversify across more asset classes (stablecoins, DeFi tokens, NFTs).");
  }
  if (solConcentration > 0.7) {
    tips.push("Consider reducing SOL concentration below 70% of your portfolio.");
  }

  // ── 2. Risk Exposure (25 pts) ────────────────────────────────────────────
  // More stablecoins + LSTs = lower risk = higher score
  const stableRatio = totalUsdValue > 0 ? (breakdown.stablecoins + breakdown.defiTokens) / totalUsdValue : 0;
  // Penalize highly volatile concentration (other tokens without utility)
  const volatileRatio = totalUsdValue > 0 ? breakdown.other / totalUsdValue : 0;

  const riskScore = clamp(
    Math.round((stableRatio * 0.5 + (1 - volatileRatio) * 0.5) * 25),
    0,
    25
  );

  if (volatileRatio > 0.5) {
    tips.push("High exposure to volatile tokens. Consider moving some to stablecoins or LSTs.");
  }

  // ── 3. DeFi Utilization (20 pts) ────────────────────────────────────────
  // LST holdings or DeFi tokens indicate active DeFi usage
  const hasLSTs = tokens.some((t) => LST_MINTS.includes(t.mint) && (t.usdValue ?? 0) > 10);
  const defiRatio = totalUsdValue > 0 ? breakdown.defiTokens / totalUsdValue : 0;

  let defiScore = 0;
  if (hasLSTs) defiScore += 10;
  defiScore += clamp(Math.round(defiRatio * 20), 0, 10);

  const defiUtilizationScore = clamp(defiScore, 0, 20);

  if (!hasLSTs && totalUsdValue > 100) {
    tips.push("Stake SOL via liquid staking (mSOL, JitoSOL) to earn yield while staying liquid.");
  }

  // ── 4. Stablecoin Ratio (15 pts) ─────────────────────────────────────────
  // Ideal stablecoin ratio is 10-30%
  const stablecoinPct = totalUsdValue > 0 ? breakdown.stablecoins / totalUsdValue : 0;

  let stablecoinScore = 0;
  if (stablecoinPct >= 0.1 && stablecoinPct <= 0.3) {
    stablecoinScore = 15; // ideal range
  } else if (stablecoinPct > 0.3 && stablecoinPct <= 0.5) {
    stablecoinScore = 10; // a bit high but ok
  } else if (stablecoinPct > 0.5) {
    stablecoinScore = 5; // too much dry powder, not working hard enough
    tips.push("Over 50% in stablecoins — consider deploying to yield-bearing protocols.");
  } else if (stablecoinPct > 0 && stablecoinPct < 0.1) {
    stablecoinScore = 8; // some stables are good
  } else {
    stablecoinScore = 3; // no stables at all
    if (totalUsdValue > 200) {
      tips.push("Hold 10-30% in stablecoins as dry powder for opportunities.");
    }
  }

  const stablecoinRatioScore = clamp(stablecoinScore, 0, 15);

  // ── 5. NFT Quality (10 pts) ──────────────────────────────────────────────
  // Simplified for MVP: just having some NFTs is fine
  const hasNFTs = nfts.length > 0;
  const nftScore = hasNFTs ? Math.min(10, nfts.length * 2) : 0;

  const nftQualityScore = clamp(nftScore, 0, 10);

  // ── Total ─────────────────────────────────────────────────────────────────
  const total = clamp(
    diversificationScore + riskScore + defiUtilizationScore + stablecoinRatioScore + nftQualityScore,
    0,
    100
  );

  // Ensure we always have at least a couple of tips
  if (tips.length === 0) {
    tips.push("Your portfolio looks well-balanced. Keep monitoring yield opportunities.");
    tips.push("Consider exploring DeFi protocols to maximize capital efficiency.");
  }

  return {
    total,
    grade: getGrade(total),
    breakdown: {
      diversification: diversificationScore,
      riskExposure: riskScore,
      defiUtilization: defiUtilizationScore,
      stablecoinRatio: stablecoinRatioScore,
      nftQuality: nftQualityScore,
    },
    tips,
  };
}
