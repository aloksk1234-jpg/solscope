"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { NFTHolding } from "@/types";
import { ImageOff } from "lucide-react";

interface NFTGridProps {
  nfts: NFTHolding[];
  address: string;
}

function NFTCard({ nft, index }: { nft: NFTHolding; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl border overflow-hidden group cursor-default card-hover"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Image */}
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: "#0a0d1a" }}
      >
        {nft.image && !imgError ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 opacity-20" style={{ color: "var(--muted-foreground)" }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
          style={{ background: "linear-gradient(to top, rgba(15,15,23,0.85) 0%, transparent 50%)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            View details →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        {nft.collection && (
          <p
            className="text-xs font-bold uppercase tracking-wider truncate"
            style={{ color: "var(--sol-purple)" }}
            title={nft.collection}
          >
            {nft.collection}
          </p>
        )}
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--foreground)" }}
          title={nft.name}
        >
          {nft.name}
        </p>
      </div>
    </motion.div>
  );
}

const INITIAL_SHOW = 12;

export default function NFTGrid({ nfts }: NFTGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string>("All");

  if (nfts.length === 0) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <p style={{ color: "var(--muted-foreground)" }}>No NFTs found in this wallet.</p>
      </div>
    );
  }

  // Build collection list
  const collections = Array.from(
    new Set(nfts.map((n) => n.collection).filter(Boolean))
  ) as string[];

  const filtered =
    activeCollection === "All"
      ? nfts
      : nfts.filter((n) => n.collection === activeCollection);

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const hasMore = filtered.length > INITIAL_SHOW;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--card-border)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          NFT Collection
        </h3>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {nfts.length} items
        </span>
      </div>

      {/* Collection filter tabs */}
      {collections.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 py-3 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          {["All", ...collections].map((col) => {
            const count = col === "All" ? nfts.length : nfts.filter((n) => n.collection === col).length;
            const isActive = activeCollection === col;
            return (
              <button
                key={col}
                onClick={() => { setActiveCollection(col); setShowAll(false); }}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  background: isActive ? "rgba(153,69,255,0.12)" : "transparent",
                  borderColor: isActive ? "var(--sol-purple)" : "var(--card-border)",
                  color: isActive ? "var(--sol-purple)" : "var(--muted-foreground)",
                }}
              >
                {col} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayed.map((nft, i) => (
          <NFTCard key={nft.mint} nft={nft} index={i} />
        ))}
      </div>

      {hasMore && (
        <div
          className="p-3 flex justify-center border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          <button
            onClick={() => setShowAll((p) => !p)}
            className="text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {showAll ? "Show less" : `Show ${filtered.length - INITIAL_SHOW} more NFTs`}
          </button>
        </div>
      )}
    </div>
  );
}
