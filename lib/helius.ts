const HELIUS_API_KEY = process.env.HELIUS_API_KEY ?? "";
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export interface HeliusAsset {
  id: string;
  interface: string; // 'FungibleToken' | 'FungibleAsset' | 'V1_NFT' | 'ProgrammableNFT' etc.
  content: {
    metadata: { name: string; symbol: string };
    links?: { image?: string };
    json_uri?: string;
  };
  token_info?: {
    symbol: string;
    balance: number;
    decimals: number;
    price_info?: {
      price_per_token: number;
      currency: string;
    };
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
}

export interface HeliusDASResponse {
  nativeBalance?: { lamports: number; price_per_sol?: number };
  items: HeliusAsset[];
  total: number;
}

export async function getAssetsByOwner(address: string): Promise<HeliusDASResponse> {
  const response = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "solscope-das",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: address,
        page: 1,
        limit: 1000,
        displayOptions: {
          showFungible: true,
          showNativeBalance: true,
          showCollectionMetadata: true,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(`Helius RPC error: ${json.error.message ?? JSON.stringify(json.error)}`);
  }

  const result = json.result as HeliusDASResponse;
  return result;
}
