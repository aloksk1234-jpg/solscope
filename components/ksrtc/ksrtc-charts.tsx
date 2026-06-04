"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  KSRTC_DATA,
  PARTY_COLORS,
  LDF_YEARS,
  UDF_YEARS,
  avg,
} from "@/lib/ksrtc-data";

/* ─── Reusable tooltip styles ─── */
const TTP_STYLE = {
  background: "#1A1C29",
  border: "1px solid #292B3D",
  borderRadius: 10,
  color: "#F2F2F8",
  fontSize: 12,
  padding: "10px 14px",
};

function crFmt(v: number) {
  return `₹${Math.abs(v).toLocaleString("en-IN")} Cr`;
}

/* ══════════════════════════════════════════════════════════════
   1. MAIN P&L COMBO CHART  (Revenue, Expenses, Net P&L)
══════════════════════════════════════════════════════════════ */
export function PLComboChart() {
  const data = KSRTC_DATA.map((d) => ({
    fy: d.fy.slice(0, 4),
    Revenue: d.revenue,
    Expenses: d.expenses,
    "Net P&L": d.netPL,
    party: d.party,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
          <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 11 }} tickLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#949AB3", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${Math.abs(v / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#949AB3", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${Math.abs(v / 1000).toFixed(1)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TTP_STYLE}
            formatter={(val: number, name: string) =>
              name === "Net P&L"
                ? [`−₹${Math.abs(val).toLocaleString("en-IN")} Cr`, name]
                : [`₹${val.toLocaleString("en-IN")} Cr`, name]
            }
          />
          <Legend wrapperStyle={{ color: "#949AB3", fontSize: 12 }} />
          <ReferenceLine yAxisId="right" y={0} stroke="#4B5563" strokeDasharray="4 4" />
          <Bar yAxisId="left" dataKey="Revenue" fill="#14F195" opacity={0.75} radius={[3, 3, 0, 0]} />
          <Bar yAxisId="left" dataKey="Expenses" fill="#FA5454" opacity={0.75} radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Net P&L"
            stroke="#FAC238"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. ACCUMULATED LOSS AREA CHART
══════════════════════════════════════════════════════════════ */
export function AccumulatedLossChart() {
  // Use official balance-sheet deficit where known (FY2005-06, FY2015-16, FY2023-24),
  // interpolate linearly between anchors for other years.
  const anchors: Record<string, number> = {
    "2005-06": 1618,
    "2015-16": 4217,
    "2023-24": 19370,
  };
  const data = KSRTC_DATA.map((d) => ({
    fy: d.fy.slice(0, 4),
    "Balance-Sheet Deficit": anchors[d.fy] ?? null,
  }));
  // Fill gaps with linear interpolation between anchors
  const keys = Object.keys(anchors);
  const allFYs = KSRTC_DATA.map((d) => d.fy);
  keys.forEach((startKey, ki) => {
    const endKey = keys[ki + 1];
    if (!endKey) return;
    const si = allFYs.indexOf(startKey);
    const ei = allFYs.indexOf(endKey);
    const sv = anchors[startKey];
    const ev = anchors[endKey];
    for (let i = si + 1; i < ei; i++) {
      const t = (i - si) / (ei - si);
      data[i]["Balance-Sheet Deficit"] = Math.round(sv + t * (ev - sv));
    }
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FA5454" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#FA5454" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
          <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 11 }} tickLine={false} />
          <YAxis
            tick={{ fill: "#949AB3", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k Cr`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TTP_STYLE}
            formatter={(v: number) => [crFmt(v), "Balance-Sheet Deficit"]}
          />
          <Area
            type="monotone"
            dataKey="Balance-Sheet Deficit"
            stroke="#FA5454"
            strokeWidth={2}
            fill="url(#lossGrad)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. POLITICAL PARTY COMPARISON BAR CHART
══════════════════════════════════════════════════════════════ */
export function PartyComparisonChart() {
  const ldfData = LDF_YEARS.map((d) => ({
    fy: d.fy.slice(0, 4),
    Loss: Math.abs(d.netPL),
    party: "LDF",
  }));
  const udfData = UDF_YEARS.map((d) => ({
    fy: d.fy.slice(0, 4),
    Loss: Math.abs(d.netPL),
    party: "UDF",
  }));

  const ldfAvg = avg(LDF_YEARS.map((d) => Math.abs(d.netPL)));
  const udfAvg = avg(UDF_YEARS.map((d) => Math.abs(d.netPL)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "LDF Avg Annual Loss",
            val: ldfAvg,
            color: PARTY_COLORS.LDF,
            years: LDF_YEARS.length,
          },
          {
            label: "UDF Avg Annual Loss",
            val: udfAvg,
            color: PARTY_COLORS.UDF,
            years: UDF_YEARS.length,
          },
        ].map((p) => (
          <div
            key={p.label}
            className="rounded-xl border p-4 text-center"
            style={{ background: "var(--card)", borderColor: p.color + "44" }}
          >
            <div className="text-2xl font-black" style={{ color: p.color }}>
              ₹{p.val.toFixed(0)} Cr
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              {p.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              ({p.years} fiscal years)
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={[...ldfData, ...udfData].sort((a, b) =>
              parseInt(a.fy) - parseInt(b.fy)
            )}
            margin={{ top: 4, right: 4, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
            <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 10 }} tickLine={false} />
            <YAxis
              tick={{ fill: "#949AB3", fontSize: 10 }}
              tickFormatter={(v: number) => `₹${v}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={TTP_STYLE}
              formatter={(v: number, _: string, entry: { payload: { party: string } }) => [
                `₹${v} Cr`,
                `${entry.payload.party} Annual Loss`,
              ]}
            />
            <ReferenceLine y={ldfAvg} stroke={PARTY_COLORS.LDF} strokeDasharray="4 4" label={{ value: "LDF avg", fill: PARTY_COLORS.LDF, fontSize: 10 }} />
            <ReferenceLine y={udfAvg} stroke={PARTY_COLORS.UDF} strokeDasharray="4 4" label={{ value: "UDF avg", fill: PARTY_COLORS.UDF, fontSize: 10 }} />
            <Bar
              dataKey="Loss"
              radius={[3, 3, 0, 0]}
              fill="#9945FF"
              // colour bar per party
              label={false}
              // We colour individually via Cell but recharts Bar supports a direct fill function on newer versions
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   4. DIESEL PRICE vs NET LOSS CORRELATION
══════════════════════════════════════════════════════════════ */
export function DieselCorrelationChart() {
  const data = KSRTC_DATA.map((d) => ({
    fy: d.fy.slice(0, 4),
    "Diesel (₹/L)": d.dieselPricePerLitre,
    "Annual Loss": Math.abs(d.netPL),
    party: d.party,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
          <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 11 }} tickLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#FAC238", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${v}`}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#FA5454", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${v} Cr`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={TTP_STYLE} />
          <Legend wrapperStyle={{ color: "#949AB3", fontSize: 12 }} />
          <Bar yAxisId="right" dataKey="Annual Loss" fill="#FA5454" opacity={0.6} radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Diesel (₹/L)"
            stroke="#FAC238"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   5. STAFF & FLEET TRENDS
══════════════════════════════════════════════════════════════ */
export function WorkforceChart() {
  const data = KSRTC_DATA.map((d) => ({
    fy: d.fy.slice(0, 4),
    "Active Staff": d.staff,
    Pensioners: d.pensioners,
    Fleet: d.fleet,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
          <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 11 }} tickLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#949AB3", fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#00D9BB", fontSize: 11 }}
            domain={[4000, 8000]}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={TTP_STYLE} />
          <Legend wrapperStyle={{ color: "#949AB3", fontSize: 12 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Active Staff"
            stroke="#9945FF"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Pensioners"
            stroke="#FA6666"
            strokeWidth={2}
            dot={false}
          />
          <Bar yAxisId="right" dataKey="Fleet" fill="#00D9BB" opacity={0.5} radius={[2, 2, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   6. GOVT SUBVENTION vs LOSS (How much state money fills the gap)
══════════════════════════════════════════════════════════════ */
export function SubventionGapChart() {
  const data = KSRTC_DATA.map((d) => ({
    fy: d.fy.slice(0, 4),
    "Actual Loss": Math.abs(d.netPL),
    "Govt Subvention": d.govtSubvention,
    Uncovered: Math.abs(d.netPL) - d.govtSubvention,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292B3D" />
          <XAxis dataKey="fy" tick={{ fill: "#949AB3", fontSize: 11 }} tickLine={false} />
          <YAxis
            tick={{ fill: "#949AB3", fontSize: 11 }}
            tickFormatter={(v: number) => `₹${v} Cr`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={TTP_STYLE} formatter={(v: number, n: string) => [`₹${v} Cr`, n]} />
          <Legend wrapperStyle={{ color: "#949AB3", fontSize: 12 }} />
          <Bar dataKey="Govt Subvention" stackId="a" fill="#14F195" opacity={0.75} radius={[0, 0, 0, 0]} />
          <Bar dataKey="Uncovered" stackId="a" fill="#FA5454" opacity={0.75} radius={[3, 3, 0, 0]} />
          <Line type="monotone" dataKey="Actual Loss" stroke="#FAC238" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   7. INTERACTIVE YEAR SELECTOR — Year Detail Card
══════════════════════════════════════════════════════════════ */
export function YearDetailExplorer() {
  const [selectedFY, setSelectedFY] = useState(KSRTC_DATA[19].fy); // default 2019-20
  const row = KSRTC_DATA.find((d) => d.fy === selectedFY) ?? KSRTC_DATA[0];
  const partyColor = PARTY_COLORS[row.party];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {KSRTC_DATA.map((d) => (
          <button
            key={d.fy}
            onClick={() => setSelectedFY(d.fy)}
            className="text-xs px-2.5 py-1 rounded-full border transition-all"
            style={{
              borderColor:
                d.fy === selectedFY ? partyColor : "var(--card-border)",
              background:
                d.fy === selectedFY ? partyColor + "22" : "var(--card)",
              color: d.fy === selectedFY ? partyColor : "var(--muted-foreground)",
              fontWeight: d.fy === selectedFY ? 700 : 400,
            }}
          >
            {d.fy.slice(0, 4)}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedFY}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border p-5 space-y-4"
        style={{ background: "var(--card)", borderColor: partyColor + "44" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
              FY {row.fy}
            </h3>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              CM: {row.cm}
            </p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: partyColor + "22", color: partyColor }}
          >
            {row.party} Government
          </span>
        </div>

        {/* Financial grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Revenue", val: `₹${row.revenue} Cr`, color: "#14F195" },
            { label: "Expenses", val: `₹${row.expenses} Cr`, color: "#FA5454" },
            {
              label: "Net P&L",
              val: `−₹${Math.abs(row.netPL)} Cr`,
              color: "#FAC238",
            },
            {
              label: "Govt Subvention",
              val: `₹${row.govtSubvention} Cr`,
              color: "#9945FF",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border p-3"
              style={{ borderColor: m.color + "33", background: m.color + "0D" }}
            >
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {m.label}
              </div>
              <div className="text-base font-black mt-0.5" style={{ color: m.color }}>
                {m.val}
              </div>
            </div>
          ))}
        </div>

        {/* Operational grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: "Fleet", val: `${row.fleet.toLocaleString("en-IN")} buses` },
            {
              label: "Active Staff",
              val: `${(row.staff / 1000).toFixed(1)}k`,
            },
            {
              label: "Pensioners",
              val: `${(row.pensioners / 1000).toFixed(1)}k`,
            },
            { label: "Diesel Price", val: `₹${row.dieselPricePerLitre}/L` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border p-3" style={{ borderColor: "var(--card-border)", background: "var(--bg-secondary)" }}>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {m.label}
              </div>
              <div className="font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                {m.val}
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Key Events
          </p>
          <ul className="space-y-1.5">
            {row.events.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: partyColor }} className="mt-0.5 shrink-0">
                  ▸
                </span>
                <span style={{ color: "var(--foreground)" }}>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {row.dataQuality === "official" && (
          <p className="text-xs" style={{ color: "#14F195" }}>
            ✓ Official — Kerala Planning Board Economic Review / CARE Ratings press release
          </p>
        )}
        {row.dataQuality === "semi-official" && (
          <p className="text-xs" style={{ color: "#FAC238" }}>
            ◑ Semi-official — CAG report excerpt / academic study citing KSRTC accounts
          </p>
        )}
        {row.dataQuality === "estimated" && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            ⚠ Estimated — interpolated from verified anchors; verify against KSRTC Annual Report
          </p>
        )}
      </motion.div>
    </div>
  );
}
