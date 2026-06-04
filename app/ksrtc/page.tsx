import Link from "next/link";
import { Bus, TrendingDown, Users, Fuel, Building, AlertTriangle, ExternalLink } from "lucide-react";
import {
  KSRTC_DATA,
  TOTAL_ANNUAL_LOSSES,
  DEFICIT_FY24,
  WORST_YEAR,
  BEST_YEAR_RELATIVE,
  LDF_AVG_LOSS,
  UDF_AVG_LOSS,
  PARTY_COLORS,
} from "@/lib/ksrtc-data";
import {
  PLComboChart,
  AccumulatedLossChart,
  PartyComparisonChart,
  DieselCorrelationChart,
  WorkforceChart,
  SubventionGapChart,
  YearDetailExplorer,
} from "@/components/ksrtc/ksrtc-charts";
import KSRTCTable from "@/components/ksrtc/ksrtc-table";

export const metadata = {
  title: "KSRTC Kerala — P&L Dashboard (2000–2024)",
  description:
    "Historical profit & loss analysis of Kerala State Road Transport Corporation with political context, key events, and financial drivers.",
};

/* ─── Small server-only stat card ─── */
function StatCard({
  icon,
  label,
  value,
  sub,
  color = "var(--sol-purple)",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-2"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: color + "22", color }}
      >
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
      <p className="text-2xl font-black" style={{ color }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function KSRTCDashboard() {
  const latestYear = KSRTC_DATA[KSRTC_DATA.length - 1];
  const totalYears = KSRTC_DATA.length;
  const lossYears = KSRTC_DATA.filter((d) => d.netPL < 0).length;

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      {/* ── Nav ── */}
      <nav
        className="border-b px-6 lg:px-16 py-0 flex items-center justify-between h-[68px] sticky top-0 z-20 backdrop-blur-md"
        style={{ borderColor: "var(--card-border)", background: "rgba(15,15,23,0.92)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-black"
              style={{ background: "var(--sol-purple)", color: "#0F0F17" }}
            >
              ◎
            </div>
            <span className="font-black text-sm tracking-tight" style={{ color: "var(--muted-foreground)" }}>
              SolScope
            </span>
          </Link>
          <span style={{ color: "var(--card-border)" }}>/</span>
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4" style={{ color: "#FA5454" }} />
            <span className="font-bold text-sm">KSRTC Kerala P&L Dashboard</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>FY 2000–01 to {latestYear.fy}</span>
        </div>
      </nav>

      <div className="px-6 lg:px-16 py-10 space-y-12 max-w-7xl mx-auto">

        {/* ── Hero ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border"
              style={{ borderColor: "#FA545444", color: "#FA5454", background: "#FA545411" }}
            >
              Public Sector Analysis
            </span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border"
              style={{ borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
            >
              Kerala, India
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">
            Kerala KSRTC
            <br />
            <span style={{ color: "#FA5454" }}>Profit & Loss</span> Dashboard
            <br />
            <span style={{ color: "var(--muted-foreground)", fontSize: "60%" }}>
              FY 2000-01 → FY 2023-24
            </span>
          </h1>
          <p className="max-w-2xl text-base" style={{ color: "var(--muted-foreground)" }}>
            A comprehensive 24-year view of Kerala State Road Transport
            Corporation&apos;s financial health — annual revenue, operating
            expenses, net P&L, government subventions, key events, and political
            context across LDF and UDF administrations.
          </p>

          {/* Data quality disclaimer */}
          <div
            className="rounded-xl border p-4 flex items-start gap-3 max-w-2xl"
            style={{ borderColor: "#FAC23844", background: "#FAC23811" }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FAC238" }} />
            <div className="text-xs space-y-1" style={{ color: "#FAC238" }}>
              <p className="font-bold">Data Transparency Notice</p>
              <p style={{ color: "var(--muted-foreground)" }}>
                Figures for FY 2018-19, 2019-20 and 2020-21 are sourced from
                official Kerala Budget documents and CAG reports. Earlier years
                are estimated from Kerala Economic Review trend data and media
                citations of official KSRTC reports. All estimates are marked ⚠
                in the table. We recommend cross-verifying with{" "}
                <a
                  href="https://cag.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  CAG of India
                </a>{" "}
                and{" "}
                <a
                  href="https://spb.kerala.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Kerala Planning Board
                </a>{" "}
                for authoritative numbers.
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary KPIs ── */}
        <Section title="At a Glance" subtitle="Key metrics across all 24 fiscal years">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              icon={<TrendingDown className="w-5 h-5" />}
              label="Balance-Sheet Deficit"
              value={`₹${(DEFICIT_FY24 / 1000).toFixed(2)}k Cr`}
              sub="Official CARE Ratings, Mar 2024"
              color="#FA5454"
            />
            <StatCard
              icon={<TrendingDown className="w-5 h-5" />}
              label="Worst Single Year"
              value={`₹${Math.abs(WORST_YEAR.netPL)} Cr`}
              sub={`FY ${WORST_YEAR.fy} (${WORST_YEAR.party})`}
              color="#FA6666"
            />
            <StatCard
              icon={<TrendingDown className="w-5 h-5" />}
              label="Best Relative Year"
              value={`₹${Math.abs(BEST_YEAR_RELATIVE.netPL)} Cr`}
              sub={`FY ${BEST_YEAR_RELATIVE.fy} — lowest loss`}
              color="#FAC238"
            />
            <StatCard
              icon={<Building className="w-5 h-5" />}
              label="LDF Avg Annual Loss"
              value={`₹${Math.abs(LDF_AVG_LOSS).toFixed(0)} Cr`}
              sub={`Across ${KSRTC_DATA.filter((d) => d.party === "LDF").length} yrs`}
              color={PARTY_COLORS.LDF}
            />
            <StatCard
              icon={<Building className="w-5 h-5" />}
              label="UDF Avg Annual Loss"
              value={`₹${Math.abs(UDF_AVG_LOSS).toFixed(0)} Cr`}
              sub={`Across ${KSRTC_DATA.filter((d) => d.party === "UDF").length} yrs`}
              color={PARTY_COLORS.UDF}
            />
            <StatCard
              icon={<Bus className="w-5 h-5" />}
              label="Loss-Making Years"
              value={`${lossYears}/${totalYears}`}
              sub="Every single FY since 2000"
              color="#9945FF"
            />
          </div>
        </Section>

        {/* ── Main P&L Chart ── */}
        <Section
          title="Revenue vs Expenses vs Net P&L"
          subtitle="Annual operating figures — all values ₹ Crore"
        >
          <ChartCard title="P&L Combo Chart (Revenue / Expenses / Net Loss trend)">
            <PLComboChart />
          </ChartCard>
        </Section>

        {/* ── Accumulated Loss ── */}
        <Section
          title="Accumulated Loss Trajectory"
          subtitle="Running total of losses — shows how the debt mountain has grown"
        >
          <ChartCard title="Cumulative Loss (₹ Crore) since FY 2000-01">
            <AccumulatedLossChart />
          </ChartCard>
        </Section>

        {/* ── Political Party Section ── */}
        <Section
          title="LDF vs UDF — Financial Performance"
          subtitle="How losses trended under each governing coalition"
        >
          <div
            className="rounded-2xl border p-5"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PARTY_COLORS.LDF }} />
                <span style={{ color: "var(--muted-foreground)" }}>
                  <strong style={{ color: PARTY_COLORS.LDF }}>LDF</strong> — CPM-led Left Democratic Front
                  (Nayanar 1996-2001, VS Achuthanandan 2006-2011, Pinarayi Vijayan 2016–present)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PARTY_COLORS.UDF }} />
                <span style={{ color: "var(--muted-foreground)" }}>
                  <strong style={{ color: PARTY_COLORS.UDF }}>UDF</strong> — Congress-led United Democratic Front
                  (A.K. Antony 2001-2004, Oommen Chandy 2004-2006 &amp; 2011-2016)
                </span>
              </div>
            </div>
            <PartyComparisonChart />
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
              * LDF&apos;s higher average loss is partly explained by more recent years having larger losses
              (inflation, pay revisions, COVID) — not purely policy performance.
              Context: LDF governed during the 2008 global oil shock, 2018 floods, and 2020-21 COVID crisis.
            </p>
          </div>
        </Section>

        {/* ── Diesel Correlation ── */}
        <Section
          title="Fuel Price & Loss Correlation"
          subtitle="Diesel price is a major driver — every ₹1/litre rise costs KSRTC ~₹13 Cr annually"
        >
          <ChartCard title="Diesel ₹/litre vs Annual Loss (₹ Crore)">
            <DieselCorrelationChart />
          </ChartCard>
        </Section>

        {/* ── Workforce & Fleet ── */}
        <Section
          title="Workforce & Fleet Trends"
          subtitle="The pension burden: pensioners now outnumber active employees"
        >
          <ChartCard title="Active Staff vs Pensioners vs Fleet Size">
            <WorkforceChart />
          </ChartCard>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Pensioners exceeded active staff",
                val: "FY 2009-10",
                sub: "A structural inflection point — pension costs became KSRTC's single largest expense",
                color: "#FA5454",
              },
              {
                label: "Peak fleet",
                val: "~6,700 buses (2019)",
                sub: "Fleet has since contracted as old vehicles scrapped faster than new ones inducted",
                color: "#00D9BB",
              },
              {
                label: "Staff reduction (2000→2024)",
                val: "~28% fewer employees",
                sub: "From ~43,200 to ~30,800 via VRS, natural attrition — but pension rolls kept growing",
                color: "#9945FF",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border p-4"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>
                  {item.label}
                </div>
                <div className="text-lg font-black mb-1" style={{ color: item.color }}>
                  {item.val}
                </div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Subvention Gap ── */}
        <Section
          title="Government Subvention vs Uncovered Loss"
          subtitle="The state covers part of the loss via annual grants — the rest adds to accumulated debt"
        >
          <ChartCard title="Annual Loss breakdown: Subvention received vs Uncovered gap">
            <SubventionGapChart />
          </ChartCard>
        </Section>

        {/* ── Year Explorer ── */}
        <Section
          title="Year-by-Year Explorer"
          subtitle="Click any fiscal year to see its full financial snapshot and key events"
        >
          <YearDetailExplorer />
        </Section>

        {/* ── Full Data Table ── */}
        <Section
          title="Complete Data Table"
          subtitle="Sortable, filterable — click any row to expand key events"
        >
          <KSRTCTable />
        </Section>

        {/* ── Key Structural Insights ── */}
        <Section title="Structural Loss Drivers">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "1. Pension Time Bomb",
                body: "KSRTC was nationalised in 1965 and brought in thousands of employees on defined-benefit pensions. By FY 2009-10 pensioners exceeded active staff. Annual pension liability reached ₹1,000+ Cr by 2019, paid directly from Kerala State Treasury after KSRTC's own pension fund ran dry.",
                icon: "👴",
                color: "#FA5454",
              },
              {
                title: "2. Fare vs Cost Gap",
                body: "Fares are set by government (political decision) and historically revised far less often than costs rise. The cost per km (CPKM) has consistently exceeded earnings per km (EPKM) by ₹15–25. The gap × 65 crore km/year = the annual operating loss.",
                icon: "🎟️",
                color: "#FAC238",
              },
              {
                title: "3. Diesel Price Sensitivity",
                body: "Fuel is KSRTC's second largest cost after staff. Every ₹1/litre increase in diesel costs the corporation roughly ₹13 crore per year. The 6× rise from ₹15 (2001) to ₹91 (2024) alone explains most of the loss trajectory.",
                icon: "⛽",
                color: "#9945FF",
              },
              {
                title: "4. Pay Revision Spikes",
                body: "Kerala's periodic pay revision commissions (7th, 8th, 9th, 10th) each triggered 15–20% salary jumps. KSRTC bears these hikes immediately while fare revisions lag by years. The 8th Pay Revision (2007-08) alone added ~₹120 Cr/year to the wage bill.",
                icon: "💸",
                color: "#FA6666",
              },
              {
                title: "5. Private Competition",
                body: "Deregulated private buses, contract carriages, and (from 2015) app-based cabs eroded KSRTC's short-to-medium haul ridership — its most profitable segments — while KSRTC retained the obligation to serve loss-making rural and thin-traffic routes.",
                icon: "🚌",
                color: "#6190FA",
              },
              {
                title: "6. COVID-19 Shock",
                body: "FY 2020-21 was the single worst year — lockdowns cut ridership to 175 crore passengers (from 380+ in 2019), forcing the state to inject ₹650+ Cr in emergency subventions. Salary defaults were narrowly avoided. Accumulated debt crossed ₹12,000 Cr.",
                icon: "🦠",
                color: "#00D9BB",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border p-5 space-y-2"
                style={{ background: "var(--card)", borderColor: item.color + "33" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="font-black text-base" style={{ color: item.color }}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Political Timeline ── */}
        <Section title="Government Timeline">
          <div
            className="rounded-2xl border p-5 overflow-x-auto"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <div className="min-w-[640px]">
              <div className="flex">
                {[
                  { label: "E.K. Nayanar (LDF)", span: 1, from: 2000, party: "LDF" as const, cm: "1996–2001" },
                  { label: "A.K. Antony (UDF)", span: 3, from: 2001, party: "UDF" as const, cm: "2001–2004" },
                  { label: "O. Chandy (UDF)", span: 2, from: 2004, party: "UDF" as const, cm: "2004–2006" },
                  { label: "VS Achuthanandan (LDF)", span: 5, from: 2006, party: "LDF" as const, cm: "2006–2011" },
                  { label: "Oommen Chandy (UDF)", span: 5, from: 2011, party: "UDF" as const, cm: "2011–2016" },
                  { label: "Pinarayi Vijayan (LDF)", span: 8, from: 2016, party: "LDF" as const, cm: "2016–present" },
                ].map((seg) => (
                  <div
                    key={seg.label}
                    className="flex flex-col items-center px-2 py-2 border-r text-center"
                    style={{
                      flex: seg.span,
                      background: PARTY_COLORS[seg.party] + "18",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <span
                      className="text-xs font-bold block"
                      style={{ color: PARTY_COLORS[seg.party] }}
                    >
                      {seg.party}
                    </span>
                    <span className="text-xs font-semibold mt-0.5 leading-tight" style={{ color: "var(--foreground)" }}>
                      {seg.label.split(" (")[0]}
                    </span>
                    <span className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {seg.cm}
                    </span>
                  </div>
                ))}
              </div>
              {/* Year ruler */}
              <div className="flex mt-1">
                {KSRTC_DATA.map((d) => (
                  <div key={d.fy} className="flex-1 text-center text-xs" style={{ color: "var(--muted)", minWidth: 0 }}>
                    <span style={{ display: d.year % 4 === 0 ? "inline" : "none" }}>
                      {d.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Sources ── */}
        <Section title="Data Sources & References">
          <div
            className="rounded-2xl border p-5 space-y-3"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
              {[
                {
                  label: "CAG of India — Reports on State Finances, Kerala (Annual)",
                  url: "https://cag.gov.in/en/audit-reports?state=Kerala",
                },
                {
                  label: "Kerala Planning Board — Kerala Economic Review (Annual)",
                  url: "https://spb.kerala.gov.in/kerala-economic-review",
                },
                {
                  label: "Kerala Budget Documents — Finance Department, GoK",
                  url: "https://finance.kerala.gov.in",
                },
                {
                  label: "Kerala Legislative Assembly — Starred/Unstarred Questions on KSRTC",
                  url: "https://www.niyamasabha.org",
                },
                {
                  label: "PPAC India — Historical Diesel Retail Prices",
                  url: "https://ppac.gov.in",
                },
              ].map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--muted)" }} />
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--sol-blue)" }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs pt-2 border-t" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
              This dashboard is intended for educational and research purposes. Verify critical
              figures against primary KSRTC Annual Reports before citing in formal documents.
            </p>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <footer
        className="border-t mt-10 px-6 lg:px-16 py-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
      >
        <p className="text-xs">KSRTC Kerala P&amp;L Dashboard — FY 2000-01 to 2023-24</p>
        <Link href="/" className="text-xs hover:underline" style={{ color: "var(--sol-blue)" }}>
          ← Back to SolScope
        </Link>
      </footer>
    </main>
  );
}
