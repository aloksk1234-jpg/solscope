"use client";

import type { DeFiPosition } from "@/lib/defi-positions";
import { ExternalLink } from "lucide-react";

interface DeFiPositionsProps {
  positions: DeFiPosition[];
}

const TYPE_LABELS: Record<string, string> = {
  "liquid-staking": "Liquid Staking",
  lending: "Lending",
  lp: "LP",
  farming: "Farming",
};

const TYPE_COLORS: Record<string, string> = {
  "liquid-staking": "#00d4aa",
  lending: "#3B82F6",
  lp: "#F59E0B",
  farming: "#EC4899",
};

function ProtocolInitial({ name }: { name: string }) {
  const colors = ["#9945FF", "#00D4AA", "#3B82F6", "#F59E0B", "#EC4899", "#06B6D4"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: colors[idx],
        color: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "700",
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function DeFiPositions({ positions }: DeFiPositionsProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--card-border)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          DeFi Positions
        </h3>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {positions.length} detected
        </span>
      </div>

      {positions.length === 0 ? (
        <div className="p-8 text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ background: "rgba(148,163,184,0.1)" }}
          >
            <span style={{ fontSize: "20px" }}>🏦</span>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
            No active DeFi positions detected
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Liquid staking, lending deposits, and LP tokens will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
          {positions.map((position) => {
            const typeColor = TYPE_COLORS[position.type] ?? "#94a3b8";
            const typeLabel = TYPE_LABELS[position.type] ?? position.type;

            return (
              <div
                key={`${position.protocol}-${position.tokenMint}`}
                className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <ProtocolInitial name={position.protocol} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {position.protocol}
                    </p>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${typeColor}18`,
                        color: typeColor,
                      }}
                    >
                      {typeLabel}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {position.description} · {position.tokenSymbol}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-mono)" }}
                  >
                    {position.usdValue > 0
                      ? `$${position.usdValue.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}`
                      : "—"}
                  </p>
                  {position.apy != null && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                      ~{position.apy.toFixed(1)}% APY
                    </p>
                  )}
                </div>

                <a
                  href={position.protocolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 transition-opacity hover:opacity-70"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
