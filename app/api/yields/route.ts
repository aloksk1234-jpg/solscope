import { fetchSolanaYields } from "@/lib/defillama";

export async function GET() {
  try {
    const pools = await fetchSolanaYields();
    return Response.json(pools);
  } catch (err) {
    console.error("Yields fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch yield data";
    return Response.json({ error: message }, { status: 500 });
  }
}
