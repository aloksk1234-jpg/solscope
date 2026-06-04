"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  Area, AreaChart,
} from "recharts";
import { KSRTC_DATA, PARTY_COLORS, LDF_YEARS, UDF_YEARS, avg } from "@/lib/ksrtc-data";

const TTP: React.CSSProperties = {
  background: "#181B2E", border: "1px solid #252840", borderRadius: 10,
  color: "#F0F0F8", fontSize: 12, padding: "10px 14px",
};

export function PLComboChart() {
  const data = KSRTC_DATA.map(d => ({ fy: d.fy.slice(0,4), Revenue: d.revenue, Expenses: d.expenses, "Net P&L": d.netPL }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
        <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:11 }} tickLine={false} />
        <YAxis yAxisId="l" tick={{ fill:"#8B90AC", fontSize:11 }} tickFormatter={(v:number) => `₹${(Math.abs(v)/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={{ fill:"#8B90AC", fontSize:11 }} tickFormatter={(v:number) => `₹${(Math.abs(v)/1000).toFixed(1)}k`} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TTP} />
        <Legend wrapperStyle={{ color:"#8B90AC", fontSize:12 }} />
        <ReferenceLine yAxisId="r" y={0} stroke="#555A75" strokeDasharray="4 4" />
        <Bar yAxisId="l" dataKey="Revenue" fill="#10D97C" opacity={0.75} radius={[3,3,0,0]} />
        <Bar yAxisId="l" dataKey="Expenses" fill="#F04545" opacity={0.75} radius={[3,3,0,0]} />
        <Line yAxisId="r" type="monotone" dataKey="Net P&L" stroke="#F5B731" strokeWidth={2.5} dot={false} activeDot={{ r:5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function DeficitChart() {
  const anchors: Record<string,number> = { "2005-06":1618, "2015-16":4217, "2023-24":19370 };
  const allFYs = KSRTC_DATA.map(d => d.fy);
  const filled: (number|null)[] = KSRTC_DATA.map(d => anchors[d.fy] ?? null);
  const keys = Object.keys(anchors);
  keys.forEach((sk,ki) => {
    const ek = keys[ki+1]; if (!ek) return;
    const si = allFYs.indexOf(sk), ei = allFYs.indexOf(ek);
    const sv = anchors[sk], ev = anchors[ek];
    for (let i = si+1; i < ei; i++) filled[i] = Math.round(sv + ((i-si)/(ei-si)) * (ev-sv));
  });
  const data = KSRTC_DATA.map((d,i) => ({ fy: d.fy.slice(0,4), Deficit: filled[i] }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
        <defs>
          <linearGradient id="defGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F04545" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#F04545" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
        <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:11 }} tickLine={false} />
        <YAxis tick={{ fill:"#8B90AC", fontSize:11 }} tickFormatter={(v:number) => `₹${(v/1000).toFixed(0)}k Cr`} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TTP} />
        <Area type="monotone" dataKey="Deficit" stroke="#F04545" strokeWidth={2} fill="url(#defGrad)" connectNulls />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PartyChart() {
  const ldfAvg = avg(LDF_YEARS.map(d => Math.abs(d.netPL)));
  const udfAvg = avg(UDF_YEARS.map(d => Math.abs(d.netPL)));
  const data = [...LDF_YEARS.map(d => ({ fy:d.fy.slice(0,4), Loss:Math.abs(d.netPL), party:"LDF" })),
                ...UDF_YEARS.map(d => ({ fy:d.fy.slice(0,4), Loss:Math.abs(d.netPL), party:"UDF" }))]
    .sort((a,b) => parseInt(a.fy) - parseInt(b.fy));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[{ label:"LDF Avg Annual Loss", val:ldfAvg, color:"#EF4444", n:LDF_YEARS.length },
          { label:"UDF Avg Annual Loss", val:udfAvg, color:"#3B82F6", n:UDF_YEARS.length }].map(p => (
          <div key={p.label} className="rounded-xl border p-4 text-center" style={{ borderColor:p.color+"44", background:p.color+"0D" }}>
            <div className="text-2xl font-black" style={{ color:p.color }}>₹{p.val.toFixed(0)} Cr</div>
            <div className="text-xs mt-1" style={{ color:"var(--muted)" }}>{p.label}</div>
            <div className="text-xs" style={{ color:"var(--subtle)" }}>({p.n} fiscal years)</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
          <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:10 }} tickLine={false} />
          <YAxis tick={{ fill:"#8B90AC", fontSize:10 }} tickFormatter={(v:number) => `₹${v}`} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TTP} />
          <ReferenceLine y={ldfAvg} stroke="#EF4444" strokeDasharray="4 4" label={{ value:"LDF avg", fill:"#EF4444", fontSize:10 }} />
          <ReferenceLine y={udfAvg} stroke="#3B82F6" strokeDasharray="4 4" label={{ value:"UDF avg", fill:"#3B82F6", fontSize:10 }} />
          <Bar dataKey="Loss" fill="#8B5CF6" opacity={0.75} radius={[3,3,0,0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DieselChart() {
  const data = KSRTC_DATA.map(d => ({ fy:d.fy.slice(0,4), "Diesel (₹/L)":d.dieselPricePerLitre, "Annual Loss":Math.abs(d.netPL) }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
        <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:11 }} tickLine={false} />
        <YAxis yAxisId="l" tick={{ fill:"#F5B731", fontSize:11 }} tickFormatter={(v:number) => `₹${v}`} tickLine={false} axisLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={{ fill:"#F04545", fontSize:11 }} tickFormatter={(v:number) => `₹${v} Cr`} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TTP} />
        <Legend wrapperStyle={{ color:"#8B90AC", fontSize:12 }} />
        <Bar yAxisId="r" dataKey="Annual Loss" fill="#F04545" opacity={0.6} radius={[3,3,0,0]} />
        <Line yAxisId="l" type="monotone" dataKey="Diesel (₹/L)" stroke="#F5B731" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function WorkforceChart() {
  const data = KSRTC_DATA.map(d => ({ fy:d.fy.slice(0,4), "Active Staff":d.staff, Pensioners:d.pensioners, Fleet:d.fleet }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
        <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:11 }} tickLine={false} />
        <YAxis yAxisId="l" tick={{ fill:"#8B90AC", fontSize:11 }} tickFormatter={(v:number) => `${(v/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={{ fill:"#06C9B0", fontSize:11 }} domain={[4000,8000]} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TTP} />
        <Legend wrapperStyle={{ color:"#8B90AC", fontSize:12 }} />
        <Line yAxisId="l" type="monotone" dataKey="Active Staff" stroke="#8B5CF6" strokeWidth={2} dot={false} />
        <Line yAxisId="l" type="monotone" dataKey="Pensioners" stroke="#F04545" strokeWidth={2} dot={false} />
        <Bar yAxisId="r" dataKey="Fleet" fill="#06C9B0" opacity={0.45} radius={[2,2,0,0]} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function SubventionChart() {
  const data = KSRTC_DATA.map(d => ({
    fy: d.fy.slice(0,4),
    "Govt Subvention": d.govtSubvention,
    Uncovered: Math.abs(d.netPL) - d.govtSubvention,
    "Total Loss": Math.abs(d.netPL),
  }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={data} margin={{ top:4, right:8, bottom:4, left:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
        <XAxis dataKey="fy" tick={{ fill:"#8B90AC", fontSize:11 }} tickLine={false} />
        <YAxis tick={{ fill:"#8B90AC", fontSize:11 }} tickFormatter={(v:number) => `₹${v} Cr`} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TTP} />
        <Legend wrapperStyle={{ color:"#8B90AC", fontSize:12 }} />
        <Bar dataKey="Govt Subvention" stackId="a" fill="#10D97C" opacity={0.75} />
        <Bar dataKey="Uncovered" stackId="a" fill="#F04545" opacity={0.75} radius={[3,3,0,0]} />
        <Line type="monotone" dataKey="Total Loss" stroke="#F5B731" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function YearExplorer() {
  const [fy, setFY] = useState(KSRTC_DATA[18].fy);
  const row = KSRTC_DATA.find(d => d.fy === fy) ?? KSRTC_DATA[0];
  const pc = PARTY_COLORS[row.party];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {KSRTC_DATA.map(d => (
          <button key={d.fy} onClick={() => setFY(d.fy)}
            className="text-xs px-2.5 py-1 rounded-full border transition-all"
            style={{ borderColor:d.fy===fy?pc:"var(--border)", background:d.fy===fy?pc+"22":"var(--card)", color:d.fy===fy?pc:"var(--muted)", fontWeight:d.fy===fy?700:400 }}>
            {d.fy.slice(0,4)}
          </button>
        ))}
      </div>
      <motion.div key={fy} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2 }}
        className="rounded-2xl border p-5 space-y-4" style={{ background:"var(--card)", borderColor:pc+"44" }}>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black">FY {row.fy}</h3>
            <p className="text-sm" style={{ color:"var(--muted)" }}>CM: {row.cm}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:pc+"22", color:pc }}>{row.party} Government</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Revenue", val:`₹${row.revenue} Cr`, color:"#10D97C" },
            { label:"Expenses", val:`₹${row.expenses} Cr`, color:"#F04545" },
            { label:"Net P&L", val:`−₹${Math.abs(row.netPL)} Cr`, color:"#F5B731" },
            { label:"Govt Subvention", val:`₹${row.govtSubvention} Cr`, color:"#8B5CF6" },
          ].map(m => (
            <div key={m.label} className="rounded-xl border p-3" style={{ borderColor:m.color+"33", background:m.color+"0D" }}>
              <div className="text-xs" style={{ color:"var(--muted)" }}>{m.label}</div>
              <div className="text-base font-black mt-0.5" style={{ color:m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label:"Fleet", val:`${row.fleet.toLocaleString("en-IN")} buses` },
            { label:"Active Staff", val:`${(row.staff/1000).toFixed(1)}k` },
            { label:"Pensioners", val:`${(row.pensioners/1000).toFixed(1)}k` },
            { label:"Diesel", val:`₹${row.dieselPricePerLitre}/L` },
          ].map(m => (
            <div key={m.label} className="rounded-xl border p-3" style={{ borderColor:"var(--border)", background:"var(--bg2)" }}>
              <div className="text-xs" style={{ color:"var(--muted)" }}>{m.label}</div>
              <div className="font-bold mt-0.5">{m.val}</div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color:"var(--muted)" }}>Key Events</p>
          <ul className="space-y-1.5">
            {row.events.map((e,i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color:pc }} className="mt-0.5 shrink-0">▸</span>
                <span style={{ color:"var(--fg)" }}>{e}</span>
              </li>
            ))}
          </ul>
        </div>
        {row.dataQuality==="official"
          ? <p className="text-xs" style={{ color:"#10D97C" }}>✓ Official — Kerala Planning Board / CARE Ratings</p>
          : row.dataQuality==="semi-official"
          ? <p className="text-xs" style={{ color:"#8B5CF6" }}>◑ Semi-official — CAG report / academic study</p>
          : <p className="text-xs" style={{ color:"var(--subtle)" }}>⚠ Estimated — interpolated from verified anchors</p>}
      </motion.div>
    </div>
  );
}
