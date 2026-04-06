"use client";

import type { EnhancedTransaction } from "@/lib/helius-transactions";

interface TransactionTimelineProps {
  transactions: EnhancedTransaction[];
}

const TYPE_COLORS: Record<string, string> = {
  SWAP: "#3B82F6",
  TRANSFER: "#94a3b8",
  NFT_SALE: "#F59E0B",
  NFT_BID: "#F59E0B",
  NFT_LISTING: "#F59E0B",
  STAKE: "#00D4AA",
  UNSTAKE: "#00D4AA",
  UNKNOWN: "#4a6080",
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.UNKNOWN;
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFee(lamports: number): string {
  return (lamports / 1_000_000_000).toFixed(5);
}

function getDateLabel(ts: number): string {
  const date = new Date(ts * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (txDate.getTime() === today.getTime()) return "Today";
  if (txDate.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Group transactions by date
function groupByDate(transactions: EnhancedTransaction[]): Map<string, EnhancedTransaction[]> {
  const groups = new Map<string, EnhancedTransaction[]>();
  for (const tx of transactions) {
    const label = getDateLabel(tx.timestamp);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(tx);
  }
  return groups;
}

function truncateSig(sig: string): string {
  return `${sig.slice(0, 8)}...${sig.slice(-6)}`;
}

export default function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  if (transactions.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          No transactions found for this wallet.
        </p>
      </div>
    );
  }

  const groups = groupByDate(transactions);

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([dateLabel, txs]) => (
        <div key={dateLabel}>
          {/* Date label */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              {dateLabel}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--card-border)" }}
            />
          </div>

          {/* Transactions */}
          <div className="space-y-2">
            {txs.map((tx) => {
              const typeColor = getTypeColor(tx.type);

              return (
                <div
                  key={tx.signature}
                  className="rounded-xl border p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
                  style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: typeColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: `${typeColor}20`,
                            color: typeColor,
                          }}
                        >
                          {tx.type}
                        </span>
                        {tx.source && tx.source !== "UNKNOWN" && (
                          <span
                            className="text-xs"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            via {tx.source}
                          </span>
                        )}
                      </div>
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                      >
                        {formatTimestamp(tx.timestamp)}
                      </span>
                    </div>

                    {tx.description && tx.description !== tx.type && (
                      <p
                        className="text-sm mt-1 line-clamp-2"
                        style={{ color: "var(--foreground)" }}
                      >
                        {tx.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2">
                      <a
                        href={`https://solscan.io/tx/${tx.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                      >
                        {truncateSig(tx.signature)}
                      </a>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Fee: {formatFee(tx.fee)} SOL
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
