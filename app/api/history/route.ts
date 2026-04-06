import { getWalletTransactions } from "@/lib/helius-transactions";
import { isValidSolanaAddress } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  if (!address) {
    return Response.json({ error: "Missing address parameter" }, { status: 400 });
  }

  if (!isValidSolanaAddress(address)) {
    return Response.json({ error: "Invalid Solana address" }, { status: 400 });
  }

  try {
    const transactions = await getWalletTransactions(address, Math.min(limit, 100));
    return Response.json(transactions);
  } catch (err) {
    console.error("Transaction history fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch transaction history";
    return Response.json({ error: message }, { status: 500 });
  }
}
