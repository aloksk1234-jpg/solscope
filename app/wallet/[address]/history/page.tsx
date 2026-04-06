import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWalletTransactions } from "@/lib/helius-transactions";
import { isValidSolanaAddress } from "@/lib/utils";
import WalletHeader from "@/components/wallet-header";
import TransactionTimeline from "@/components/transaction-timeline";
import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr =
    address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  return {
    title: `History · ${shortAddr} · SolScope`,
    description: `Transaction history for Solana wallet ${shortAddr}`,
  };
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  if (!isValidSolanaAddress(address)) {
    notFound();
  }

  let transactions;
  let domain: string | undefined;
  let fetchError: string | null = null;

  try {
    // Fetch transactions and domain in parallel; domain requires portfolio fetch
    const [txResult, dasResponse] = await Promise.allSettled([
      getWalletTransactions(address, 50),
      getAssetsByOwner(address),
    ]);

    if (txResult.status === "fulfilled") {
      transactions = txResult.value;
    } else {
      fetchError = txResult.reason instanceof Error
        ? txResult.reason.message
        : "Failed to fetch transactions";
    }

    if (dasResponse.status === "fulfilled") {
      // Attempt to resolve domain from portfolio
      try {
        const prices = await getPrices([]);
        const portfolio = analyzePortfolio(address, dasResponse.value, prices);
        domain = portfolio.domain;
      } catch {
        // domain is optional, ignore
      }
    }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to fetch transaction history";
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
          <WalletHeader address={address} domain={domain} />
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
              const isActive = tab.label === "History";
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
            Transaction History
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Last 50 transactions, powered by Helius Enhanced Transactions API.
          </p>
        </div>

        {fetchError ? (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Failed to load transactions
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {fetchError}
            </p>
          </div>
        ) : (
          <TransactionTimeline transactions={transactions ?? []} />
        )}
      </div>
    </main>
  );
}
