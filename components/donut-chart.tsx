"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatUSD } from "@/lib/utils";

interface DonutChartProps {
  breakdown: {
    sol: number;
    stablecoins: number;
    defiTokens: number;
    nfts: number;
    other: number;
  };
  totalUsdValue: number;
}

const SEGMENTS = [
  { key: "sol", label: "SOL", color: "#9945FF" },
  { key: "stablecoins", label: "Stablecoins", color: "#00D4AA" },
  { key: "defiTokens", label: "DeFi / LSTs", color: "#3B82F6" },
  { key: "nfts", label: "NFTs", color: "#F59E0B" },
  { key: "other", label: "Other Tokens", color: "#64748B" },
] as const;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  return (
    <div
      className="px-3 py-2 rounded-lg text-sm border"
      style={{
        background: "#0d1526",
        borderColor: "#1e2d4a",
        color: "#e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: item.payload.color }}
        />
        <span style={{ color: "#94a3b8" }}>{item.name}</span>
      </div>
      <div className="mt-0.5 font-semibold" style={{ color: item.payload.color }}>
        {formatUSD(item.value)}
      </div>
    </div>
  );
}

export default function DonutChart({ breakdown, totalUsdValue }: DonutChartProps) {
  const data = SEGMENTS.map((seg) => ({
    name: seg.label,
    value: breakdown[seg.key],
    color: seg.color,
  })).filter((d) => d.value > 0);

  if (data.length === 0 || totalUsdValue === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl h-64 border"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <p style={{ color: "var(--muted-foreground)" }}>No portfolio data</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--muted-foreground)" }}>
        Portfolio Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry) => {
              const item = entry as { payload?: { value?: number; color?: string } };
              const pct =
                totalUsdValue > 0
                  ? (((item.payload?.value ?? 0) / totalUsdValue) * 100).toFixed(1)
                  : "0.0";
              return (
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                  {value}{" "}
                  <span style={{ color: item.payload?.color ?? "#fff" }}>{pct}%</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category list */}
      <div className="mt-2 space-y-2">
        {data.map((item) => {
          const pct = totalUsdValue > 0 ? (item.value / totalUsdValue) * 100 : 0;
          return (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: item.color }}
              />
              <span className="flex-1" style={{ color: "var(--muted-foreground)" }}>
                {item.name}
              </span>
              <span className="font-mono text-xs" style={{ color: item.color }}>
                {pct.toFixed(1)}%
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--foreground)" }}>
                {formatUSD(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
