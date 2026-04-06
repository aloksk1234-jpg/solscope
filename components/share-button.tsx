"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Image as ImageIcon, Check } from "lucide-react";

interface ShareButtonProps {
  address: string;
  totalUsdValue: number;
  solBalance: number;
  tokenCount: number;
  nftCount: number;
  healthGrade: string;
}

export default function ShareButton({
  address,
  totalUsdValue,
  solBalance,
  tokenCount,
  nftCount,
  healthGrade,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://solscope.app/wallet/${address}`;

  const ogParams = new URLSearchParams({
    address,
    total: totalUsdValue.toFixed(2),
    sol: solBalance.toFixed(4),
    tokens: tokenCount.toString(),
    nfts: nftCount.toString(),
    grade: healthGrade,
  });
  const ogUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/og?${ogParams}`;

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 flex-shrink-0"
        style={{ background: "rgba(30,45,74,0.8)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl z-50 overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => copyText(pageUrl, "link")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-left"
              style={{ color: "var(--foreground)" }}
            >
              {copied === "link" ? (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              ) : (
                <Link2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
              )}
              <span>{copied === "link" ? "Copied!" : "Copy link"}</span>
            </button>

            <button
              onClick={() => copyText(ogUrl, "card")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-left"
              style={{ color: "var(--foreground)" }}
            >
              {copied === "card" ? (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              ) : (
                <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
              )}
              <span>{copied === "card" ? "Copied!" : "Copy card URL"}</span>
            </button>

            <a
              href={ogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5"
              style={{ color: "var(--foreground)" }}
              onClick={() => setOpen(false)}
            >
              <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <span>Download card</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
