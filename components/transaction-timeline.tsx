"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, ArrowLeftRight, ArrowUpRight, Image, TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import type { EnhancedTransaction } from "@/lib/helius-transactions";

interface TransactionTimelineProps {
  transactions: EnhancedTransaction[];
}

const TYPE_META: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  SWAP:        { color: "#3B82F6", label: "Swap",        icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
  TRANSFER:    { color: "#94a3b8", label: "Transfer",    icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  NFT_SALE:    { color: "#F59E0B", label: "NFT Sale",    icon: <Image className="w-3.5 h-3.5" /> },
  NFT_BID:     { color: "#F59E0B", label: "NFT Bid",     icon: <Image className="w-3.5 h-3.5" /> },
  NFT_LISTING: { color: "#F59E0B", label: "NFT List",    icon: <Image className="w-3.5 h-3.5" /> },
  STAKE:       { color: "#00D4AA", label: "Stake",       icon: <TrendingUp className="w-3.5 h-3.5" /> },
  UNSTAKE:     { color: "#00D4AA", label: "Unstake",     icon: <TrendingDown className="w-3.5 h-3.5" /> },
  UNKNOWN:     { color: "#4a6080", label: "Unknown",     icon: <HelpCircle className="w-3.5 h-3.5" /> },
};

function getTypeMeta(type: string) {
  return TYPE_META[type] ?? TYPE_META.UNKNOWN;
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

function groupByDate(transactions: EnhancedTransaction[]): Map<string, EnhancedTransaction[]> {
  const groups = new Map<string, EnhancedTransaction[]>();
  for (const tx of transactions) {
    const label = getDateLabel(tx.timestamp);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(tx);
  }
  return groups;
}

function truncateSig(sig: string): string {
  return `${sig.slice(0, 8)}...${sig.slice(-6)}`;
}

// Stats bar
function StatsBar({ transactions }: { transactions: EnhancedTransaction[] }) {
  const counts: Record<string, number> = {};
  for (const tx of transactions) {
    counts[tx.type] = (counts[tx.type] ?? 0) + 1;
  }

  const stats = [
    { label: "Total", value: transactions.length, color: "var(--foreground)" },
    { label: "Swaps", value: counts["SWAP"] ?? 0, color: "#3B82F6" },
    { label: "Transfers", value: counts["TRANSFER"] ?? 0, color: "#94a3b8" },
    { label: "NFT", value: (counts["NFT_SALE"] ?? 0) + (counts["NFT_BID"] ?? 0) + (counts["NFT_LISTING"] ?? 0), color: "#F59E0B" },
    { label: "Staking", value: (counts["STAKE"] ?? 0) + (counts["UNSTAKE"] ?? 0), color: "#00D4AA" },
  ];

  return (
    <div
      className="grid grid-cols-5 gap-2 rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function TxRow({ tx, index }: { tx: EnhancedTransaction; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getTypeMeta(tx.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
      className="rounded-xl border overflow-hidden transition-colors"
      style={{ background: "var(--card)", borderColor: expanded ? meta.color + "44" : "var(--card-border)" }}
    >
      {/* Main row — clickable */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
      >
        {/* Type icon bubble */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${meta.color}18`, color: meta.color }}
        >
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${meta.color}18`, color: meta.color }}
            >
              {meta.label}
            </span>
            {tx.source && tx.source !== "UNKNOWN" && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                via {tx.source}
              </span>
            )}
          </div>
          {tx.description && tx.description !== tx.type && (
            <p className="text-sm mt-0.5 truncate" style={{ color: "var(--foreground)" }}>
              {tx.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
            {formatTimestamp(tx.timestamp)}
          </span>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              color: "var(--muted-foreground)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 py-3 space-y-2 border-t"
              style={{ borderColor: "var(--card-border)", background: "rgba(255,255,255,0.015)" }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Signature</p>
                  <a
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono hover:opacity-70 transition-opacity flex items-center gap-1 mt-0.5"
                    style={{ color: "var(--accent)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {truncateSig(tx.signature)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Fee</p>
                  <p className="font-mono mt-0.5" style={{ color: "var(--foreground)" }}>
                    {formatFee(tx.fee)} SOL
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Time</p>
                  <p className="font-mono mt-0.5" style={{ color: "var(--foreground)" }}>
                    {new Date(tx.timestamp * 1000).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {tx.description && tx.description !== tx.type && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {tx.description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
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
      <StatsBar transactions={transactions} />

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
            <div className="flex-1 h-px" style={{ background: "var(--card-border)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {txs.length} tx{txs.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            {txs.map((tx, i) => (
              <TxRow key={tx.signature} tx={tx} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
