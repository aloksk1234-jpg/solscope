import { Bus, TrendingDown, Building2, AlertTriangle, ExternalLink } from "lucide-react";
import {
  KSRTC_DATA, DEFICIT_FY24,
  WORST_YEAR, BEST_YEAR_RELATIVE,
  LDF_AVG_LOSS, UDF_AVG_LOSS, PARTY_COLORS,
} from "@/lib/ksrtc-data";
import {
  PLComboChart, DeficitChart, PartyChart,
  DieselChart, WorkforceChart, SubventionChart, YearExplorer,
} from "@/components/charts";
import DataTable from "@/components/table";

function KPI({ icon, label, value, sub, color = "#8B5CF6" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color+"22", color }}>{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color:"var(--muted)" }}>{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs" style={{ color:"var(--muted)" }}>{sub}</p>}
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black">{title}</h2>
        {sub && <p className="text-sm mt-0.5" style={{ color:"var(--muted)" }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5 space-y-3" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color:"var(--muted)" }}>{title}</p>
      {children}
    </div>
  );
}

export default function Home() {
  const last = KSRTC_DATA[KSRTC_DATA.length - 1];

  return (
    <main className="min-h-screen" style={{ background:"var(--bg)" }}>

      {/* Nav */}
      <nav className="border-b px-6 lg:px-16 h-16 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md"
        style={{ borderColor:"var(--border)", background:"rgba(13,15,26,0.92)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"#F04545", color:"#fff" }}>
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm">KSRTC Kerala</span>
            <span className="text-xs ml-2" style={{ color:"var(--muted)" }}>P&amp;L Dashboard</span>
          </div>
        </div>
        <span className="text-xs" style={{ color:"var(--muted)" }}>FY 2000-01 → {last.fy}</span>
      </nav>

      <div className="px-6 lg:px-16 py-12 space-y-14 max-w-7xl mx-auto">

        {/* Hero */}
        <div className="space-y-5 fade-up">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor:"#F0454444", color:"#F04545", background:"#F0454411" }}>Public Sector Analysis</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor:"var(--border)", color:"var(--muted)" }}>Kerala, India</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black leading-tight">
            Kerala KSRTC<br />
            <span style={{ color:"#F04545" }}>Profit &amp; Loss</span><br />
            <span style={{ color:"var(--muted)", fontSize:"55%" }}>FY 2000-01 to FY 2023-24</span>
          </h1>

          <p className="max-w-2xl" style={{ color:"var(--muted)" }}>
            A 24-year forensic view of Kerala State Road Transport Corporation — annual revenue, expenses,
            net P&amp;L, government subventions, diesel costs, workforce trends, political context, and the
            key events that shaped each fiscal year.
          </p>

          <div className="max-w-2xl rounded-xl border p-4 flex items-start gap-3" style={{ borderColor:"#F5B73144", background:"#F5B73111" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color:"#F5B731" }} />
            <div className="text-xs space-y-1">
              <p className="font-bold" style={{ color:"#F5B731" }}>Data Transparency Notice</p>
              <p style={{ color:"var(--muted)" }}>
                Official figures (FY 2015-16, 2016-17, 2022-23, 2023-24) sourced from Kerala State Planning Board
                Economic Reviews and CARE Ratings press releases. FY 2014-15 from CAG Report No. 5 of 2018.
                Earlier years estimated from trend analysis — marked ⚠ throughout.
              </p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <Section title="At a Glance" sub="Key figures across all 24 fiscal years">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPI icon={<TrendingDown className="w-5 h-5"/>} label="Balance-Sheet Deficit" value={`₹${(DEFICIT_FY24/1000).toFixed(2)}k Cr`} sub="Official — CARE Ratings, Mar 2024" color="#F04545" />
            <KPI icon={<TrendingDown className="w-5 h-5"/>} label="Worst Year Loss" value={`₹${Math.abs(WORST_YEAR.netPL)} Cr`} sub={`FY ${WORST_YEAR.fy} (${WORST_YEAR.party})`} color="#F04545" />
            <KPI icon={<TrendingDown className="w-5 h-5"/>} label="Lowest-Ever Loss" value={`₹${Math.abs(BEST_YEAR_RELATIVE.netPL)} Cr`} sub={`FY ${BEST_YEAR_RELATIVE.fy}`} color="#F5B731" />
            <KPI icon={<Building2 className="w-5 h-5"/>} label="LDF Avg Annual Loss" value={`₹${Math.abs(LDF_AVG_LOSS).toFixed(0)} Cr`} sub={`${KSRTC_DATA.filter(d=>d.party==="LDF").length} fiscal years`} color="#EF4444" />
            <KPI icon={<Building2 className="w-5 h-5"/>} label="UDF Avg Annual Loss" value={`₹${Math.abs(UDF_AVG_LOSS).toFixed(0)} Cr`} sub={`${KSRTC_DATA.filter(d=>d.party==="UDF").length} fiscal years`} color="#3B82F6" />
            <KPI icon={<Bus className="w-5 h-5"/>} label="Loss-Making Years" value={`${KSRTC_DATA.filter(d=>d.netPL<0).length} / 24`} sub="Every year since FY 2000" color="#8B5CF6" />
          </div>
        </Section>

        <Section title="Revenue vs Expenses vs Net P&L" sub="Annual operating figures — ₹ Crore">
          <Card title="P&L Combo (Revenue / Expenses / Net Loss trend)"><PLComboChart /></Card>
        </Section>

        <Section title="Accumulated Balance-Sheet Deficit" sub="Anchored to 3 official data points — FY 2005-06, FY 2015-16, FY 2023-24">
          <Card title="Deficit trajectory (₹ Crore)"><DeficitChart /></Card>
        </Section>

        <Section title="LDF vs UDF — Who Lost More?" sub="Average annual losses during each coalition's tenure">
          <div className="rounded-2xl border p-5" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              {[
                { color:"#EF4444", label:"LDF", desc:"CPM-led Left Front (Nayanar 1996-01, Achuthanandan 2006-11, Pinarayi Vijayan 2016-26)" },
                { color:"#3B82F6", label:"UDF", desc:"Congress-led United Front (Antony 2001-04, Oommen Chandy 2004-06 & 2011-16)" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <span style={{ color:"var(--muted)" }}><strong style={{ color: p.color }}>{p.label}</strong> — {p.desc}</span>
                </div>
              ))}
            </div>
            <PartyChart />
            <p className="text-xs mt-3" style={{ color:"var(--subtle)" }}>* LDF&apos;s higher average partly reflects that more recent years carry larger losses (inflation, pay revisions, COVID, floods).</p>
          </div>
        </Section>

        <Section title="Diesel Price vs Annual Loss" sub="Every ₹1/litre rise costs KSRTC ~₹13 Cr/year in additional fuel spend">
          <Card title="Diesel ₹/litre (yellow line) vs Annual Loss ₹ Cr (red bars)"><DieselChart /></Card>
        </Section>

        <Section title="Workforce & Fleet Trends" sub="Pensioners overtook active staff in FY 2009-10 — a structural inflection point">
          <Card title="Active staff vs Pensioners vs Fleet size"><WorkforceChart /></Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label:"Pensioners > Active Staff", val:"FY 2009-10", sub:"Pension costs became the single largest expense", color:"#F04545" },
              { label:"Peak fleet", val:"~6,700 buses (2019)", sub:"Fleet contracted as old buses scrapped faster than new ones inducted", color:"#06C9B0" },
              { label:"Staff reduction 2000→2024", val:"~28% fewer", sub:"45k → 31k via VRS and attrition", color:"#8B5CF6" },
            ].map((i) => (
              <div key={i.label} className="rounded-xl border p-4" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
                <div className="text-xs uppercase tracking-wide mb-1" style={{ color:"var(--muted)" }}>{i.label}</div>
                <div className="text-lg font-black mb-1" style={{ color: i.color }}>{i.val}</div>
                <div className="text-xs" style={{ color:"var(--muted)" }}>{i.sub}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Government Subvention vs Uncovered Loss" sub="State fills part of the gap — the rest accumulates as debt">
          <Card title="Annual loss: subvention (green) vs uncovered gap (red)"><SubventionChart /></Card>
        </Section>

        <Section title="Year-by-Year Explorer" sub="Click any fiscal year for the full financial snapshot and events">
          <YearExplorer />
        </Section>

        <Section title="Full Data Table" sub="Sort any column · filter by party · click a row to expand events">
          <DataTable />
        </Section>

        <Section title="Why KSRTC Always Loses Money">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon:"👴", color:"#F04545", title:"1. Pension Time Bomb", body:"KSRTC's 1984 defined-benefit pension scheme covers 43,000+ retirees — more than its 31,000 active workers. Annual outflow: ₹864 Cr/year, paid directly by Kerala Treasury." },
              { icon:"🎟️", color:"#F5B731", title:"2. Fare vs Cost Gap", body:"Fares are a political decision revised far less often than costs rise. Cost-per-km has consistently exceeded earnings-per-km by ₹15-25." },
              { icon:"⛽", color:"#8B5CF6", title:"3. Diesel Price Sensitivity", body:"Fuel is the #2 cost after staff. Every ₹1/litre increase costs ~₹13 Cr/year. Diesel rose 6× from ₹15 (2001) to ₹91 (2024)." },
              { icon:"💸", color:"#F04545", title:"4. Pay Revision Spikes", body:"Kerala's periodic pay revision commissions each added 15-20% to the salary bill overnight. KSRTC absorbs these immediately; fare revisions lag by years." },
              { icon:"🚌", color:"#5B8EF5", title:"5. Private Competition", body:"Deregulated private buses and app-cabs eroded KSRTC's most profitable short-haul segments while it retained obligations on loss-making rural routes." },
              { icon:"🦠", color:"#06C9B0", title:"6. COVID-19 Shock", body:"FY 2020-21 was the worst year ever — lockdowns cut ridership to 175 Cr (from 380 Cr in 2019), forcing ₹961 Cr interest waiver + ₹3,194 Cr loan-to-equity conversion." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border p-5 space-y-2" style={{ background:"var(--card)", borderColor: c.color+"33" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.icon}</span>
                  <h3 className="font-black text-base" style={{ color: c.color }}>{c.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color:"var(--muted)" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Government Timeline">
          <div className="rounded-2xl border p-5 overflow-x-auto" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
            <div className="min-w-[640px]">
              <div className="flex">
                {[
                  { label:"E.K. Nayanar", term:"1996–2001", party:"LDF" as const, span:1 },
                  { label:"A.K. Antony", term:"2001–04", party:"UDF" as const, span:3 },
                  { label:"O. Chandy", term:"2004–06", party:"UDF" as const, span:2 },
                  { label:"V.S. Achuthanandan", term:"2006–11", party:"LDF" as const, span:5 },
                  { label:"Oommen Chandy", term:"2011–16", party:"UDF" as const, span:5 },
                  { label:"Pinarayi Vijayan", term:"2016–26", party:"LDF" as const, span:8 },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center px-2 py-3 border-r text-center"
                    style={{ flex:s.span, background: PARTY_COLORS[s.party]+"18", borderColor:"var(--border)" }}>
                    <span className="text-xs font-black" style={{ color: PARTY_COLORS[s.party] }}>{s.party}</span>
                    <span className="text-xs font-semibold mt-0.5 leading-tight">{s.label}</span>
                    <span className="text-xs mt-0.5" style={{ color:"var(--muted)" }}>{s.term}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Data Sources">
          <div className="rounded-2xl border p-5" style={{ background:"var(--card)", borderColor:"var(--border)" }}>
            <ul className="space-y-2 text-sm" style={{ color:"var(--muted)" }}>
              {[
                "CAG of India — Reports on State Finances, Kerala (Annual)",
                "Kerala Planning Board — Kerala Economic Review 2016 & 2017",
                "CARE Ratings — KSRTC Kerala Press Releases (Apr 2024, Apr 2025)",
                "Kerala Budget Documents — Finance Department, GoK",
                "PPAC India — Historical Diesel Retail Prices",
              ].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color:"var(--subtle)" }} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

      </div>

      <footer className="border-t mt-10 px-6 lg:px-16 py-6 text-center" style={{ borderColor:"var(--border)", color:"var(--subtle)" }}>
        <p className="text-xs">KSRTC Kerala P&amp;L Dashboard — FY 2000-01 to FY 2023-24 · Data from SPB, CARE Ratings, CAG of India</p>
      </footer>
    </main>
  );
}
