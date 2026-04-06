"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, RefreshCw, Users } from "lucide-react";
import { useMultiWallet } from "@/components/multi-wallet-manager";
import { isValidSolanaAddress } from "@/lib/utils";
import type { Portfolio } from "@/types";

// Simple donut breakdown without recharts (inline SVG)
function MiniBreakdown({ portfolio }: { portfolio: Portfolio }) {
  const total = portfolio.totalUsdValue;
  if (total <= 0) return null;

  const segments = [
    { label: "SOL", value: portfolio.breakdown.sol, color: "#9945FF" },
    { label: "Stables", value: portfolio.breakdown.stablecoins, color: "#00D4AA" },
    { label: "DeFi", value: portfolio.breakdown.defiTokens, color: "#3B82F6" },
    { label: "Other", value: portfolio.breakdown.other, color: "#F59E0B" },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {segments.map((s) => (
        <div key={s.label} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: s.color }}
          />
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {s.label}: {((s.value / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-4 animate-pulse"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div
        className="h-4 w-32 rounded mb-3"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      <div
        className="h-8 w-24 rounded mb-2"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      <div
        className="h-3 w-40 rounded"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

function truncateAddress(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
}

export default function ComparePage() {
  const [inputValue, setInputValue] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { wallets, canAddMore, addWallet, removeWallet, refreshWallet } =
    useMultiWallet();

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!isValidSolanaAddress(trimmed)) {
      setAddError("Invalid Solana wallet address");
      return;
    }

    const added = addWallet(trimmed);
    if (!added) {
      if (!canAddMore) {
        setAddError("Maximum 5 wallets reached");
      } else {
        setAddError("Wallet already added");
      }
      return;
    }

    setInputValue("");
    setAddError(null);
  }

  // Aggregate stats
  const loadedWallets = wallets.filter((w) => w.portfolio !== null);
  const combinedTotal = loadedWallets.reduce(
    (sum, w) => sum + (w.portfolio?.totalUsdValue ?? 0),
    0
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="border-b sticky top-0 z-10 backdrop-blur-sm"
        style={{
          borderColor: "var(--card-border)",
          background: "rgba(10,15,30,0.85)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">SolScope</span>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Multi-Wallet View
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Add Wallet
              </h3>

              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setAddError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Solana address..."
                  className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: addError ? "var(--negative)" : "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                  disabled={!canAddMore}
                />
                <button
                  onClick={handleAdd}
                  disabled={!canAddMore || !inputValue.trim()}
                  className="px-3 py-2 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ background: "var(--accent)", color: "#0a0f1e" }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {addError && (
                <p className="text-xs" style={{ color: "var(--negative)" }}>
                  {addError}
                </p>
              )}

              {!canAddMore && (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Maximum of 5 wallets reached.
                </p>
              )}
            </div>

            {/* Wallet list */}
            {wallets.length > 0 && (
              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.address}
                    className="rounded-xl border p-3"
                    style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/wallet/${wallet.address}`}
                        className="text-xs font-mono transition-opacity hover:opacity-70"
                        style={{ color: "var(--accent)" }}
                      >
                        {truncateAddress(wallet.address)}
                      </Link>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => refreshWallet(wallet.address)}
                          className="p-1 rounded transition-opacity hover:opacity-70"
                          style={{ color: "var(--muted-foreground)" }}
                          title="Refresh"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeWallet(wallet.address)}
                          className="p-1 rounded transition-opacity hover:opacity-70"
                          style={{ color: "var(--muted-foreground)" }}
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {wallet.loading ? (
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Loading...
                      </p>
                    ) : wallet.error ? (
                      <p className="text-xs mt-1" style={{ color: "var(--negative)" }}>
                        {wallet.error}
                      </p>
                    ) : wallet.portfolio ? (
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-mono)" }}
                      >
                        $
                        {wallet.portfolio.totalUsdValue.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main area */}
          <div className="flex-1 space-y-6">
            {wallets.length === 0 ? (
              <div
                className="rounded-xl border p-12 text-center"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                <Users className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--muted-foreground)" }} />
                <p className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                  No wallets added yet
                </p>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Add up to 5 Solana wallet addresses to compare them side by side.
                </p>
              </div>
            ) : (
              <>
                {/* Aggregate stats */}
                {loadedWallets.length > 0 && (
                  <div
                    className="rounded-xl border p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
                    style={{ background: "var(--card)", borderColor: "rgba(0,212,170,0.2)" }}
                  >
                    {[
                      {
                        label: "Combined Value",
                        value: `$${combinedTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                        color: "var(--accent)",
                      },
                      {
                        label: "Wallets Loaded",
                        value: `${loadedWallets.length} / ${wallets.length}`,
                        color: "var(--foreground)",
                      },
                      {
                        label: "Total SOL",
                        value: `${loadedWallets
                          .reduce((s, w) => s + (w.portfolio?.solBalance ?? 0), 0)
                          .toFixed(2)} SOL`,
                        color: "#9945FF",
                      },
                      {
                        label: "Total NFTs",
                        value: `${loadedWallets.reduce(
                          (s, w) => s + (w.portfolio?.nfts.length ?? 0),
                          0
                        )}`,
                        color: "#F59E0B",
                      },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {stat.label}
                        </p>
                        <p
                          className="font-bold text-lg mt-0.5"
                          style={{ color: stat.color, fontFamily: "var(--font-mono)" }}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Per-wallet cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wallets.map((wallet) =>
                    wallet.loading ? (
                      <SkeletonCard key={wallet.address} />
                    ) : wallet.error ? (
                      <div
                        key={wallet.address}
                        className="rounded-xl border p-4"
                        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                      >
                        <p
                          className="text-xs font-mono mb-2"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {truncateAddress(wallet.address)}
                        </p>
                        <p className="text-sm" style={{ color: "var(--negative)" }}>
                          {wallet.error}
                        </p>
                      </div>
                    ) : wallet.portfolio ? (
                      <div
                        key={wallet.address}
                        className="rounded-xl border p-4"
                        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                      >
                        <Link
                          href={`/wallet/${wallet.address}`}
                          className="text-xs font-mono transition-opacity hover:opacity-70 block mb-2"
                          style={{ color: "var(--accent)" }}
                        >
                          {truncateAddress(wallet.address)}
                        </Link>
                        <p
                          className="text-2xl font-black"
                          style={{ color: "var(--foreground)", fontFamily: "var(--font-mono)" }}
                        >
                          $
                          {wallet.portfolio.totalUsdValue.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <MiniBreakdown portfolio={wallet.portfolio} />
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {[
                            {
                              label: "SOL",
                              value: wallet.portfolio.solBalance.toFixed(2),
                              color: "#9945FF",
                            },
                            {
                              label: "Tokens",
                              value: wallet.portfolio.tokens.length,
                              color: "#00D4AA",
                            },
                            {
                              label: "NFTs",
                              value: wallet.portfolio.nfts.length,
                              color: "#F59E0B",
                            },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className="rounded-lg p-2 text-center"
                              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)" }}
                            >
                              <p
                                className="text-sm font-bold"
                                style={{ color: s.color, fontFamily: "var(--font-mono)" }}
                              >
                                {s.value}
                              </p>
                              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                {/* Comparison table */}
                {loadedWallets.length > 1 && (
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                  >
                    <div
                      className="p-4 border-b"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                        Side-by-Side Comparison
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr
                            className="border-b"
                            style={{ borderColor: "var(--card-border)" }}
                          >
                            {["Address", "Total USD", "SOL", "Tokens", "NFTs", "Stables"].map(
                              (col) => (
                                <th
                                  key={col}
                                  className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  {col}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {loadedWallets.map((wallet) => {
                            const p = wallet.portfolio!;
                            return (
                              <tr
                                key={wallet.address}
                                className="border-b hover:bg-white/[0.02] transition-colors"
                                style={{ borderColor: "var(--card-border)" }}
                              >
                                <td className="px-4 py-3">
                                  <Link
                                    href={`/wallet/${wallet.address}`}
                                    className="text-xs font-mono hover:opacity-70 transition-opacity"
                                    style={{ color: "var(--accent)" }}
                                  >
                                    {truncateAddress(wallet.address)}
                                  </Link>
                                </td>
                                <td
                                  className="px-4 py-3 font-mono text-xs font-semibold"
                                  style={{ color: "var(--foreground)" }}
                                >
                                  $
                                  {p.totalUsdValue.toLocaleString("en-US", {
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                                <td
                                  className="px-4 py-3 font-mono text-xs"
                                  style={{ color: "#9945FF" }}
                                >
                                  {p.solBalance.toFixed(2)}
                                </td>
                                <td
                                  className="px-4 py-3 font-mono text-xs"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  {p.tokens.length}
                                </td>
                                <td
                                  className="px-4 py-3 font-mono text-xs"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  {p.nfts.length}
                                </td>
                                <td
                                  className="px-4 py-3 font-mono text-xs"
                                  style={{ color: "#00D4AA" }}
                                >
                                  $
                                  {p.breakdown.stablecoins.toLocaleString("en-US", {
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
