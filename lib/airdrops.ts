import type { Portfolio } from "@/types";

export interface AirdropCriteria {
  id: string;
  project: string;
  logoColor: string;
  logoUrl?: string;
  description: string;
  status: "upcoming" | "active" | "ended";
  estimatedDate?: string;
  criteria: Array<{
    id: string;
    label: string;
    description: string;
    check: (portfolio: Portfolio) => boolean;
  }>;
  link: string;
}

// Known token mints
const MSOL_MINT = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
const JITOSOL_MINT = "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn";
const JUP_MINT = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
const BONK_MINT = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
const KUSDC_MINT = "FBSyPnxtHKLBZ4UeeUyAnbtFuAmTHLtso9YtsqRDRWpM";
const KSOL_MINT = "d4A2prbA2whesmvHaL88BH6Ewn5N4bTSU2Ze8P6Bc4Q";

// LST mints for generic checks
const LST_MINTS = [
  MSOL_MINT,
  JITOSOL_MINT,
  "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
  "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
  "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v",
];

export const AIRDROP_LIST: AirdropCriteria[] = [
  {
    id: "solana-defi-activity",
    project: "Solana DeFi Activity",
    logoColor: "#9945FF",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    description:
      "General DeFi participation reward for active Solana users with staked SOL positions.",
    status: "upcoming",
    estimatedDate: "Q3 2026",
    criteria: [
      {
        id: "holds-lst",
        label: "Holds a Liquid Staking Token",
        description: "Wallet contains mSOL, JitoSOL, bSOL, stSOL, or similar LSTs",
        check: (p) => p.tokens.some((t) => LST_MINTS.includes(t.mint)),
      },
      {
        id: "sol-balance",
        label: "Has at least 0.5 SOL",
        description: "Wallet native SOL balance is ≥ 0.5 SOL",
        check: (p) => p.solBalance >= 0.5,
      },
    ],
    link: "https://solana.com",
  },
  {
    id: "active-trader",
    project: "Active Trader Rewards",
    logoColor: "#3B82F6",
    logoUrl: "https://jup.ag/svg/jupiter-logo.svg",
    description:
      "Rewards for active Solana traders with diversified token portfolios worth over $100.",
    status: "upcoming",
    estimatedDate: "Q2 2026",
    criteria: [
      {
        id: "token-diversity",
        label: "Holds 5+ different tokens",
        description: "Wallet contains at least 5 distinct SPL tokens",
        check: (p) => p.tokens.length >= 5,
      },
      {
        id: "portfolio-value",
        label: "Portfolio value > $100",
        description: "Total portfolio USD value exceeds $100",
        check: (p) => p.totalUsdValue > 100,
      },
    ],
    link: "https://jup.ag",
  },
  {
    id: "kamino",
    project: "Kamino Finance",
    logoColor: "#00D4AA",
    logoUrl: "https://icons.llama.fi/icons/protocols/kamino.jpg",
    description:
      "Kamino protocol token airdrop for users who have deposited into Kamino lending vaults.",
    status: "upcoming",
    estimatedDate: "TBD",
    criteria: [
      {
        id: "holds-kusdc",
        label: "Holds kUSDC receipt token",
        description: "Wallet contains Kamino USDC deposit receipt tokens",
        check: (p) => p.tokens.some((t) => t.mint === KUSDC_MINT),
      },
      {
        id: "holds-ksol",
        label: "Holds kSOL receipt token",
        description: "Wallet contains Kamino SOL deposit receipt tokens",
        check: (p) => p.tokens.some((t) => t.mint === KSOL_MINT),
      },
    ],
    link: "https://app.kamino.finance",
  },
  {
    id: "marinade",
    project: "Marinade Finance",
    logoColor: "#F59E0B",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    description:
      "MNDE token rewards for long-term mSOL holders and Marinade staking participants.",
    status: "active",
    criteria: [
      {
        id: "holds-msol",
        label: "Holds mSOL",
        description: "Wallet contains Marinade staked SOL (mSOL)",
        check: (p) => p.tokens.some((t) => t.mint === MSOL_MINT),
      },
      {
        id: "msol-value",
        label: "mSOL position > $50",
        description: "mSOL holdings are worth at least $50",
        check: (p) => {
          const msol = p.tokens.find((t) => t.mint === MSOL_MINT);
          return (msol?.usdValue ?? 0) > 50;
        },
      },
    ],
    link: "https://marinade.finance",
  },
  {
    id: "jupiter",
    project: "Jupiter Exchange",
    logoColor: "#06B6D4",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png",
    description:
      "JUP token airdrop for Jupiter users holding JUP and participating in DAO governance.",
    status: "active",
    criteria: [
      {
        id: "holds-jup",
        label: "Holds JUP token",
        description: "Wallet contains Jupiter (JUP) tokens",
        check: (p) => p.tokens.some((t) => t.mint === JUP_MINT),
      },
      {
        id: "jup-value",
        label: "JUP position > $10",
        description: "JUP holdings are worth at least $10",
        check: (p) => {
          const jup = p.tokens.find((t) => t.mint === JUP_MINT);
          return (jup?.usdValue ?? 0) > 10;
        },
      },
    ],
    link: "https://jup.ag",
  },
  {
    id: "jito",
    project: "Jito Network",
    logoColor: "#EC4899",
    logoUrl: "https://storage.googleapis.com/token-metadata/JitoSOL-200.png",
    description:
      "JTO governance token rewards for JitoSOL stakers contributing to MEV redistribution.",
    status: "active",
    criteria: [
      {
        id: "holds-jitosol",
        label: "Holds JitoSOL",
        description: "Wallet contains Jito staked SOL (JitoSOL)",
        check: (p) => p.tokens.some((t) => t.mint === JITOSOL_MINT),
      },
      {
        id: "jitosol-value",
        label: "JitoSOL position > $100",
        description: "JitoSOL holdings are worth at least $100",
        check: (p) => {
          const jito = p.tokens.find((t) => t.mint === JITOSOL_MINT);
          return (jito?.usdValue ?? 0) > 100;
        },
      },
    ],
    link: "https://www.jito.network",
  },
  {
    id: "bonk",
    project: "BONK Ecosystem",
    logoColor: "#F97316",
    logoUrl: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    description:
      "BONK-related protocol rewards for holders participating in the BONK community ecosystem.",
    status: "upcoming",
    estimatedDate: "Q4 2026",
    criteria: [
      {
        id: "holds-bonk",
        label: "Holds BONK tokens",
        description: "Wallet contains BONK meme tokens",
        check: (p) => p.tokens.some((t) => t.mint === BONK_MINT),
      },
      {
        id: "bonk-amount",
        label: "Holds > 1M BONK",
        description: "Wallet contains more than 1,000,000 BONK tokens",
        check: (p) => {
          const bonk = p.tokens.find((t) => t.mint === BONK_MINT);
          return (bonk?.balance ?? 0) > 1_000_000;
        },
      },
    ],
    link: "https://bonkcoin.com",
  },
  {
    id: "nft-collector",
    project: "NFT Collector Rewards",
    logoColor: "#8B5CF6",
    logoUrl: "https://magiceden.io/img/magic_eden_full_logo_colored.png",
    description:
      "Rewards for active Solana NFT collectors with diverse NFT portfolios.",
    status: "upcoming",
    estimatedDate: "2026",
    criteria: [
      {
        id: "holds-nfts",
        label: "Holds 5+ NFTs",
        description: "Wallet contains at least 5 NFTs",
        check: (p) => p.nfts.length >= 5,
      },
      {
        id: "has-sol",
        label: "Has SOL to cover fees",
        description: "Wallet has at least 0.1 SOL for transaction fees",
        check: (p) => p.solBalance >= 0.1,
      },
    ],
    link: "https://magiceden.io",
  },
];
