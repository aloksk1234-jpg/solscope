"use client";

import { useState, useEffect } from "react";
import type { BagsWalletToken } from "@/types/bags";
import type { TokenHolding } from "@/types";
import { shortenAddress, formatUSD } from "@/lib/utils";
import CreatorEarnings from "./creator-earnings";
import { ExternalLink, Loader2, Zap } from "lucide-react";

interface BagsTokensSectionProps {
  walletAddress: string;
  tokens: TokenHolding[]; // from portfolio
  solPrice: number;
}

function BagsTokenCard({ token, solPrice }: { token: BagsWalletToken; solPrice: number }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Logo */}
        {token.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={token.image}
            alt={token.symbol || token.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "rgba(0,212,170,0.15)", color: "var(--accent)" }}
          >
            {(token.symbol || token.name || "?").charAt(0).toUpperCase()}
          </div>
        )}

        {/* Token info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  {token.name || token.symbol || shortenAddress(token.tokenMint)}
                </p>
                {token.symbol && token.name && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ background: "var(--card-border)", color: "var(--muted-foreground)" }}
                  >
                    {token.symbol}
                  </span>
                )}
                {token.isCreator && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: "rgba(0,212,170,0.15)",
                      color: "var(--accent)",
                    }}
                  >
                    Creator
                  </span>
                )}
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {shortenAddress(token.tokenMint, 6)}
              </p>
            </div>

            {/* Lifetime fees */}
            {token.lifetimeFees && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Lifetime fees
                </p>
                <p className="font-bold text-sm" style={{ color: "var(--accent)" }}>
                  {formatUSD(token.lifetimeFees.feesUSD)}
                </p>
                <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                  {token.lifetimeFees.feesSOL.toFixed(4)} SOL
                </p>
              </div>
            )}
          </div>

          {/* Creator info */}
          {token.creator?.providerUsername && (
            <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <span
                className="capitalize px-1.5 py-0.5 rounded text-xs"
                style={{ background: "var(--card-border)" }}
              >
                {token.creator.provider ?? "bags"}
              </span>
              <span>@{token.creator.providerUsername}</span>
              {token.creator.royaltyBps != null && (
                <span className="ml-1">· {(token.creator.royaltyBps / 100).toFixed(1)}% royalty</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="px-4 py-2 border-t flex items-center justify-between gap-2"
        style={{ borderColor: "var(--card-border)" }}
      >
        <a
          href={`https://bags.fm/t/${token.tokenMint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on Bags
        </a>
        <a
          href={`https://solscan.io/token/${token.tokenMint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-opacity hover:opacity-70"
          style={{ color: "var(--muted-foreground)" }}
        >
          Solscan ↗
        </a>
      </div>
    </div>
  );
}

export default function BagsTokensSection({
  walletAddress,
  tokens,
  solPrice,
}: BagsTokensSectionProps) {
  const [bagsTokens, setBagsTokens] = useState<BagsWalletToken[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked || tokens.length === 0) return;
    setChecked(true);
    setLoading(true);

    const mints = tokens.map((t) => t.mint).join(",");

    fetch(
      `/api/bags/tokens?wallet=${encodeURIComponent(walletAddress)}&mints=${encodeURIComponent(mints)}&solPrice=${solPrice}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Enrich Bags token data with names/symbols from the portfolio
          const enriched: BagsWalletToken[] = (data.tokens ?? []).map(
            (bt: BagsWalletToken) => {
              const portfolioToken = tokens.find((t) => t.mint === bt.tokenMint);
              return {
                ...bt,
                name: portfolioToken?.name ?? bt.name ?? "",
                symbol: portfolioToken?.symbol ?? bt.symbol ?? "",
                image: portfolioToken?.logoURI ?? bt.image,
              };
            }
          );
          setBagsTokens(enriched);
        }
      })
      .catch((err) => setError(err.message ?? "Unknown error"))
      .finally(() => setLoading(false));
  }, [walletAddress, tokens, solPrice, checked]);

  // Show nothing if no tokens to check (skip the section entirely)
  if (!loading && bagsTokens !== null && bagsTokens.length === 0 && !error) {
    return null;
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-xs font-black"
          style={{ background: "var(--accent)", color: "#0a0f1e" }}
        >
          B
        </div>
        <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          Bags Tokens
        </h3>
        {bagsTokens !== null && bagsTokens.length > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--card-border)", color: "var(--muted-foreground)" }}
          >
            {bagsTokens.length}
          </span>
        )}
        <a
          href="https://bags.fm"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: "var(--muted-foreground)" }}
        >
          bags.fm <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex items-center gap-2 py-6 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent)" }} />
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Checking for Bags tokens…
            </span>
          </div>
        )}

        {error && !loading && (
          <div
            className="text-sm text-center py-6"
            style={{ color: "var(--muted-foreground)" }}
          >
            Could not load Bags data.{" "}
            <span className="text-xs font-mono" style={{ color: "var(--negative)" }}>
              {error}
            </span>
          </div>
        )}

        {!loading && bagsTokens !== null && bagsTokens.length > 0 && (
          <div className="space-y-6">
            {/* Token grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bagsTokens.map((token) => (
                <BagsTokenCard key={token.tokenMint} token={token} solPrice={solPrice} />
              ))}
            </div>

            {/* Creator earnings (only if wallet is creator of any) */}
            {bagsTokens.some((t) => t.isCreator) && (
              <CreatorEarnings tokens={bagsTokens} solPrice={solPrice} />
            )}

            {/* Link to explore more */}
            <div
              className="rounded-xl border px-4 py-3 flex items-center justify-between gap-4"
              style={{
                background: "rgba(0,212,170,0.04)",
                borderColor: "rgba(0,212,170,0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Launch or trade tokens on Bags.fm — the fastest token launchpad on Solana.
                </p>
              </div>
              <a
                href="https://bags.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#0a0f1e" }}
              >
                Open Bags →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
