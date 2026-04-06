/**
 * GET /api/bags/fees?tokenMint=MINT&solPrice=150
 *
 * Returns lifetime fees + claim stats for a specific Bags token.
 */
import { getTokenLifetimeFees, getTokenClaimStats } from "@/lib/bags";
import { isValidSolanaAddress } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenMint = searchParams.get("tokenMint");
  const solPrice = parseFloat(searchParams.get("solPrice") ?? "150");

  if (!tokenMint || !isValidSolanaAddress(tokenMint)) {
    return Response.json({ error: "Missing or invalid tokenMint" }, { status: 400 });
  }

  const price = isNaN(solPrice) ? 150 : solPrice;

  try {
    const [lifetimeFees, claimStats] = await Promise.allSettled([
      getTokenLifetimeFees(tokenMint, price),
      getTokenClaimStats(tokenMint),
    ]);

    return Response.json({
      lifetimeFees: lifetimeFees.status === "fulfilled" ? lifetimeFees.value : null,
      claimStats: claimStats.status === "fulfilled" ? claimStats.value : [],
    });
  } catch (err) {
    console.error("Bags fees error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch fee data";
    return Response.json({ error: message }, { status: 500 });
  }
}
