"use client";

import { useState, useEffect, useMemo } from "react";
import type { Portfolio, YieldPool } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WhatIfSimulatorProps {
  portfolio: Portfolio;
}

interface AssetOption {
  id: string;
  label: string;
  symbol: string;
  balance: number;
  usdValue: number;
}

interface YieldOption {
  id: string;
  label: string;
  protocol: string;
  symbol: string;
  apy: number;
  riskTier: string;
}

const RISK_TIERS = ["conservative", "moderate", "growth", "aggressive"];
const TIER_LABELS: Record<string, string> = {
  conservative: "Conservative",
  moderate: "Moderate",
  growth: "Growth",
  aggressive: "Aggressive",
};
const TIER_COLORS: Record<string, string> = {
  conservative: "#00D4AA",
  moderate: "#3B82F6",
  growth: "#F59E0B",
  aggressive: "#f43f5e",
};

function classifyTier(apy: number): string {
  if (apy <= 8) return "conservative";
  if (apy <= 15) return "moderate";
  if (apy <= 30) return "growth";
  return "aggressive";
}

function computeProjection(
  principal: number,
  apyFraction: number,
  months: number,
  compound: boolean
): { month: number; flat: number; withYield: number }[] {
  const data = [];
  for (let m = 0; m <= months; m++) {
    const flat = principal;
    let withYield: number;
    if (compound) {
      // Compound monthly
      withYield = principal * Math.pow(1 + apyFraction / 12, m);
    } else {
      // Simple interest (monthly)
      withYield = principal * (1 + (apyFraction / 12) * m);
    }
    data.push({ month: m, flat: parseFloat(flat.toFixed(2)), withYield: parseFloat(withYield.toFixed(2)) });
  }
  return data;
}

