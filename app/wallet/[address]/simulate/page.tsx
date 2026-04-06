import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";
import { isValidSolanaAddress } from "@/lib/utils";
import WalletHeader from "@/components/wallet-header";
import WhatIfSimulator from "@/components/what-if-simulator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr =
    address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  return {
    title: `Yield Simulator · ${shortAddr} · SolScope`,
    description: `Simulate DeFi yield scenarios for Solana wallet ${shortAddr}`,
  };
}

export default async function SimulatePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  if (!isValidSolanaAddress(address)) {
    notFound();
  }

  let portfolio;
  let fetchError: string | null = null;

  try {
    const dasResponse = await getAssetsByOwner(address);
    const mintAddresses = dasResponse.items
      .filter(
        (item) =>
          item.interface === "FungibleToken" || item.interface === "FungibleAsset"
      )
      .map((item) => item.id);
    const prices = await getPrices(mintAddresses);
    portfolio = analyzePortfolio(address, dasResponse, prices);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to fetch wallet data";
  }

  if (fetchError || !portfolio) {
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
              Failed to load wallet
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {fetchError ?? "Unknown error"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="border-b sticky top-0 z-10 backdrop-blur-sm"
        style={{
          borderColor: "var(--card-border)",
          background: "rgba(10,15,30,0.85)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
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
          className="max-w-6xl mx-auto px-4 overflow-x-auto"
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
              const isActive = tab.label === "Simulate";
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className="px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    borderBottomColor: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--muted-foreground)",
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            What If Yield Simulator
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Simulate DeFi yield scenarios with your current holdings and live protocol rates.
          </p>
        </div>

        <WhatIfSimulator portfolio={portfolio} />
      </div>
    </main>
  );
}
