"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { KSRTC_DATA, PARTY_COLORS, type KSRTCYearData, type Party } from "@/lib/ksrtc-data";

type SortKey = keyof Pick<KSRTCYearData, "fy"|"netPL"|"revenue"|"expenses"|"dieselPricePerLitre">;

const COLS: { key: SortKey; label: string }[] = [
  { key:"fy", label:"FY" },
  { key:"revenue", label:"Revenue (₹Cr)" },
  { key:"expenses", label:"Expenses (₹Cr)" },
  { key:"netPL", label:"Net P&L (₹Cr)" },
  { key:"dieselPricePerLitre", label:"Diesel (₹/L)" },
];

export default function DataTable() {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc"|"desc" }>({ key:"fy", dir:"asc" });
  const [open, setOpen] = useState<string|null>(null);
  const [party, setParty] = useState<Party|"ALL">("ALL");

  const rows = [...KSRTC_DATA]
    .filter(d => party==="ALL" || d.party===party)
    .sort((a,b) => {
      const va = a[sort.key as keyof KSRTCYearData] as number|string;
      const vb = b[sort.key as keyof KSRTCYearData] as number|string;
      if (typeof va==="number" && typeof vb==="number") return sort.dir==="asc" ? va-vb : vb-va;
      return sort.dir==="asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const toggle = (key: SortKey) =>
    setSort((p: { key:SortKey; dir:"asc"|"desc" }) => p.key===key ? { key, dir:p.dir==="asc"?"desc":"asc" } : { key, dir:"asc" });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4" style={{ color:"var(--muted)" }} />
        {(["ALL","LDF","UDF"] as const).map(p => (
          <button key={p} onClick={() => setParty(p)}
            className="text-xs px-3 py-1 rounded-full border transition-all"
            style={{
              borderColor: party===p ? (p==="ALL"?"var(--purple)":PARTY_COLORS[p as Party]) : "var(--border)",
              background:  party===p ? (p==="ALL"?"#8B5CF622":PARTY_COLORS[p as Party]+"22") : "var(--card)",
              color:       party===p ? (p==="ALL"?"#8B5CF6":PARTY_COLORS[p as Party]) : "var(--muted)",
              fontWeight:  party===p ? 700 : 400,
            }}>
            {p==="ALL"?"All Years":p==="LDF"?"LDF (CPM-led)":"UDF (Congress-led)"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background:"var(--bg2)" }}>
                {COLS.map(c => (
                  <th key={c.key} onClick={() => toggle(c.key)}
                    className="text-left px-4 py-3 font-semibold cursor-pointer select-none hover:text-white transition-colors"
                    style={{ color:"var(--muted)" }}>
                    {c.label}
                    {sort.key===c.key && (sort.dir==="asc" ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />)}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold" style={{ color:"var(--muted)" }}>Govt</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color:"var(--muted)" }}>CM</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const isOpen = open===row.fy;
                const pc = PARTY_COLORS[row.party];
                const isLoss = row.netPL < 0;
                return (
                  <>
                    <tr key={row.fy} className="border-t cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
                      style={{ borderColor:"var(--border)" }} onClick={() => setOpen(isOpen?null:row.fy)}>
                      <td className="px-4 py-3 font-mono font-bold">{row.fy}</td>
                      <td className="px-4 py-3 font-medium" style={{ color:"#10D97C" }}>₹{row.revenue.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-medium" style={{ color:"#F04545" }}>₹{row.expenses.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-black" style={{ color:isLoss?"#F04545":"#10D97C" }}>
                        {isLoss?"−":"+"}₹{Math.abs(row.netPL).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3" style={{ color:"#F5B731" }}>₹{row.dieselPricePerLitre}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:pc+"22", color:pc }}>{row.party}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:"var(--muted)" }}>{row.cm}</td>
                      <td className="px-4 py-3 text-right">
                        {isOpen?<ChevronUp className="w-4 h-4 ml-auto" style={{ color:"var(--subtle)" }}/>:<ChevronDown className="w-4 h-4 ml-auto" style={{ color:"var(--subtle)" }}/>}
                      </td>
                    </tr>
                    <AnimatePresence>
                      {isOpen && (
                        <tr key={row.fy+"-x"} style={{ background:"var(--bg2)" }}>
                          <td colSpan={8} className="px-4 pb-4 pt-2">
                            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.18 }} className="space-y-2">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div><span style={{ color:"var(--muted)" }}>Fleet: </span><b>{row.fleet.toLocaleString("en-IN")} buses</b></div>
                                <div><span style={{ color:"var(--muted)" }}>Staff: </span><b>{row.staff.toLocaleString("en-IN")}</b></div>
                                <div><span style={{ color:"var(--muted)" }}>Pensioners: </span><b>{row.pensioners.toLocaleString("en-IN")}</b></div>
                                <div><span style={{ color:"var(--muted)" }}>Subvention: </span><b style={{ color:"#8B5CF6" }}>₹{row.govtSubvention} Cr</b></div>
                              </div>
                              <ul className="space-y-1">
                                {row.events.map((ev,ei) => (
                                  <li key={ei} className="text-xs flex items-start gap-1.5">
                                    <span style={{ color:pc }} className="shrink-0 mt-0.5">▸</span>
                                    <span style={{ color:"var(--fg)" }}>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                              {row.dataQuality==="official"
                                ? <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background:"#10D97C22", color:"#10D97C" }}>✓ Official (SPB / CARE Ratings)</span>
                                : row.dataQuality==="semi-official"
                                ? <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background:"#8B5CF622", color:"#8B5CF6" }}>◑ Semi-official (CAG / academic)</span>
                                : <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ background:"#F5B73122", color:"#F5B731" }}>⚠ Estimated</span>}
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
