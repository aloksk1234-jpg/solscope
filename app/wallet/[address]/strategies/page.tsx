import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";
import { fetchSolanaYields, fetchProtocolInfo } from "@/lib/defillama";
import { getStrategyRecommendations } from "@/lib/strategy-engine";
import { isValidSolanaAddress } from "@/lib/utils";
import WalletHeader from "@/components/wallet-header";
import StrategyTabs from "@/components/strategy-tabs";

export async function generateMetadata({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const shortAddr = address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  return {
    title: `DeFi Strategies · ${shortAddr} · SolScope`,
    description: `Personalized DeFi yield strategies for Solana wallet ${shortAddr}`,
  };
}

export default async function StrategiesPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;

  if (!isValidSolanaAddress(address)) {
    notFound();
  }

  // Fetch portfolio and yields in parallel
  let strategies;
  let fetchError: string | null = null;
  let portfolio;

  try {
    const [dasResponse, yields, protocolInfo] = await Promise.all([
      getAssetsByOwner(address),
      fetchSolanaYields(),
      fetchProtocolInfo(),
    ]);

    const mintAddresses = dasResponse.items
      .filter((item) => item.interface === "FungibleToken" || item.interface === "FungibleAsset")
      .map((item) => item.id);

    const prices = await getPrices(mintAddresses);
    portfolio = analyzePortfolio(address, dasResponse, prices);
    strategies = getStrategyRecommendations(portfolio, yields, protocolInfo);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to fetch data";
  }

  if (fetchError || !strategies || !portfolio) {
    return (
      <main className="min-h-screen" style={{ background: "var(--background)" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link
            href={`/wallet/${address}`}
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Failed to load strategies
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {fetchError ?? "Unknown error"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalStrategies = Object.values(strategies).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="border-b sticky top-0 z-10 backdrop-blur-sm"
        style={{
          borderColor: "var(--card-border)",
          background: "rgba(15,15,23,0.92)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            href={`/wallet/${address}`}
            className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Portfolio
          </Link>
          <WalletHeader address={address} domain={portfolio.domain} />
        </div>
        {/* Nav tabs */}
        <div
          className="max-w-5xl mx-auto px-4 overflow-x-auto"
          style={{ borderTop: "1px solid var(--card-border)" }}
        >
          <div className="flex gap-0 min-w-max">
            {[
              { label: "Portfolio", href: `/wallet/${address}` },
              { label: "History", href: `/wallet/${address}/history` },
              { label: "Simulate", href: `/wallet/${address}/simulate` },
              { label: "Strategies", href: `/wallet/${address}/strategies` },
              { label: "Airdrops", href: `/wallet/${address}/airdrops` },
            ].map((tab) => {
              const isActive = tab.label === "Strategies";
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className="px-5 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    borderBottomColor: isActive ? "var(--sol-purple)" : "transparent",
                    color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            DeFi Strategy Recommendations
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {totalStrategies} strategies found across 4 risk tiers, matched to your portfolio.
            Live data from{" "}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              DefiLlama
            </a>
            .
          </p>
        </div>

        {/* Portfolio context */}
        <div
          className="rounded-xl border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          {[
            {
              label: "SOL",
              value: `${portfolio.solBalance.toFixed(2)} SOL`,
              color: "#9945FF",
            },
            {
              label: "Stablecoins",
              value: `$${portfolio.breakdown.stablecoins.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
              color: "#00D4AA",
            },
            {
              label: "DeFi / LSTs",
              value: `$${portfolio.breakdown.defiTokens.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
              color: "#3B82F6",
            },
            {
              label: "NFTs",
              value: `${portfolio.nfts.length} items`,
              color: "#F59E0B",
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {item.label}
              </p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="text-xs rounded-lg px-4 py-3 border"
          style={{
            background: "rgba(244,63,94,0.06)",
            borderColor: "rgba(244,63,94,0.2)",
            color: "var(--muted-foreground)",
          }}
        >
          ⚠️ Not financial advice. DeFi carries smart contract and market risks. Always DYOR and
          only invest what you can afford to lose.
        </div>

        {/* Strategy tabs */}
        <StrategyTabs strategies={strategies} />
      </div>
    </main>
  );
}
