"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";

interface EvaluatedCriterion {
  id: string;
  label: string;
  description: string;
  met: boolean;
}

interface SerializableAirdrop {
  id: string;
  project: string;
  logoColor: string;
  logoUrl?: string;
  description: string;
  status: string;
  estimatedDate?: string;
  link: string;
}

interface AirdropCardProps {
  airdrop: SerializableAirdrop;
  evaluatedCriteria: EvaluatedCriterion[];
  index?: number;
}

const STATUS_META: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  upcoming: { bg: "rgba(59,130,246,0.1)", text: "#3B82F6", label: "Upcoming", dot: "#3B82F6" },
  active:   { bg: "rgba(0,212,170,0.1)",  text: "#00D4AA", label: "Active",   dot: "#00D4AA" },
  ended:    { bg: "rgba(148,163,184,0.08)", text: "#94a3b8", label: "Ended",  dot: "#94a3b8" },
};

function ProtocolLogo({ src, fallback, color }: { src?: string; fallback: string; color: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
        style={{ background: `${color}22`, color, border: `1.5px solid ${color}44` }}
      >
        {fallback}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={fallback}
      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
      style={{ border: "1.5px solid rgba(255,255,255,0.08)" }}
      onError={() => setError(true)}
    />
  );
}

export default function AirdropCard({ airdrop, evaluatedCriteria, index = 0 }: AirdropCardProps) {
  const metCount = evaluatedCriteria.filter((r) => r.met).length;
  const totalCount = evaluatedCriteria.length;
  const pct = totalCount > 0 ? (metCount / totalCount) * 100 : 0;
  const fullyEligible = metCount === totalCount;

  const status = STATUS_META[airdrop.status] ?? STATUS_META.upcoming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="rounded-2xl border flex flex-col gap-4 p-5 card-hover"
      style={{
        background: "var(--card)",
        borderColor: fullyEligible ? `${airdrop.logoColor}44` : "var(--card-border)",
        boxShadow: fullyEligible ? `0 0 24px ${airdrop.logoColor}18` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <ProtocolLogo
          src={airdrop.logoUrl}
          fallback={airdrop.project.charAt(0).toUpperCase()}
          color={airdrop.logoColor}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                {airdrop.project}
              </p>
              {airdrop.estimatedDate && (
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Est. {airdrop.estimatedDate}
                </p>
              )}
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 flex items-center gap-1"
              style={{ background: status.bg, color: status.text }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: status.dot }}
              />
              {status.label}
            </span>
          </div>
          <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
            {airdrop.description}
          </p>
        </div>
      </div>

      {/* Progress ring + criteria */}
      <div className="flex items-center gap-4">
        {/* Mini ring */}
        <div className="relative flex-shrink-0 w-14 h-14">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--card-border)" strokeWidth="4" />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke={fullyEligible ? airdrop.logoColor : "#4a6080"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={2 * Math.PI * 22 * (1 - pct / 100)}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xs font-black"
              style={{ color: fullyEligible ? airdrop.logoColor : "var(--muted-foreground)" }}
            >
              {metCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Criteria list */}
        <div className="flex-1 space-y-1.5">
          {evaluatedCriteria.map((criterion) => (
            <div key={criterion.id} className="flex items-start gap-2">
              {criterion.met ? (
                <CheckCircle2
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                />
              ) : (
                <XCircle
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  style={{ color: "var(--negative)" }}
                />
              )}
              <p
                className="text-xs"
                style={{ color: criterion.met ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {criterion.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility badge */}
      {fullyEligible && (
        <div
          className="rounded-lg px-3 py-2 text-xs font-semibold text-center"
          style={{ background: `${airdrop.logoColor}18`, color: airdrop.logoColor }}
        >
          ✓ Fully eligible — check the project for claim details
        </div>
      )}

      {/* Footer */}
      <a
        href={airdrop.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--accent)" }}
      >
        Learn more
        <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}
