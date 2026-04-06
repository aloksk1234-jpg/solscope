import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";
import { isValidSolanaAddress } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return Response.json({ error: "Missing address parameter" }, { status: 400 });
  }

  if (!isValidSolanaAddress(address)) {
    return Response.json({ error: "Invalid Solana address" }, { status: 400 });
  }

  try {
    const dasResponse = await getAssetsByOwner(address);

    // Collect all fungible token mints for price lookups
    const mintAddresses = dasResponse.items
      .filter((item) =>
        item.interface === "FungibleToken" || item.interface === "FungibleAsset"
      )
      .map((item) => item.id);

    const prices = await getPrices(mintAddresses);
    const portfolio = analyzePortfolio(address, dasResponse, prices);

    return Response.json(portfolio);
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch portfolio";
    return Response.json({ error: message }, { status: 500 });
  }
}
