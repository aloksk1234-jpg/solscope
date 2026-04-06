import type {
  BagsFeedToken,
  BagsCreator,
  BagsPool,
  BagsTokenFees,
  BagsClaimStat,
  BagsTradeQuote,
} from "@/types/bags";

const BAGS_BASE = "https://public-api-v2.bags.fm/api/v1";

function getBagsApiKey(): string {
  const key = process.env.BAGS_API_KEY ?? "";
  return key;
}

async function bagsGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BAGS_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": getBagsApiKey(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Bags API ${path} failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // Bags API wraps responses: { success: boolean, response: T } or { success: boolean, error: string }
  if (json?.success === false) {
    throw new Error(`Bags API error: ${json.error ?? "Unknown error"}`);
  }

  return (json?.response ?? json) as T;
}

async function bagsPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BAGS_BASE}${path}`, {
    method: "POST",
    headers: {
      "x-api-key": getBagsApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Bags API POST ${path} failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json?.success === false) {
    throw new Error(`Bags API error: ${json.error ?? "Unknown error"}`);
  }

  return (json?.response ?? json) as T;
}

// ── Public API functions ───────────────────────────────────────────────────

/** Get recent token launch feed */
export async function getTokenLaunchFeed(): Promise<BagsFeedToken[]> {
  try {
    const data = await bagsGet<BagsFeedToken[] | { tokens?: BagsFeedToken[] }>("/token-launch/feed");
    // Handle both array and object responses
    if (Array.isArray(data)) return data;
    if (data && "tokens" in data && Array.isArray(data.tokens)) return data.tokens;
    return [];
  } catch {
    return [];
  }
}

/** Get the creator info for a specific token mint */
export async function getTokenCreator(tokenMint: string): Promise<BagsCreator | null> {
  try {
    const data = await bagsGet<BagsCreator | BagsCreator[]>("/token-launch/creator/v3", { tokenMint });
    if (Array.isArray(data)) return data[0] ?? null;
    return data;
  } catch {
    return null;
  }
}

/** Check if a token mint is a Bags pool token */
export async function getBagsPool(tokenMint: string): Promise<BagsPool | null> {
  try {
    const data = await bagsGet<BagsPool>("/solana/bags/pools/token-mint", { tokenMint });
    return data;
  } catch {
    return null;
  }
}

/** Get lifetime fees for a token */
export async function getTokenLifetimeFees(
  tokenMint: string,
  solPrice: number
): Promise<BagsTokenFees | null> {
  try {
    const data = await bagsGet<{ feesLamports?: number; lifetimeFees?: number } | number>(
      "/token-launch/lifetime-fees",
      { tokenMint }
    );

    // Normalise: response may be lamports directly or an object
    let lamports = 0;
    if (typeof data === "number") {
      lamports = data;
    } else if (typeof data === "object" && data !== null) {
      lamports = (data as { feesLamports?: number; lifetimeFees?: number }).feesLamports
        ?? (data as { feesLamports?: number; lifetimeFees?: number }).lifetimeFees
        ?? 0;
    }

    const feesSOL = lamports / 1_000_000_000;
    return {
      tokenMint,
      feesLamports: lamports,
      feesSOL,
      feesUSD: feesSOL * solPrice,
    };
  } catch {
    return null;
  }
}

/** Get claim stats for a token (who claimed how much) */
export async function getTokenClaimStats(tokenMint: string): Promise<BagsClaimStat[]> {
  try {
    const data = await bagsGet<
      Array<{ wallet: string; amount?: number; totalClaimed?: number; isCreator?: boolean }>
    >("/token-launch/claim-stats", { tokenMint });

    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      wallet: item.wallet,
      totalClaimedLamports: item.amount ?? item.totalClaimed ?? 0,
      totalClaimedSOL: (item.amount ?? item.totalClaimed ?? 0) / 1_000_000_000,
      isCreator: item.isCreator ?? false,
    }));
  } catch {
    return [];
  }
}

/** Get a trade quote from Bags */
export async function getTradeQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
}): Promise<BagsTradeQuote> {
  const queryParams: Record<string, string> = {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
  };
  if (params.slippageBps != null) {
    queryParams.slippageBps = String(params.slippageBps);
  }

  const data = await bagsGet<{
    outputAmount?: string;
    outAmount?: string;
    priceImpact?: number;
    priceImpactPct?: number;
    slippage?: number;
    routePlan?: unknown;
  }>("/trade/quote", queryParams);

  return {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    inputAmount: params.amount,
    outputAmount: data.outputAmount ?? data.outAmount ?? "0",
    priceImpact: data.priceImpact ?? data.priceImpactPct ?? 0,
    slippage: data.slippage,
    routePlan: data.routePlan,
  };
}

/**
 * Given a list of token mints (from a wallet's holdings), find which ones
 * are Bags tokens and check if the wallet is the creator.
 * Returns enriched data for each matching token.
 */
export async function findBagsTokensForWallet(
  walletAddress: string,
  tokenMints: string[],
  solPrice: number
): Promise<import("@/types/bags").BagsWalletToken[]> {
  if (tokenMints.length === 0) return [];

  // Check mints in parallel, but cap concurrency to avoid rate-limit hammering
  const CONCURRENCY = 8;
  const results: import("@/types/bags").BagsWalletToken[] = [];

  for (let i = 0; i < tokenMints.length; i += CONCURRENCY) {
    const batch = tokenMints.slice(i, i + CONCURRENCY);
    const poolChecks = await Promise.allSettled(batch.map((mint) => getBagsPool(mint)));

    // Filter to mints that have Bags pools
    const matched: Array<{ mint: string; pool: BagsPool }> = [];
    for (let j = 0; j < batch.length; j++) {
      const result = poolChecks[j];
      if (result.status === "fulfilled" && result.value !== null) {
        matched.push({ mint: batch[j], pool: result.value });
      }
    }

    if (matched.length === 0) continue;

    // For matched tokens, fetch creator + fees in parallel
    await Promise.allSettled(
      matched.map(async ({ mint, pool }) => {
        const [creator, fees, claimStats] = await Promise.allSettled([
          getTokenCreator(mint),
          getTokenLifetimeFees(mint, solPrice),
          getTokenClaimStats(mint),
        ]);

        const creatorData = creator.status === "fulfilled" ? creator.value : null;
        const isCreator =
          creatorData !== null &&
          creatorData.wallet?.toLowerCase() === walletAddress.toLowerCase() &&
          creatorData.isCreator;

        results.push({
          tokenMint: mint,
          name: pool.tokenMint, // will be enriched from portfolio data
          symbol: "",
          pool,
          isCreator,
          creator: creatorData ?? undefined,
          lifetimeFees: fees.status === "fulfilled" && fees.value ? fees.value : undefined,
          claimStats:
            claimStats.status === "fulfilled" && claimStats.value.length > 0
              ? claimStats.value
              : undefined,
        });
      })
    );
  }

  return results;
}
