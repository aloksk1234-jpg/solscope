/**
 * GET /api/bags/tokens?wallet=ADDRESS&mints=mint1,mint2,...&solPrice=150
 *
 * Finds which of the provided token mints are Bags-launched tokens,
 * then enriches each with creator info and lifetime fees.
 * The wallet param is used to determine isCreator.
 */
import { findBagsTokensForWallet } from "@/lib/bags";
import { isValidSolanaAddress } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const mintsParam = searchParams.get("mints");
  const solPrice = parseFloat(searchParams.get("solPrice") ?? "150");

  if (!wallet || !isValidSolanaAddress(wallet)) {
    return Response.json({ error: "Missing or invalid wallet address" }, { status: 400 });
  }

  const mints = mintsParam
    ? mintsParam
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [];

  if (mints.length === 0) {
    return Response.json({ tokens: [] });
  }

  try {
    const tokens = await findBagsTokensForWallet(wallet, mints, isNaN(solPrice) ? 150 : solPrice);
    return Response.json({ tokens });
  } catch (err) {
    console.error("Bags tokens error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch Bags tokens";
    return Response.json({ error: message }, { status: 500 });
  }
}
