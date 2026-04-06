import type { BagsWalletToken } from "@/types/bags";
import { formatUSD, shortenAddress } from "@/lib/utils";
import { Coins, TrendingUp, Users } from "lucide-react";

interface CreatorEarningsProps {
  tokens: BagsWalletToken[];
  solPrice: number;
}

function StatPill({
  label,
  value,
  icon,
  color = "var(--accent)",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </p>
        <p className="font-bold text-base" style={{ color: "var(--foreground)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CreatorEarnings({ tokens, solPrice }: CreatorEarningsProps) {
  const creatorTokens = tokens.filter((t) => t.isCreator && t.lifetimeFees);

  if (creatorTokens.length === 0) return null;

  const totalFeesSOL = creatorTokens.reduce(
    (sum, t) => sum + (t.lifetimeFees?.feesSOL ?? 0),
    0
  );
  const totalFeesUSD = totalFeesSOL * solPrice;

  const totalClaimed = creatorTokens.reduce((sum, t) => {
    const creatorClaim = t.claimStats?.find((s) => s.isCreator);
    return sum + (creatorClaim?.totalClaimedSOL ?? 0);
  }, 0);

  const totalUnclaimed = totalFeesSOL - totalClaimed;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
          Creator Earnings
        </h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(0,212,170,0.12)", color: "var(--accent)" }}
        >
          {creatorTokens.length} token{creatorTokens.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatPill
          label="Total Lifetime Fees"
          value={formatUSD(totalFeesUSD)}
          icon={<TrendingUp className="w-4 h-4" />}
          color="var(--accent)"
        />
        <StatPill
          label="Already Claimed"
          value={`${totalClaimed.toFixed(4)} SOL`}
          icon={<Coins className="w-4 h-4" />}
          color="#3B82F6"
        />
        <StatPill
          label="Unclaimed Revenue"
          value={`${totalUnclaimed.toFixed(4)} SOL`}
          icon={<Coins className="w-4 h-4" />}
          color={totalUnclaimed > 0 ? "#F59E0B" : "var(--muted-foreground)"}
        />
      </div>

      {/* Per-token breakdown */}
      <div className="space-y-3">
        {creatorTokens.map((token) => {
          const fees = token.lifetimeFees!;
          const claimers = token.claimStats ?? [];
          const totalClaimers = claimers.length;

          return (
            <div
              key={token.tokenMint}
              className="rounded-xl border overflow-hidden"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              {/* Token header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between gap-4"
                style={{ borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center gap-3">
                  {token.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={token.image}
                      alt={token.symbol || token.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "var(--accent)", color: "#0a0f1e" }}
                    >
                      {(token.symbol || token.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {token.name || token.symbol || shortenAddress(token.tokenMint)}
                    </p>
                    <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                      {shortenAddress(token.tokenMint)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: "var(--accent)" }}>
                    {formatUSD(fees.feesUSD)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {fees.feesSOL.toFixed(4)} SOL lifetime
                  </p>
                </div>
              </div>

              {/* Claim stats */}
              {claimers.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {totalClaimers} fee claimer{totalClaimers !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {claimers.slice(0, 5).map((claimer) => (
                      <div
                        key={claimer.wallet}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <code
                            className="font-mono"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {shortenAddress(claimer.wallet)}
                          </code>
                          {claimer.isCreator && (
                            <span
                              className="px-1.5 py-0.5 rounded text-xs"
                              style={{
                                background: "rgba(0,212,170,0.12)",
                                color: "var(--accent)",
                              }}
                            >
                              creator
                            </span>
                          )}
                        </div>
                        <span className="font-mono" style={{ color: "var(--foreground)" }}>
                          {claimer.totalClaimedSOL.toFixed(4)} SOL
                        </span>
                      </div>
                    ))}
                    {claimers.length > 5 && (
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        +{claimers.length - 5} more claimers
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim CTA */}
      <div
        className="rounded-xl border px-4 py-3 flex items-center justify-between gap-4"
        style={{
          background: "rgba(0,212,170,0.04)",
          borderColor: "rgba(0,212,170,0.2)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Claim your accumulated creator fees on Bags.fm
        </p>
        <a
          href="https://bags.fm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "#0a0f1e" }}
        >
          Claim on Bags →
        </a>
      </div>
    </div>
  );
}
