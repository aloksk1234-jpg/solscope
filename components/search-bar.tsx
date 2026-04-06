"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { isSolDomain, isValidSolanaAddress } from "@/lib/utils";

export default function SearchBar() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = input.trim();

    if (!value) {
      setError("Please enter a wallet address or .sol domain.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isSolDomain(value)) {
        // Resolve .sol domain
        const res = await fetch(`/api/resolve?domain=${encodeURIComponent(value)}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error ?? "Could not resolve domain. Check the name and try again.");
          return;
        }

        router.push(`/wallet/${data.address}`);
      } else if (isValidSolanaAddress(value)) {
        router.push(`/wallet/${value}`);
      } else {
        setError("Please enter a valid Solana address (base58) or .sol domain.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center rounded-2xl border transition-all duration-200 p-2 pl-6"
          style={{
            background: "var(--card)",
            borderColor: error ? "var(--negative)" : "var(--card-border)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--sol-purple)";
          }}
          onBlur={(e) => {
            if (!error) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)";
          }}
        >
          <div className="flex-shrink-0 mr-2" style={{ color: "var(--muted)" }}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent)" }} />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter .sol domain or wallet address..."
            disabled={loading}
            className="flex-1 py-3 bg-transparent text-base outline-none disabled:opacity-50"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-gradient flex-shrink-0 px-6 py-3.5 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            style={{ color: "#0F0F17" }}
          >
            {loading ? "Resolving..." : "Analyze →"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-2 text-sm pl-2" style={{ color: "var(--negative)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
