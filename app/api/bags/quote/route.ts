/**
 * GET /api/bags/quote?inputMint=...&outputMint=...&amount=...&slippageBps=50
 *
 * Proxies a trade quote request to Bags API, keeping the API key server-side.
 * Amount should be in base units (lamports for SOL, smallest unit for tokens).
 */
import { getTradeQuote } from "@/lib/bags";
import { isValidSolanaAddress } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const amount = searchParams.get("amount");
  const slippageBps = searchParams.get("slippageBps");

  if (!inputMint || !isValidSolanaAddress(inputMint)) {
    return Response.json({ error: "Missing or invalid inputMint" }, { status: 400 });
  }
  if (!outputMint || !isValidSolanaAddress(outputMint)) {
    return Response.json({ error: "Missing or invalid outputMint" }, { status: 400 });
  }
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return Response.json({ error: "Missing or invalid amount" }, { status: 400 });
  }

  try {
    const quote = await getTradeQuote({
      inputMint,
      outputMint,
      amount,
      slippageBps: slippageBps ? parseInt(slippageBps, 10) : 50,
    });

    return Response.json(quote);
  } catch (err) {
    console.error("Bags quote error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch trade quote";
    return Response.json({ error: message }, { status: 500 });
  }
}
