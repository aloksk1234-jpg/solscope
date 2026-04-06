"use client";

import { motion } from "framer-motion";
import type { Portfolio, HealthScore } from "@/types";
import { formatUSD, formatNumber } from "@/lib/utils";
import DonutChart from "./donut-chart";

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  healthScore: HealthScore;
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
  index?: number;
}

function StatCard({ label, value, sub, accentColor, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.07 }}
      className="rounded-2xl border p-4 flex flex-col gap-1"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Accent bar */}
      <div
        className="w-10 h-1 rounded-full mb-2"
        style={{ background: accentColor ?? "var(--sol-purple)" }}
      />
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
      <p className="text-xl font-black" style={{ color: accentColor ?? "var(--foreground)" }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export default function PortfolioSummary({ portfolio, healthScore }: PortfolioSummaryProps) {
  const { solBalance, totalUsdValue, tokens, nfts, solUsdValue } = portfolio;
  const gradeColor =
    healthScore.total >= 80 ? "var(--positive)" : healthScore.total >= 60 ? "#FAC238" : "var(--negative)";

  return (
    <div className="space-y-4">
      {/* Hero stat card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border p-6"
        style={{ background: "var(--gradient-card)", borderColor: "rgba(153,69,255,0.2)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
          Total Portfolio Value
        </p>
        <p className="text-5xl font-black mt-2" style={{ color: "var(--foreground)" }}>
          {formatUSD(totalUsdValue)}
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="SOL Balance"
          value={`${formatNumber(solBalance)} SOL`}
          sub={formatUSD(solUsdValue)}
          accentColor="#9945FF"
          index={0}
        />
        <StatCard
          label="Tokens"
          value={String(tokens.length)}
          sub={`${tokens.filter((t) => (t.usdValue ?? 0) > 1).length} with value`}
          accentColor="#6190FA"
          index={1}
        />
        <StatCard
          label="NFTs"
          value={String(nfts.length)}
          sub={
            nfts.length > 0
              ? `in ${new Set(nfts.map((n) => n.collectionMint).filter(Boolean)).size} collections`
              : "None found"
          }
          accentColor="#00D9BB"
          index={2}
        />
        <StatCard
          label="Health Score"
          value={`${healthScore.total}/100`}
          sub={`Grade: ${healthScore.grade}`}
          accentColor={gradeColor}
          index={3}
        />
      </div>

      {/* Donut chart */}
      <DonutChart breakdown={portfolio.breakdown} totalUsdValue={totalUsdValue} />
    </div>
  );
}
