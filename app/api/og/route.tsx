import { ImageResponse } from "next/og";

export const runtime = "edge";

// GET /api/og?address=...&total=...&sol=...&tokens=...&nfts=...&grade=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const address = searchParams.get("address") ?? "Unknown";
  const total = parseFloat(searchParams.get("total") ?? "0");
  const sol = parseFloat(searchParams.get("sol") ?? "0");
  const tokens = parseInt(searchParams.get("tokens") ?? "0", 10);
  const nfts = parseInt(searchParams.get("nfts") ?? "0", 10);
  const grade = searchParams.get("grade") ?? "?";

  // Truncate address
  const shortAddr =
    address.length > 16
      ? `${address.slice(0, 8)}...${address.slice(-6)}`
      : address;

  // Grade color
  const gradeColor =
    grade === "A"
      ? "#00d4aa"
      : grade === "B"
        ? "#3B82F6"
        : grade === "C"
          ? "#F59E0B"
          : grade === "D"
            ? "#F97316"
            : "#f43f5e";

  const formattedTotal =
    total >= 1_000_000
      ? `$${(total / 1_000_000).toFixed(2)}M`
      : total >= 1_000
        ? `$${(total / 1_000).toFixed(1)}K`
        : `$${total.toFixed(2)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0f1e",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(0,212,170,0.08)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "200px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(153,69,255,0.06)",
            filter: "blur(60px)",
          }}
        />

        {/* Left panel */}
        <div
          style={{
            width: "360px",
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid #1e2d4a",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#00d4aa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#0a0f1e",
                }}
              >
                S
              </div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#e2e8f0",
                  letterSpacing: "-0.5px",
                }}
              >
                SolScope
              </span>
            </div>
            <span
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              Solana Wallet Analysis
            </span>
          </div>

          {/* Address */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#4a6080", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Wallet Address
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {shortAddr}
            </span>
          </div>
        </div>

        {/* Center panel */}
        <div
          style={{
            flex: 1,
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {/* Total value */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#4a6080", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total Portfolio Value
            </span>
            <span
              style={{
                fontSize: "72px",
                fontWeight: "900",
                color: "#e2e8f0",
                lineHeight: "1",
                letterSpacing: "-2px",
              }}
            >
              {formattedTotal}
            </span>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "SOL Balance", value: `${sol.toFixed(2)}`, unit: "SOL", color: "#9945FF" },
              { label: "Tokens", value: `${tokens}`, unit: "assets", color: "#00d4aa" },
              { label: "NFTs", value: `${nfts}`, unit: "items", color: "#F59E0B" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: "#0d1526",
                  border: "1px solid #1e2d4a",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#4a6080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: "22px", fontWeight: "800", color: stat.color }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{stat.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Health Grade */}
        <div
          style={{
            width: "200px",
            padding: "56px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            borderLeft: "1px solid #1e2d4a",
          }}
        >
          <span style={{ fontSize: "12px", color: "#4a6080", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Health
          </span>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: `4px solid ${gradeColor}`,
              background: `${gradeColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "900",
              color: gradeColor,
            }}
          >
            {grade}
          </div>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>Grade</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
