"use client";

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
  description: string;
  status: string;
  estimatedDate?: string;
  link: string;
}

interface AirdropCardProps {
  airdrop: SerializableAirdrop;
  evaluatedCriteria: EvaluatedCriterion[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", label: "Upcoming" },
  active: { bg: "rgba(0,212,170,0.12)", text: "#00d4aa", label: "Active" },
  ended: { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", label: "Ended" },
};

export default function AirdropCard({ airdrop, evaluatedCriteria }: AirdropCardProps) {
  const results = evaluatedCriteria;
  const metCount = results.filter((r) => r.met).length;
  const totalCount = results.length;
  const pct = totalCount > 0 ? (metCount / totalCount) * 100 : 0;

  const status = STATUS_COLORS[airdrop.status] ?? STATUS_COLORS.upcoming;

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Logo initial */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: airdrop.logoColor, color: "#0a0f1e" }}
        >
          {airdrop.project.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {airdrop.project}
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{ background: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {airdrop.description}
          </p>
          {airdrop.estimatedDate && (
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              Est. {airdrop.estimatedDate}
            </p>
          )}
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="space-y-2">
        {results.map((criterion) => (
          <div key={criterion.id} className="flex items-start gap-2.5">
            {criterion.met ? (
              <CheckCircle2
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
            ) : (
              <XCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "var(--negative)" }}
              />
            )}
            <div className="min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: criterion.met ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {criterion.label}
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {criterion.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar + summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "var(--muted-foreground)" }}>
            Eligibility:{" "}
            <span
              style={{ color: metCount === totalCount ? "var(--accent)" : "var(--foreground)", fontWeight: 600 }}
            >
              {metCount}/{totalCount} criteria met
            </span>
          </span>
          <span style={{ color: "var(--muted-foreground)" }}>{Math.round(pct)}%</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(148,163,184,0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: metCount === totalCount ? "var(--accent)" : "rgba(0,212,170,0.5)",
            }}
          />
        </div>
      </div>

      {/* Learn more */}
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
    </div>
  );
}
