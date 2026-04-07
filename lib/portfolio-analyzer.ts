import type { HeliusDASResponse, HeliusAsset } from "./helius";
import type { Portfolio, TokenHolding, NFTHolding } from "@/types";
import { KNOWN_TOKENS, STABLE_MINTS, LST_MINTS } from "./constants";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const LAMPORTS_PER_SOL = 1_000_000_000;

const FUNGIBLE_INTERFACES = new Set([
  "FungibleToken",
  "FungibleAsset",
]);

const NFT_INTERFACES = new Set([
  "V1_NFT",
  "ProgrammableNFT",
  "V1_PRINT",
  "LEGACY_NFT",
  "NonFungible",
  "NonFungibleEdition",
]);

function isNFT(asset: HeliusAsset): boolean {
  return NFT_INTERFACES.has(asset.interface);
}

function isFungible(asset: HeliusAsset): boolean {
  return FUNGIBLE_INTERFACES.has(asset.interface);
}

export function analyzePortfolio(
  address: string,
  dasResponse: HeliusDASResponse,
  prices: Record<string, number>
): Portfolio {
  const { items, nativeBalance } = dasResponse;

  // Native SOL
  const lamports = nativeBalance?.lamports ?? 0;
  const solBalance = lamports / LAMPORTS_PER_SOL;
  const solPriceFromHelius = nativeBalance?.price_per_sol;
  const solPrice = solPriceFromHelius ?? prices[SOL_MINT] ?? 0;
  const solUsdValue = solBalance * solPrice;

  const tokens: TokenHolding[] = [];
  const nfts: NFTHolding[] = [];

  for (const asset of items) {
    if (isNFT(asset)) {
      // Parse NFT
      const collectionGrouping = asset.grouping?.find((g) => g.group_key === "collection");
      const image = asset.content?.links?.image;
      const nftName = asset.content?.metadata?.name ?? "Unknown NFT";

      // Spam filter: skip NFTs with no image and no recognizable name
      if (!image && nftName === "Unknown NFT") continue;

      nfts.push({
        mint: asset.id,
        name: nftName,
        image,
        collection: collectionGrouping?.group_value
          ? undefined
          : undefined,
        collectionMint: collectionGrouping?.group_value,
      });
    } else if (isFungible(asset)) {
      // Parse fungible token
      const tokenInfo = asset.token_info;
      if (!tokenInfo) continue;

      const rawBalance = tokenInfo.balance ?? 0;
      const decimals = tokenInfo.decimals ?? 0;
      const balance = rawBalance / Math.pow(10, decimals);

      if (balance <= 0) continue;

      const known = KNOWN_TOKENS[asset.id];
      const name = known?.name ?? asset.content?.metadata?.name ?? tokenInfo.symbol ?? "Unknown";
      const symbol = known?.symbol ?? tokenInfo.symbol ?? asset.content?.metadata?.symbol ?? "?";
      const logoURI = known?.logoURI ?? asset.content?.links?.image;

      // Price: prefer Helius price_info, then Jupiter prices
      const heliusPrice = tokenInfo.price_info?.price_per_token;
      const jupPrice = prices[asset.id];
      const priceUsd = heliusPrice ?? jupPrice ?? 0;
      const usdValue = balance * priceUsd;

      // Spam filter: skip unknown tokens with negligible value
      if (!known && usdValue < 0.01) continue;

      tokens.push({
        mint: asset.id,
        name,
        symbol,
        logoURI,
        balance,
        decimals,
        usdValue,
        priceUsd,
      });
    }
  }

  // Sort tokens by USD value descending
  tokens.sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));

  // Calculate breakdown
  let stablecoinsUsd = 0;
  let lstUsd = 0;
  let otherTokensUsd = 0;

  for (const token of tokens) {
    const usd = token.usdValue ?? 0;
    if (STABLE_MINTS.includes(token.mint)) {
      stablecoinsUsd += usd;
    } else if (LST_MINTS.includes(token.mint)) {
      lstUsd += usd;
    } else {
      otherTokensUsd += usd;
    }
  }

  // NFT value is 0 for MVP (no floor price data)
  const nftUsd = 0;

  const totalUsdValue = solUsdValue + stablecoinsUsd + lstUsd + otherTokensUsd + nftUsd;

  const breakdown = {
    sol: solUsdValue,
    stablecoins: stablecoinsUsd,
    defiTokens: lstUsd,
    nfts: nftUsd,
    other: otherTokensUsd,
  };

  return {
    address,
    solBalance,
    solUsdValue,
    totalUsdValue,
    tokens,
    nfts,
    breakdown,
  };
}
