import Link from "next/link";
import SearchBar from "@/components/search-bar";
import { BarChart3, Brain, Shield, Zap, Users } from "lucide-react";

const EXAMPLE_WALLETS = [
  { label: "Ansem.sol", value: "ans3uQ7nPVFBVtmCa89zjGt98QbFBKviJhRVb5TtGp2" },
  { label: "Superteam.sol", value: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1" },
];

const STATS = [
  { value: "$2.8B+", label: "TVL Tracked" },
  { value: "150K+", label: "Wallets Analyzed" },
  { value: "40+", label: "DeFi Protocols" },
  { value: "Real-time", label: "Yield Data" },
];

const FEATURES = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Portfolio Analysis",
    description: "Full token, NFT, and DeFi position breakdown with real-time prices from Helius + Jupiter.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "DeFi Strategies",
    description: "Risk-categorized yield recommendations from 40+ Solana protocols, powered by live DefiLlama data.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Wallet Health Score",
    description: "0–100 grade for diversification, DeFi utilization, and risk — with actionable improvement tips.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Bags Integration",
    description: "Trade via Bags.fm, track creator fees, and discover trending token launches on Solana.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden" style={{ background: "var(--background)" }}>
      {/* ── Navbar ── */}
      <nav
        className="border-b px-6 lg:px-20 py-0 flex items-center justify-between h-[72px] relative z-10"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-black"
            style={{ background: "var(--sol-purple)", color: "#0F0F17" }}
          >
            ◎
          </div>
          <span className="font-black text-lg tracking-tight gradient-text">SolScope</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/compare" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--muted-foreground)" }}>
              Compare
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--muted-foreground)" }}>
              Features
            </Link>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full btn-gradient"
            style={{ color: "#0F0F17" }}
          >
            <Users className="w-3.5 h-3.5" />
            Compare Wallets
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative flex flex-col items-center justify-center flex-1 px-4 py-28 text-center gap-8">
        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(153,69,255,0.15) 0%, rgba(20,241,149,0.05) 40%, transparent 70%)",
            animation: "pulse-glow 6s ease-in-out infinite",
          }}
        />

        {/* Badge */}
        <div
          className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border relative z-10"
          style={{
            background: "var(--card)",
            borderColor: "var(--card-border)",
            color: "var(--accent)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          DeBank for Solana
        </div>

        {/* Headline */}
        <div className="animate-fade-in-up-delay-1 flex flex-col gap-4 relative z-10">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
            style={{ color: "var(--foreground)" }}
          >
            Your Solana Portfolio,{" "}
            <span className="gradient-text">Decoded.</span>
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Paste a wallet address or{" "}
            <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: "var(--card)", color: "var(--accent)" }}>
              .sol
            </code>{" "}
            domain to instantly see portfolio breakdown, DeFi strategies, and a health score.
          </p>
        </div>

        {/* Search */}
        <div className="animate-fade-in-up-delay-2 w-full max-w-2xl relative z-10">
          <SearchBar />
        </div>

        {/* Example wallets */}
        <div className="animate-fade-in-up-delay-2 flex flex-wrap items-center justify-center gap-2 text-xs relative z-10">
          <span style={{ color: "var(--muted-foreground)" }}>Try:</span>
          {EXAMPLE_WALLETS.map((w) => (
            <a
              key={w.value}
              href={`/wallet/${w.value}`}
              className="px-3 py-1.5 rounded-full border font-mono transition-all hover:border-[var(--sol-purple)] hover:text-[var(--accent)]"
              style={{ borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
            >
              {w.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div
        className="animate-fade-in-up-delay-3 border-y py-10 px-6 lg:px-20"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-12">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black" style={{ color: "var(--accent)" }}>
                {s.value}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partners ── */}
      <div className="py-4 px-6 text-center text-xs font-medium" style={{ color: "var(--muted)" }}>
        Powered by&nbsp;&nbsp;Helius &nbsp;·&nbsp; Jupiter &nbsp;·&nbsp; DefiLlama &nbsp;·&nbsp; Bags.fm &nbsp;·&nbsp; Bonfida SNS
      </div>

      {/* ── Features ── */}
      <div id="features" className="animate-fade-in-up-delay-4 px-6 lg:px-20 pb-24 pt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="rounded-2xl border p-6 flex flex-col gap-3 card-hover relative overflow-hidden"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
                animationDelay: `${0.6 + i * 0.1}s`,
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "var(--gradient-sol)" }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(153,69,255,0.12)", color: "var(--sol-purple)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="border-t py-6 px-6 text-center"
        style={{ borderColor: "var(--card-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          SolScope is a read-only analytics tool. It never requests wallet access or private keys.
        </p>
      </footer>
    </main>
  );
}
