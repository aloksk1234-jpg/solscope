"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TokenHolding } from "@/types";
import { formatUSD, formatNumber } from "@/lib/utils";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";

interface TokenTableProps {
  tokens: TokenHolding[];
}

const INITIAL_SHOW = 20;

function TokenLogo({ token }: { token: TokenHolding }) {
  const [imgError, setImgError] = useState(false);

  if (token.logoURI && !imgError) {
    return (
      <Image
        src={token.logoURI}
        alt={token.symbol}
        width={32}
        height={32}
        className="rounded-full"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  // Fallback: colored circle with first letter
  const colors = ["#9945FF", "#00D4AA", "#3B82F6", "#F59E0B", "#EC4899", "#06B6D4"];
  const colorIndex =
    token.symbol.charCodeAt(0) % colors.length;

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: colors[colorIndex], color: "#0a0f1e" }}
    >
      {token.symbol.charAt(0).toUpperCase()}
    </div>
  );
}

export default function TokenTable({ tokens }: TokenTableProps) {
  const [showAll, setShowAll] = useState(false);

  if (tokens.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <p style={{ color: "var(--muted-foreground)" }}>No tokens found in this wallet.</p>
      </div>
    );
  }

  const displayed = showAll ? tokens : tokens.slice(0, INITIAL_SHOW);
  const hasMore = tokens.length > INITIAL_SHOW;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          Tokens
        </h3>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {tokens.length} tokens
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
              <th
                className="text-left px-4 py-2 text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Token
              </th>
              <th
                className="text-right px-4 py-2 text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Balance
              </th>
              <th
                className="text-right px-4 py-2 text-xs font-medium uppercase tracking-wide hidden sm:table-cell"
                style={{ color: "var(--muted-foreground)" }}
              >
                Price
              </th>
              <th
                className="text-right px-4 py-2 text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Value
              </th>
              <th
                className="text-right px-4 py-2 text-xs font-medium uppercase tracking-wide hidden sm:table-cell"
                style={{ color: "var(--muted-foreground)" }}
              >
                24h
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((token, i) => {
              const change = token.change24h;
              const isPositive = change != null && change >= 0;

              return (
                <motion.tr
                  key={token.mint}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="border-b transition-colors hover:bg-white/[0.03]"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TokenLogo token={token} />
                      <div>
                        <p className="font-medium" style={{ color: "var(--foreground)" }}>
                          {token.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {token.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {formatNumber(token.balance)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs hidden sm:table-cell" style={{ color: "var(--muted-foreground)" }}>
                    {token.priceUsd != null && token.priceUsd > 0
                      ? token.priceUsd < 0.001
                        ? `$${token.priceUsd.toExponential(2)}`
                        : formatUSD(token.priceUsd)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {token.usdValue != null && token.usdValue > 0 ? formatUSD(token.usdValue) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {change != null ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium"
                        style={{ color: isPositive ? "var(--positive)" : "var(--negative)" }}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(change).toFixed(2)}%
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted-foreground)" }}>—</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-3 flex justify-center border-t" style={{ borderColor: "var(--card-border)" }}>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show {tokens.length - INITIAL_SHOW} more tokens
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
