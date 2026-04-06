const HELIUS_API_KEY = process.env.HELIUS_API_KEY ?? "";

export interface EnhancedTransaction {
  signature: string;
  timestamp: number;
  type: string; // "SWAP" | "TRANSFER" | "NFT_SALE" | "STAKE" | "UNKNOWN" etc.
  description: string;
  fee: number; // lamports
  nativeTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers?: Array<{
    mint: string;
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
  }>;
  source?: string; // "JUPITER" | "MAGIC_EDEN" | etc.
}

export async function getWalletTransactions(
  address: string,
  limit = 50
): Promise<EnhancedTransaction[]> {
  if (!HELIUS_API_KEY) {
    throw new Error("HELIUS_API_KEY is not configured");
  }

  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 }, // cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(
      `Helius transactions API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data as EnhancedTransaction[];
}
