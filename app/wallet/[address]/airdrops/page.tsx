import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";
import { isValidSolanaAddress } from "@/lib/utils";
import { AIRDROP_LIST } from "@/lib/airdrops";
import WalletHeader from "@/components/wallet-header";
import AirdropCard from "@/components/airdrop-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr =
    address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  return {
    title: `Airdrop Eligibility · ${shortAddr} · SolScope`,
    description: `Check airdrop eligibility for Solana wallet ${shortAddr}`,
  };
}

export default async function AirdropsPage({
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

  // Evaluate all check() functions server-side — functions can't be serialized to Client Components
  const airdropsWithEligibility = AIRDROP_LIST.map((airdrop) => {
    const evaluatedCriteria = airdrop.criteria.map((c) => ({
      id: c.id,
      label: c.label,
      description: c.description,
      met: c.check(portfolio!),
    }));
    const metCount = evaluatedCriteria.filter((c) => c.met).length;
    const serializableAirdrop = {
      id: airdrop.id,
      project: airdrop.project,
      logoColor: airdrop.logoColor,
      logoUrl: airdrop.logoUrl,
      description: airdrop.description,
      status: airdrop.status,
      estimatedDate: airdrop.estimatedDate,
      link: airdrop.link,
    };
    return { airdrop: serializableAirdrop, evaluatedCriteria, metCount, totalCount: evaluatedCriteria.length };
  }).sort((a, b) => b.metCount / b.totalCount - a.metCount / a.totalCount);

  const fullyEligible = airdropsWithEligibility.filter(
    (a) => a.metCount === a.totalCount
  ).length;

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
              const isActive = tab.label === "Airdrops";
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

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Airdrop Eligibility
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              Checking {AIRDROP_LIST.length} Solana ecosystem airdrops based on your current holdings.
            </p>
          </div>
          {fullyEligible > 0 && (
            <div
              className="px-4 py-2 rounded-xl border text-center"
              style={{
                background: "rgba(0,212,170,0.08)",
                borderColor: "rgba(0,212,170,0.25)",
              }}
            >
              <p className="text-xl font-black" style={{ color: "var(--accent)" }}>
                {fullyEligible}
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                fully eligible
              </p>
            </div>
          )}
        </div>

        <div
          className="text-xs rounded-lg px-4 py-3 border"
          style={{
            background: "rgba(244,63,94,0.06)",
            borderColor: "rgba(244,63,94,0.2)",
            color: "var(--muted-foreground)",
          }}
        >
          Airdrop eligibility is estimated based on on-chain data and known criteria. Final
          eligibility is determined by each project. Always verify with official sources.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {airdropsWithEligibility.map(({ airdrop, evaluatedCriteria }, i) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} evaluatedCriteria={evaluatedCriteria} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
