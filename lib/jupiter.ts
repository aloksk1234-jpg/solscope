const JUPITER_PRICE_API = "https://api.jup.ag/price/v2";
const BATCH_SIZE = 50;

export async function getPrices(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {};

  const priceMap: Record<string, number> = {};

  // Batch into groups of BATCH_SIZE
  for (let i = 0; i < mints.length; i += BATCH_SIZE) {
    const batch = mints.slice(i, i + BATCH_SIZE);
    const ids = batch.join(",");

    try {
      const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.warn(`Jupiter price API batch ${i} failed: ${response.status}`);
        continue;
      }

      const json = await response.json();

      // Response format: { data: { [mint]: { id, mintSymbol, vsToken, vsTokenSymbol, price } } }
      if (json?.data) {
        for (const [mint, info] of Object.entries(json.data)) {
          const priceInfo = info as { price?: string | number };
          if (priceInfo?.price != null) {
            const price = typeof priceInfo.price === "string"
              ? parseFloat(priceInfo.price)
              : priceInfo.price;
            if (!isNaN(price)) {
              priceMap[mint] = price;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Jupiter price API batch ${i} error:`, err);
    }
  }

  return priceMap;
}
