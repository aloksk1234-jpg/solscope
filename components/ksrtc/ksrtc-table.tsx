"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { KSRTC_DATA, PARTY_COLORS, type KSRTCYearData, type Party } from "@/lib/ksrtc-data";

type SortKey = "fy" | "netPL" | "revenue" | "expenses" | "dieselPricePerLitre";

const HEADERS: { key: SortKey; label: string }[] = [
  { key: "fy", label: "FY" },
  { key: "revenue", label: "Revenue (₹Cr)" },
  { key: "expenses", label: "Expenses (₹Cr)" },
  { key: "netPL", label: "Net P&L (₹Cr)" },
  { key: "dieselPricePerLitre", label: "Diesel (₹/L)" },
];

export default function KSRTCTable() {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "fy",
    dir: "asc",
  });
  const [expandedFY, setExpandedFY] = useState<string | null>(null);
  const [partyFilter, setPartyFilter] = useState<Party | "ALL">("ALL");

  const rows = [...KSRTC_DATA]
    .filter((d) => partyFilter === "ALL" || d.party === partyFilter)
    .sort((a, b) => {
      const va: number | string = a[sort.key as keyof KSRTCYearData] as number | string;
      const vb: number | string = b[sort.key as keyof KSRTCYearData] as number | string;
      if (typeof va === "number" && typeof vb === "number") {
        return sort.dir === "asc" ? va - vb : vb - va;
      }
      return sort.dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

  function toggleSort(key: SortKey) {
    setSort((prev: { key: SortKey; dir: "asc" | "desc" }) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sort.key !== k) return null;
    return sort.dir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
        {(["ALL", "LDF", "UDF"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPartyFilter(p)}
            className="text-xs px-3 py-1 rounded-full border transition-all"
            style={{
              borderColor:
                partyFilter === p
                  ? p === "ALL"
                    ? "var(--sol-purple)"
                    : PARTY_COLORS[p as Party]
                  : "var(--card-border)",
              background:
                partyFilter === p
                  ? (p === "ALL" ? "#9945FF" : PARTY_COLORS[p as Party]) + "22"
                  : "var(--card)",
              color:
                partyFilter === p
                  ? p === "ALL"
                    ? "#9945FF"
                    : PARTY_COLORS[p as Party]
                  : "var(--muted-foreground)",
              fontWeight: partyFilter === p ? 700 : 400,
            }}
          >
            {p === "ALL"
              ? "All Years"
              : p === "LDF"
              ? "LDF (CPM-led)"
              : "UDF (Congress-led)"}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {HEADERS.map((h) => (
                  <th
                    key={h.key}
                    onClick={() => toggleSort(h.key)}
                    className="text-left px-4 py-3 font-semibold cursor-pointer select-none transition-colors hover:text-white"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h.label}
                    <SortIcon k={h.key} />
                  </th>
                ))}
                <th
                  className="text-left px-4 py-3 font-semibold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Govt
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  CM
                </th>
                <th
                  className="px-4 py-3"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isExpanded = expandedFY === row.fy;
                const pColor = PARTY_COLORS[row.party];
                const isLoss = row.netPL < 0;
                return (
                  <>
                    <tr
                      key={row.fy}
                      className="border-t cursor-pointer transition-colors hover:bg-[var(--card-hover)]"
                      style={{ borderColor: "var(--card-border)" }}
                      onClick={() =>
                        setExpandedFY(isExpanded ? null : row.fy)
                      }
                    >
                      <td className="px-4 py-3 font-mono font-bold" style={{ color: "var(--foreground)" }}>
                        {row.fy}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: "#14F195" }}>
                        ₹{row.revenue.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: "#FA5454" }}>
                        ₹{row.expenses.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-black" style={{ color: isLoss ? "#FA5454" : "#14F195" }}>
                        {isLoss ? "−" : "+"}₹{Math.abs(row.netPL).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#FAC238" }}>
                        ₹{row.dieselPricePerLitre}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: pColor + "22", color: pColor }}
                        >
                          {row.party}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {row.cm}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-auto" style={{ color: "var(--muted)" }} />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" style={{ color: "var(--muted)" }} />
                        )}
                      </td>
                    </tr>
                    <AnimatePresence>
                      {isExpanded && (
                        <tr key={row.fy + "-exp"} style={{ background: "var(--bg-secondary)" }}>
                          <td colSpan={8} className="px-4 pb-4 pt-2">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-2"
                            >
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div>
                                  <span style={{ color: "var(--muted-foreground)" }}>Fleet: </span>
                                  <span className="font-bold">{row.fleet.toLocaleString("en-IN")} buses</span>
                                </div>
                                <div>
                                  <span style={{ color: "var(--muted-foreground)" }}>Staff: </span>
                                  <span className="font-bold">{row.staff.toLocaleString("en-IN")}</span>
                                </div>
                                <div>
                                  <span style={{ color: "var(--muted-foreground)" }}>Pensioners: </span>
                                  <span className="font-bold">{row.pensioners.toLocaleString("en-IN")}</span>
                                </div>
                                <div>
                                  <span style={{ color: "var(--muted-foreground)" }}>Subvention: </span>
                                  <span className="font-bold" style={{ color: "#9945FF" }}>₹{row.govtSubvention} Cr</span>
                                </div>
                              </div>
                              <ul className="mt-1 space-y-1">
                                {row.events.map((ev, ei) => (
                                  <li key={ei} className="text-xs flex items-start gap-1.5">
                                    <span style={{ color: pColor }} className="shrink-0 mt-0.5">▸</span>
                                    <span style={{ color: "var(--foreground)" }}>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                              {row.dataQuality === "official" ? (
                                <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background: "#14F19522", color: "#14F195" }}>
                                  ✓ Official (SPB / CARE Ratings)
                                </span>
                              ) : row.dataQuality === "semi-official" ? (
                                <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background: "#9945FF22", color: "#9945FF" }}>
                                  ◑ Semi-official (CAG / academic)
                                </span>
                              ) : (
                                <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background: "#FAC23822", color: "#FAC238" }}>
                                  ⚠ Estimated — verify against KSRTC Annual Report
                                </span>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
