"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface WalletHeaderProps {
  address: string;
  domain?: string;
}

export default function WalletHeader({ address, domain }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        {domain && (
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(0,212,170,0.15)", color: "var(--accent)" }}
          >
            {domain}
          </span>
        )}

        <code
          className="text-sm sm:text-base font-mono"
          style={{ color: "var(--muted-foreground)" }}
        >
          {shortenAddress(address, 6)}
        </code>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-200 hover:opacity-80"
          style={{
            background: "var(--card-border)",
            color: copied ? "var(--positive)" : "var(--muted-foreground)",
          }}
          title="Copy address"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>

        <a
          href={`https://solscan.io/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-200 hover:opacity-80"
          style={{
            background: "var(--card-border)",
            color: "var(--muted-foreground)",
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Solscan
        </a>
      </div>
    </div>
  );
}