export default function WhatIfSimulator({ portfolio }: WhatIfSimulatorProps) {
  const [yieldPools, setYieldPools] = useState<YieldPool[]>([]);
  const [loadingYields, setLoadingYields] = useState(true);

  // Build asset options
  const assetOptions = useMemo<AssetOption[]>(() => {
    const options: AssetOption[] = [];

    if (portfolio.solBalance > 0) {
      options.push({
        id: "__sol__",
        label: `SOL — ${portfolio.solBalance.toFixed(4)} SOL`,
        symbol: "SOL",
        balance: portfolio.solBalance,
        usdValue: portfolio.solUsdValue,
      });
    }

    for (const token of portfolio.tokens) {
      if ((token.usdValue ?? 0) < 0.5) continue;
      options.push({
        id: token.mint,
        label: `${token.symbol} — ${token.balance.toFixed(4)} (≈$${(token.usdValue ?? 0).toFixed(2)})`,
        symbol: token.symbol,
        balance: token.balance,
        usdValue: token.usdValue ?? 0,
      });
    }

    return options;
  }, [portfolio]);

  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    assetOptions[0]?.id ?? ""
  );
  const [deployAmount, setDeployAmount] = useState<number>(
    assetOptions[0]?.usdValue ?? 0
  );
  const [selectedYieldId, setSelectedYieldId] = useState<string>("");
  const [compoundMode, setCompoundMode] = useState(true);
  const [projectionMonths, setProjectionMonths] = useState(12);

  // Fetch yields on mount
  useEffect(() => {
    setLoadingYields(true);
    fetch("/api/yields")
      .then((r) => r.json())
      .then((data: YieldPool[]) => {
        setYieldPools(Array.isArray(data) ? data : []);
      })
      .catch(() => setYieldPools([]))
      .finally(() => setLoadingYields(false));
  }, []);

  // When asset selection changes, update deploy amount
  useEffect(() => {
    const asset = assetOptions.find((a) => a.id === selectedAssetId);
    if (asset) setDeployAmount(asset.usdValue);
  }, [selectedAssetId, assetOptions]);

  // Build yield options grouped by tier
  const yieldOptions = useMemo<YieldOption[]>(() => {
    return yieldPools
      .filter((p) => p.apy > 0 && p.apy < 500) // filter extreme APYs
      .map((p) => ({
        id: p.pool,
        label: `${p.project} — ${p.symbol} — ${p.apy.toFixed(1)}% APY`,
        protocol: p.project,
        symbol: p.symbol,
        apy: p.apy,
        riskTier: classifyTier(p.apy),
      }))
      .slice(0, 60); // top 60 by TVL
  }, [yieldPools]);

  // Selected yield
  const selectedYield = yieldOptions.find((y) => y.id === selectedYieldId) ?? null;
  const apy = selectedYield?.apy ?? 0;

  // Projection data
  const projectionData = useMemo(
    () =>
      deployAmount > 0 && apy > 0
        ? computeProjection(deployAmount, apy / 100, projectionMonths, compoundMode)
        : [],
    [deployAmount, apy, projectionMonths, compoundMode]
  );

  const earnings =
    projectionData.length > 0
      ? (projectionData[projectionData.length - 1]?.withYield ?? deployAmount) - deployAmount
      : 0;

  const monthlyEarnings = projectionMonths > 0 ? earnings / projectionMonths : 0;

  // Group yields by tier for grouped select
  const tierGroups = RISK_TIERS.map((tier) => ({
    tier,
    label: TIER_LABELS[tier],
    options: yieldOptions.filter((y) => y.riskTier === tier),
  })).filter((g) => g.options.length > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Asset selection */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            1. Select Asset
          </h3>

          <div className="space-y-2">
            {assetOptions.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                No assets found in this wallet.
              </p>
            ) : (
              assetOptions.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg border transition-all text-sm"
                  style={{
                    background:
                      selectedAssetId === asset.id
                        ? "rgba(0,212,170,0.1)"
                        : "rgba(255,255,255,0.02)",
                    borderColor:
                      selectedAssetId === asset.id
                        ? "var(--accent)"
                        : "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>
                    {asset.symbol}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    ${asset.usdValue.toFixed(2)}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Deploy amount input */}
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Amount to deploy (USD)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={deployAmount}
              onChange={(e) => setDeployAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "var(--card-border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>

        {/* Center: Strategy selection */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            2. Choose Strategy
          </h3>

          {loadingYields ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg animate-pulse"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              ))}
            </div>
          ) : (
            <select
              value={selectedYieldId}
              onChange={(e) => setSelectedYieldId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
                color: "var(--foreground)",
              }}
            >
              <option value="" style={{ background: "#0d1526" }}>
                — Select a strategy —
              </option>
              {tierGroups.map((group) => (
                <optgroup
                  key={group.tier}
                  label={`── ${group.label} ──`}
                  style={{ background: "#0d1526", color: TIER_COLORS[group.tier] }}
                >
                  {group.options.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      style={{ background: "#0d1526", color: "#e2e8f0" }}
                    >
                      {opt.protocol} · {opt.symbol} · {opt.apy.toFixed(1)}%
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}

          {selectedYield && (
            <div
              className="rounded-lg p-3 space-y-1"
              style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)" }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                {selectedYield.protocol} — {selectedYield.symbol}
              </p>
              <p className="text-2xl font-black" style={{ color: "var(--accent)" }}>
                {selectedYield.apy.toFixed(1)}% APY
              </p>
              <p className="text-xs capitalize" style={{ color: "var(--muted-foreground)" }}>
                {TIER_LABELS[selectedYield.riskTier]} risk
              </p>
            </div>
          )}

          {/* Compound toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>
              Compound interest
            </span>
            <button
              onClick={() => setCompoundMode((p) => !p)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: compoundMode ? "var(--accent)" : "rgba(148,163,184,0.2)" }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full transition-all"
                style={{
                  background: "#fff",
                  left: compoundMode ? "24px" : "4px",
                }}
              />
            </button>
          </div>

          {/* Projection period slider */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              <span>Projection period</span>
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                {projectionMonths} months
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={projectionMonths}
              onChange={(e) => setProjectionMonths(parseInt(e.target.value, 10))}
              className="w-full"
              style={{ accentColor: "var(--accent)" }}
            />
            <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              <span>1mo</span>
              <span>6mo</span>
              <span>12mo</span>
              <span>24mo</span>
            </div>
          </div>
        </div>

        {/* Right: Projection summary */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            3. Projection
          </h3>

          {!selectedYield || deployAmount <= 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Select an asset and strategy to see your projected earnings.
              </p>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Total earnings",
                    value: `+$${earnings.toFixed(2)}`,
                    color: "var(--accent)",
                  },
                  {
                    label: `Monthly avg`,
                    value: `+$${monthlyEarnings.toFixed(2)}/mo`,
                    color: "#3B82F6",
                  },
                  {
                    label: "Final value",
                    value: `$${(deployAmount + earnings).toFixed(2)}`,
                    color: "var(--foreground)",
                  },
                  {
                    label: "ROI",
                    value: `${deployAmount > 0 ? ((earnings / deployAmount) * 100).toFixed(1) : "0"}%`,
                    color: "var(--accent)",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)" }}
                  >
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {s.label}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{ color: s.color, fontFamily: "var(--font-mono)" }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Monthly breakdown table */}
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      <th
                        className="px-3 py-2 text-left font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Month
                      </th>
                      <th
                        className="px-3 py-2 text-right font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Value
                      </th>
                      <th
                        className="px-3 py-2 text-right font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Earned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 3, 6, 12, projectionMonths]
                      .filter((m, i, arr) => m <= projectionMonths && arr.indexOf(m) === i)
                      .sort((a, b) => a - b)
                      .map((month) => {
                        const d = projectionData[month];
                        if (!d) return null;
                        const earned = d.withYield - deployAmount;
                        return (
                          <tr
                            key={month}
                            className="border-t"
                            style={{ borderColor: "var(--card-border)" }}
                          >
                            <td className="px-3 py-2" style={{ color: "var(--muted-foreground)" }}>
                              Month {month}
                            </td>
                            <td
                              className="px-3 py-2 text-right"
                              style={{ color: "var(--foreground)", fontFamily: "var(--font-mono)" }}
                            >
                              ${d.withYield.toFixed(2)}
                            </td>
                            <td
                              className="px-3 py-2 text-right"
                              style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                            >
                              +${earned.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      {projectionData.length > 1 && (
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>
            Portfolio Growth Projection
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={projectionData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => `M${v}`}
                stroke="#1e2d4a"
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                stroke="#1e2d4a"
              />
              <Tooltip
                contentStyle={{
                  background: "#0d1526",
                  border: "1px solid #1e2d4a",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
                formatter={(value, name) => [
                  typeof value === "number" ? `$${value.toFixed(2)}` : String(value),
                  name === "withYield" ? "With yield" : "No yield",
                ]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend
                formatter={(value) => (value === "withYield" ? "With yield" : "No yield (flat)")}
                wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
              />
              <Line
                type="monotone"
                dataKey="flat"
                stroke="#4a6080"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="withYield"
                stroke="#00d4aa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#00d4aa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
