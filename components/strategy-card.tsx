"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Strategy } from "@/types";
import { formatNumber } from "@/lib/utils";
import { ChevronDown, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import BagsTradeButton from "./bags-trade-button";

interface StrategyCardProps {
  strategy: Strategy;
  index?: number;
}

/* ── Protocol slug → bg gradient + dot color ── */
const PROTOCOL_THEME: Record<string, { bg: string; dot: string }> = {
  kamino:   { bg: "linear-gradient(135deg,#0a1628,#0f2440)", dot: "#6190FA" },
  marinade: { bg: "linear-gradient(135deg,#1a0a2e,#2d1b4e)", dot: "#14F195" },
  jito:     { bg: "linear-gradient(135deg,#0a2818,#143d22)", dot: "#00D9BB" },
  orca:     { bg: "linear-gradient(135deg,#2a1a0a,#3d2a14)", dot: "#FAC238" },
  raydium:  { bg: "linear-gradient(135deg,#1a0a2e,#2d1b0e)", dot: "#9945FF" },
  meteora:  { bg: "linear-gradient(135deg,#1a0a2e,#0a1e3d)", dot: "#9945FF" },
  drift:    { bg: "linear-gradient(135deg,#2e0a0a,#4a1414)", dot: "#FA6666" },
  solend:   { bg: "linear-gradient(135deg,#0a1a2e,#1a2e4a)", dot: "#6190FA" },
  mango:    { bg: "linear-gradient(135deg,#2a1a0a,#4a2e0a)", dot: "#FAC238" },
  jupiter:  { bg: "linear-gradient(135deg,#0a1e3d,#0a2818)", dot: "#06B6D4" },
  sanctum:  { bg: "linear-gradient(135deg,#1a0a2e,#2e1a0a)", dot: "#9945FF" },
  blazestake: { bg: "linear-gradient(135deg,#0a2818,#1a3d0a)", dot: "#14F195" },
};

function getProtocolStyle(slug: string) {
  // slug is the exact DeFiLlama project slug e.g. "kamino-lend", "jito-liquid-staking"
  const prefix = slug.toLowerCase().split("-")[0];
  const theme = PROTOCOL_THEME[slug.toLowerCase()] ?? PROTOCOL_THEME[prefix] ?? {
    bg: "linear-gradient(135deg,#141621,#1a1c29)",
    dot: "#9945FF",
  };
  // Fallback logo using the short prefix slug (e.g. "kamino" not "kamino-lend")
  const shortSlug = slug.toLowerCase().split("-")[0];
  return {
    logo: `https://icons.llama.fi/${shortSlug}.jpg`,
    fallback: slug.charAt(0).toUpperCase(),
    ...theme,
  };
}

function ProtocolLogo({ src, fallback, dot }: { src: string; fallback: string; dot: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    // Try .png extension if .jpg failed
    if (imgSrc.endsWith(".jpg")) {
      setImgSrc(imgSrc.replace(".jpg", ".png"));
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black select-none"
        style={{ background: `${dot}22`, color: dot, border: `2px solid ${dot}44` }}
      >
        {fallback}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={fallback}
      className="w-20 h-20 rounded-2xl object-cover"
      style={{ border: "2px solid rgba(255,255,255,0.08)" }}
      onError={handleError}
    />
  );
}

const TIER_COLORS: Record<string, string> = {
  conservative: "#00D9BB",
  moderate: "#6190FA",
  growth: "#FAC238",
  aggressive: "#FA6666",
};

const TIER_LABELS: Record<string, string> = {
  conservative: "Conservative",
  moderate: "Moderate",
  growth: "Growth",
  aggressive: "Aggressive",
};

const TIER_RISK_LABEL: Record<string, string> = {
  conservative: "Low",
  moderate: "Medium",
  growth: "High",
  aggressive: "Very High",
};

export default function StrategyCard({ strategy, index = 0 }: StrategyCardProps) {
  const [open, setOpen] = useState(false);
  const tierColor = TIER_COLORS[strategy.riskTier] ?? "#94a3b8";
  const ps = getProtocolStyle(strategy.protocol);
  // Prefer the per-pool logo from strategy engine (same slug, same CDN), fallback to style-derived
  const logoSrc = strategy.protocolLogoUrl ?? ps.logo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className="rounded-2xl border overflow-hidden card-hover"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* ── Image area ── */}
      <div
        className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{ background: ps.bg }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "var(--gradient-sol)" }}
        />
        <ProtocolLogo src={logoSrc} fallback={ps.fallback} dot={ps.dot} />
        {/* APY badge floating top-right */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-sm font-black"
          style={{ background: "rgba(0,0,0,0.55)", color: tierColor }}
        >
          {strategy.apy.toFixed(1)}%
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {/* Protocol row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ps.dot }} />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted-foreground)" }}
          >
            {strategy.protocol}
          </span>
        </div>

        {/* Title + description */}
        <h3 className="font-bold text-base mb-2" style={{ color: "var(--foreground)" }}>
          {strategy.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
          {strategy.matchReason ?? `Earn yield on your ${strategy.tokens.join(", ")} holdings.`}
        </p>

        {/* Stats row */}
        <div className="flex gap-5 mb-4">
          <div>
            <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--muted)" }}>APY</div>
            <div className="text-xl font-black" style={{ color: tierColor }}>
              {strategy.apy.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--muted)" }}>TVL</div>
            <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              ${formatNumber(strategy.tvlUsd)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--muted)" }}>Risk</div>
            <div className="text-xl font-bold" style={{ color: tierColor }}>
              {TIER_RISK_LABEL[strategy.riskTier]}
            </div>
          </div>
        </div>

        {/* APY breakdown sub-line */}
        {(strategy.apyBase != null || strategy.apyReward != null) && (
          <div className="flex gap-3 mb-4">
            {strategy.apyBase != null && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Base: <span style={{ color: "var(--foreground)" }}>{strategy.apyBase.toFixed(1)}%</span>
              </span>
            )}
            {strategy.apyReward != null && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Rewards: <span style={{ color: "#FAC238" }}>{strategy.apyReward.toFixed(1)}%</span>
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span
            className="px-2 py-0.5 rounded-md text-xs font-semibold"
            style={{ background: `${tierColor}14`, color: tierColor }}
          >
            {TIER_LABELS[strategy.riskTier]}
          </span>
          {strategy.tokens.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md text-xs font-semibold"
              style={{ background: "rgba(153,69,255,0.1)", color: "var(--sol-purple)" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bags trade button */}
        {strategy.primaryTokenMint && (
          <div className="mb-3">
            <BagsTradeButton
              outputMint={strategy.primaryTokenMint}
              outputSymbol={strategy.tokens[0] ?? "token"}
            />
          </div>
        )}

        {/* Start earning CTA */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full py-3 rounded-xl border text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: open ? "var(--gradient-purple-blue)" : "#141621",
            borderColor: open ? "transparent" : "var(--card-border)",
            color: open ? "#0F0F17" : "var(--foreground)",
          }}
        >
          {open ? "Hide details" : "Start Earning →"}
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* ── Expanded details ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
            style={{ borderColor: "var(--card-border)" }}
          >
            <div className="p-5 space-y-4">
              {/* Steps */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  Steps
                </p>
                <ol className="space-y-2">
                  {strategy.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(20,241,149,0.12)", color: "var(--accent)" }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ color: "var(--muted-foreground)" }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Risk factors */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  Risk Factors
                </p>
                <ul className="space-y-1.5">
                  {strategy.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#FAC238" }} />
                      <span style={{ color: "var(--muted-foreground)" }}>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href={strategy.protocolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-sol)", color: "#0F0F17" }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Open on {strategy.protocol}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
