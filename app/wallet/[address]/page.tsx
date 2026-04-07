import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAssetsByOwner } from "@/lib/helius";
import { getPrices } from "@/lib/jupiter";
import { analyzePortfolio } from "@/lib/portfolio-analyzer";
import { calculateHealthScore } from "@/lib/health-score";
import { resolveDomain } from "@/lib/sns";
import { isValidSolanaAddress, isSolDomain } from "@/lib/utils";
import { detectDeFiPositions } from "@/lib/defi-positions";
import WalletHeader from "@/components/wallet-header";
import PortfolioSummary from "@/components/portfolio-summary";
import TokenTable from "@/components/token-table";
import NFTGrid from "@/components/nft-grid";
import HealthScoreCard from "@/components/health-score";
import BagsTokensSection from "@/components/bags-tokens-section";
import DeFiPositions from "@/components/defi-positions";
import ShareButton from "@/components/share-button";

// Memoized fetch so generateMetadata + page share one request
const fetchPortfolio = cache(async (address: string) => {
  const dasResponse = await getAssetsByOwner(address);
  const mintAddresses = dasResponse.items
    .filter(
      (item) => item.interface === "FungibleToken" || item.interface === "FungibleAsset"
    )
    .map((item) => item.id);
  const prices = await getPrices(mintAddresses);
  return analyzePortfolio(address, dasResponse, prices);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr =
    address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

  try {
    const portfolio = await fetchPortfolio(address);
    const healthScore = calculateHealthScore(portfolio);
    const total = portfolio.totalUsdValue;
    const tokenCount = portfolio.tokens.length;
    const nftCount = portfolio.nfts.length;
    const grade = healthScore.grade;

    const ogParams = new URLSearchParams({
      address,
      total: total.toFixed(2),
      sol: portfolio.solBalance.toFixed(4),
      tokens: tokenCount.toString(),
      nfts: nftCount.toString(),
      grade,
    });

    return {
      title: `${shortAddr} · SolScope`,
      description: `Portfolio: $${total.toFixed(0)} · ${tokenCount} tokens · ${nftCount} NFTs · Health: ${grade}`,
      openGraph: {
        title: `${shortAddr} · SolScope`,
        description: `Portfolio: $${total.toFixed(0)} · ${tokenCount} tokens · ${nftCount} NFTs · Health: ${grade}`,
        images: [`/api/og?${ogParams}`],
      },
      twitter: {
        card: "summary_large_image",
        title: `${shortAddr} · SolScope`,
        description: `Portfolio: $${total.toFixed(0)} · ${tokenCount} tokens · ${nftCount} NFTs · Health: ${grade}`,
        images: [`/api/og?${ogParams}`],
      },
    };
  } catch {
    return {
      title: `${shortAddr} · SolScope`,
      description: `Solana wallet analysis and DeFi strategy recommendations for ${shortAddr}`,
    };
  }
}

const NAV_TABS = (address: string) => [
  { label: "Portfolio", href: `/wallet/${address}` },
  { label: "History", href: `/wallet/${address}/history` },
  { label: "Simulate", href: `/wallet/${address}/simulate` },
  { label: "Strategies", href: `/wallet/${address}/strategies` },
  { label: "Airdrops", href: `/wallet/${address}/airdrops` },
];

export default async function WalletPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  // If it's a .sol domain, resolve and redirect
  if (isSolDomain(address)) {
    const resolved = await resolveDomain(address);
    if (!resolved) notFound();
    redirect(`/wallet/${resolved}`);
  }

  if (!isValidSolanaAddress(address)) {
    notFound();
  }

  let portfolio;
  let fetchError: string | null = null;

  try {
    portfolio = await fetchPortfolio(address);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to fetch wallet data";
  }

  if (fetchError || !portfolio) {
    return (
      <main className="min-h-screen" style={{ background: "var(--background)" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Failed to load wallet
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              {fetchError ?? "Unknown error"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--accent)", color: "#0a0f1e" }}
            >
              Try another wallet
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const healthScore = calculateHealthScore(portfolio);
  const defiPositions = detectDeFiPositions(portfolio.tokens);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="border-b sticky top-0 z-10 backdrop-blur-md"
        style={{
          borderColor: "var(--card-border)",
          background: "rgba(15,15,23,0.92)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 flex-shrink-0"
              style={{ color: "var(--muted-foreground)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline gradient-text font-black">SolScope</span>
            </Link>
            <WalletHeader address={address} domain={portfolio.domain} />
          </div>
          <ShareButton
            address={address}
            totalUsdValue={portfolio.totalUsdValue}
            solBalance={portfolio.solBalance}
            tokenCount={portfolio.tokens.length}
            nftCount={portfolio.nfts.length}
            healthGrade={healthScore.grade}
          />
        </div>

        {/* Nav tabs */}
        <div
          className="max-w-6xl mx-auto px-4 overflow-x-auto"
          style={{ borderTop: "1px solid var(--card-border)" }}
        >
          <div className="flex gap-0 min-w-max">
            {NAV_TABS(address).map((tab) => {
              const isActive = tab.label === "Portfolio";
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
        {/* Main grid: portfolio summary + health score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioSummary portfolio={portfolio} healthScore={healthScore} />
          </div>
          <div className="lg:col-span-1">
            <HealthScoreCard score={healthScore} />
          </div>
        </div>

        {/* Token table */}
        <TokenTable tokens={portfolio.tokens} />

        {/* Strategies CTA */}
        <Link
          href={`/wallet/${address}/strategies`}
          className="block rounded-2xl border overflow-hidden group transition-all duration-300 hover:border-[var(--sol-purple)] hover:shadow-[0_8px_32px_rgba(153,69,255,0.15)]"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="p-5 flex items-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#9945FF22,#14F19522)" }}
            >
              💰
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                DeFi Strategy Recommendations
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Personalized yield strategies based on your portfolio — live APY data from DefiLlama.
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all group-hover:opacity-90"
              style={{ background: "var(--gradient-sol)", color: "#0F0F17" }}
            >
              View Strategies →
            </div>
          </div>
        </Link>

        {/* DeFi Positions — between token table and NFT grid */}
        <DeFiPositions positions={defiPositions} />

        {/* NFT grid */}
        <NFTGrid nfts={portfolio.nfts} address={address} />

        {/* Bags Tokens — client component, fetches lazily */}
        <BagsTokensSection
          walletAddress={address}
          tokens={portfolio.tokens}
          solPrice={portfolio.solUsdValue / (portfolio.solBalance || 1)}
        />
      </div>
    </main>
  );
}
