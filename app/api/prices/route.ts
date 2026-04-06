import { getPrices } from "@/lib/jupiter";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mintsParam = searchParams.get("mints");

  if (!mintsParam) {
    return Response.json({ error: "Missing mints parameter" }, { status: 400 });
  }

  const mints = mintsParam
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  if (mints.length === 0) {
    return Response.json({ error: "No valid mints provided" }, { status: 400 });
  }

  try {
    const prices = await getPrices(mints);
    return Response.json(prices);
  } catch (err) {
    console.error("Price fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch prices";
    return Response.json({ error: message }, { status: 500 });
  }
}
