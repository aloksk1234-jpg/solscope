"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Strategy, RiskTier } from "@/types";
import StrategyCard from "./strategy-card";

interface StrategyTabsProps {
  strategies: Record<RiskTier, Strategy[]>;
}

const TABS: Array<{
  id: RiskTier;
  label: string;
  icon: string;
  apyRange: string;
  color: string;
  activeBg: string;
}> = [
  { id: "conservative", label: "Conservative", icon: "🛡️", apyRange: "3–8%",  color: "#00D9BB", activeBg: "rgba(0,217,187,0.08)" },
  { id: "moderate",     label: "Moderate",     icon: "⚖️", apyRange: "8–15%", color: "#6190FA", activeBg: "rgba(97,144,250,0.08)" },
  { id: "growth",       label: "Growth",       icon: "📈", apyRange: "15–30%",color: "#FAC238", activeBg: "rgba(250,194,56,0.08)" },
  { id: "aggressive",   label: "Aggressive",   icon: "🔥", apyRange: "30%+",  color: "#FA6666", activeBg: "rgba(250,102,102,0.08)" },
];

const DESCRIPTIONS: Record<RiskTier, string> = {
  conservative: "Safe, battle-tested strategies with audited protocols. Ideal for capital preservation with modest yield.",
  moderate: "Balanced strategies using liquid staking and established lending protocols. Good risk/reward ratio.",
  growth: "Higher yield opportunities via concentrated liquidity and DeFi vaults. Requires active monitoring.",
  aggressive: "Maximum yield strategies. Higher risk of impermanent loss, liquidation, or smart contract exploits.",
};

export default function StrategyTabs({ strategies }: StrategyTabsProps) {
  const [active, setActive] = useState<RiskTier>("conservative");
  const activeStrategies = strategies[active] ?? [];
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="space-y-5">
      {/* ── Risk tier pill tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = strategies[tab.id]?.length ?? 0;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
              style={{
                background: isActive ? tab.activeBg : "var(--card)",
                borderColor: isActive ? tab.color : "var(--card-border)",
                color: isActive ? tab.color : "var(--muted-foreground)",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-xs opacity-70">({tab.apyRange})</span>
              {count > 0 && (
                <span
                  className="text-xs rounded-full px-1.5 py-0.5 font-bold"
                  style={{
                    background: isActive ? `${tab.color}25` : "var(--card-border)",
                    color: isActive ? tab.color : "var(--muted-foreground)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Description ── */}
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        {DESCRIPTIONS[active]}
      </p>

      {/* ── Strategy grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeStrategies.length === 0 ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <p style={{ color: "var(--muted-foreground)" }}>
                No {activeTab.label.toLowerCase()} strategies found in the current yield data.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeStrategies.map((strategy, i) => (
                <StrategyCard key={strategy.id} strategy={strategy} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
