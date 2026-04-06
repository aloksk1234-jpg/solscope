"use client";

import { useState } from "react";
import type { BagsTradeQuote } from "@/types/bags";
import { Loader2, Zap, X, AlertTriangle, ArrowRight } from "lucide-react";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const LAMPORTS_PER_SOL = 1_000_000_000;

// Common token decimals for display
const TOKEN_DECIMALS: Record<string, number> = {
  So11111111111111111111111111111111111111112: 9,
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 6,
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 6,
};

function formatOutputAmount(amount: string, outputMint: string): string {
  const raw = Number(amount);
  if (isNaN(raw)) return amount;
  const decimals = TOKEN_DECIMALS[outputMint] ?? 6;
  const val = raw / Math.pow(10, decimals);
  if (val >= 1000) return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (val >= 1) return val.toFixed(4);
  return val.toFixed(6);
}

interface BagsTradeButtonProps {
  /** The token you want to acquire (e.g., the strategy's primary token) */
  outputMint: string;
  outputSymbol?: string;
  /** Input amount in SOL (default: 0.1 SOL) */
  inputSOL?: number;
}

export default function BagsTradeButton({
  outputMint,
  outputSymbol = "token",
  inputSOL = 0.1,
}: BagsTradeButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<BagsTradeQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Don't render if input = output (SOL → SOL makes no sense)
  if (outputMint === SOL_MINT) return null;

  async function fetchQuote() {
    setOpen(true);
    if (quote || loading) return; // already loaded

    setLoading(true);
    setError(null);

    const amountLamports = Math.round(inputSOL * LAMPORTS_PER_SOL);

    try {
      const res = await fetch(
        `/api/bags/quote?inputMint=${encodeURIComponent(SOL_MINT)}&outputMint=${encodeURIComponent(outputMint)}&amount=${amountLamports}&slippageBps=50`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setQuote(data as BagsTradeQuote);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
  }

  const priceImpactColor =
    quote && quote.priceImpact > 5
      ? "var(--negative)"
      : quote && quote.priceImpact > 2
      ? "#F59E0B"
      : "var(--positive)";

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={fetchQuote}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
        style={{
          background: "rgba(0,212,170,0.12)",
          color: "var(--accent)",
          border: "1px solid rgba(0,212,170,0.25)",
        }}
      >
        <Zap className="w-3.5 h-3.5" />
        Swap via Bags
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "var(--card-border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-black"
                  style={{ background: "var(--accent)", color: "#0a0f1e" }}
                >
                  B
                </div>
                <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  Swap via Bags
                </span>
              </div>
              <button
                onClick={close}
                className="p-1 rounded-md transition-opacity hover:opacity-70"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Trade pair display */}
              <div
                className="rounded-xl border p-4 flex items-center justify-between gap-3"
                style={{ background: "#060d1a", borderColor: "var(--card-border)" }}
              >
                <div className="text-center">
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    You pay
                  </p>
                  <p className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
                    {inputSOL} SOL
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                <div className="text-center">
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    You receive (est.)
                  </p>
                  {loading ? (
                    <Loader2
                      className="w-5 h-5 animate-spin mx-auto mt-1"
                      style={{ color: "var(--accent)" }}
                    />
                  ) : quote ? (
                    <p className="font-bold text-lg" style={{ color: "var(--accent)" }}>
                      {formatOutputAmount(quote.outputAmount, outputMint)}{" "}
                      {outputSymbol}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      —
                    </p>
                  )}
                </div>
              </div>

              {/* Quote details */}
              {quote && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>Price Impact</span>
                    <span className="font-medium" style={{ color: priceImpactColor }}>
                      {quote.priceImpact > 0
                        ? `${quote.priceImpact.toFixed(2)}%`
                        : "< 0.01%"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>Slippage tolerance</span>
                    <span style={{ color: "var(--foreground)" }}>0.5%</span>
                  </div>
                  {quote.priceImpact > 5 && (
                    <div
                      className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
                      style={{
                        background: "rgba(244,63,94,0.08)",
                        borderColor: "rgba(244,63,94,0.2)",
                        color: "#f43f5e",
                        border: "1px solid",
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      High price impact. Consider using a smaller amount.
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-center" style={{ color: "var(--negative)" }}>
                  {error}
                </p>
              )}

              {/* CTA */}
              <a
                href={`https://bags.fm/swap?inputMint=${SOL_MINT}&outputMint=${outputMint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#0a0f1e" }}
              >
                <Zap className="w-4 h-4" />
                Execute Swap on Bags.fm
              </a>

              <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
                Quote is indicative. Final price set at execution on Bags.fm.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
