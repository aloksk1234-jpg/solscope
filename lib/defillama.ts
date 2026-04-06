import type { YieldPool } from "@/types";

const DEFILLAMA_YIELDS_URL = "https://yields.llama.fi/pools";
const TTL_MS = 5 * 60 * 1000; // 5 minutes

// Module-level in-memory cache
let cachedPools: YieldPool[] | null = null;
let cacheTimestamp = 0;

export async function fetchSolanaYields(): Promise<YieldPool[]> {
  // Return cached result if within TTL
  if (cachedPools !== null && Date.now() - cacheTimestamp < TTL_MS) {
    return cachedPools;
  }

  const response = await fetch(DEFILLAMA_YIELDS_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`DefiLlama API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (!json?.data || !Array.isArray(json.data)) {
    return [];
  }

  // Filter for Solana pools only
  const solanaPools: YieldPool[] = json.data
    .filter((pool: Record<string, unknown>) => pool.chain === "Solana")
    .map((pool: Record<string, unknown>) => ({
      pool: pool.pool as string,
      chain: pool.chain as string,
      project: pool.project as string,
      symbol: pool.symbol as string,
      tvlUsd: (pool.tvlUsd as number) ?? 0,
      apy: (pool.apy as number) ?? 0,
      apyBase: pool.apyBase as number | undefined,
      apyReward: pool.apyReward as number | undefined,
      ilRisk: pool.ilRisk as string | undefined,
      stablecoin: (pool.stablecoin as boolean) ?? false,
      exposure: pool.exposure as string | undefined,
      url: pool.url as string | undefined,
    }))
    .filter((pool: YieldPool) => pool.tvlUsd > 0 && pool.apy >= 0);

  // Sort by TVL descending, take top 200
  solanaPools.sort((a, b) => b.tvlUsd - a.tvlUsd);
  const result = solanaPools.slice(0, 200);

  // Store in cache
  cachedPools = result;
  cacheTimestamp = Date.now();

  return result;
}
