"use client";

import type { HealthScore } from "@/types";
import { Lightbulb } from "lucide-react";

interface HealthScoreProps {
  score: HealthScore;
}

function ScoreGauge({ total, grade }: { total: number; grade: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (total / 100) * circumference;

  const color =
    total >= 80 ? "var(--positive)" : total >= 60 ? "#F59E0B" : "var(--negative)";

  return (
    <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--card-border)"
          strokeWidth="10"
        />
        {/* Score arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>
          {total}
        </span>
        <span className="text-xl font-bold" style={{ color }}>
          {grade}
        </span>
        <span className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = (value / max) * 100;
  const color =
    pct >= 75 ? "var(--positive)" : pct >= 40 ? "#F59E0B" : "var(--negative)";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
        <span className="font-mono font-medium" style={{ color }}>
          {value}/{max}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--card-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function HealthScoreCard({ score }: HealthScoreProps) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-6"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
        Wallet Health Score
      </h3>

      <ScoreGauge total={score.total} grade={score.grade} />

      {/* Breakdown */}
      <div className="space-y-3">
        <BreakdownBar label="Diversification" value={score.breakdown.diversification} max={30} />
        <BreakdownBar label="Risk Exposure" value={score.breakdown.riskExposure} max={25} />
        <BreakdownBar label="DeFi Utilization" value={score.breakdown.defiUtilization} max={20} />
        <BreakdownBar label="Stablecoin Ratio" value={score.breakdown.stablecoinRatio} max={15} />
        <BreakdownBar label="NFT Quality" value={score.breakdown.nftQuality} max={10} />
      </div>

      {/* Tips */}
      {score.tips.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
            Improvement Tips
          </p>
          <ul className="space-y-2">
            {score.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Lightbulb
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  style={{ color: "#F59E0B" }}
                />
                <span style={{ color: "var(--muted-foreground)" }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
