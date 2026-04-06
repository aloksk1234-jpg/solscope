export const KNOWN_TOKENS: Record<string, { name: string; symbol: string; logoURI?: string }> = {
  So11111111111111111111111111111111111111112: {
    name: "Wrapped SOL",
    symbol: "SOL",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: "USD Coin",
    symbol: "USDC",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    name: "USDT",
    symbol: "USDT",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: {
    name: "Marinade staked SOL",
    symbol: "mSOL",
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: {
    name: "Jito Staked SOL",
    symbol: "JitoSOL",
    logoURI: "https://storage.googleapis.com/token-metadata/JitoSOL-200.png",
  },
  bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1: {
    name: "BlazeStake Staked SOL",
    symbol: "bSOL",
  },
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": {
    name: "Lido Staked SOL",
    symbol: "stSOL",
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    name: "Bonk",
    symbol: "BONK",
    logoURI: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
  },
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": {
    name: "Raydium",
    symbol: "RAY",
  },
  orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE: {
    name: "Orca",
    symbol: "ORCA",
  },
  MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey: {
    name: "Marinade",
    symbol: "MNDE",
  },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: {
    name: "Jupiter",
    symbol: "JUP",
  },
  HZ1JovNiVvGrG3tRtqqFfQqcRPAGLJnf3cuCWK7rTMaD: {
    name: "Pyth Network",
    symbol: "PYTH",
  },
  WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk: {
    name: "Wen",
    symbol: "WEN",
  },
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs": {
    name: "Ethereum (Wormhole)",
    symbol: "ETH",
  },
  "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh": {
    name: "Wrapped Bitcoin (Wormhole)",
    symbol: "BTC",
  },
};

export const DEFI_PROTOCOLS: Record<string, { name: string; url: string; category: string }> = {
  marinade: {
    name: "Marinade Finance",
    url: "https://marinade.finance",
    category: "liquid-staking",
  },
  jito: {
    name: "Jito",
    url: "https://www.jito.network",
    category: "liquid-staking",
  },
  sanctum: {
    name: "Sanctum",
    url: "https://app.sanctum.so",
    category: "liquid-staking",
  },
  raydium: {
    name: "Raydium",
    url: "https://raydium.io",
    category: "dex",
  },
  orca: {
    name: "Orca",
    url: "https://www.orca.so",
    category: "dex",
  },
  jupiter: {
    name: "Jupiter",
    url: "https://jup.ag",
    category: "aggregator",
  },
  kamino: {
    name: "Kamino Finance",
    url: "https://app.kamino.finance",
    category: "lending",
  },
  marginfi: {
    name: "MarginFi",
    url: "https://app.marginfi.com",
    category: "lending",
  },
  drift: {
    name: "Drift Protocol",
    url: "https://app.drift.trade",
    category: "perps",
  },
  mango: {
    name: "Mango Markets",
    url: "https://app.mango.markets",
    category: "lending",
  },
  solend: {
    name: "Solend",
    url: "https://solend.fi/dashboard",
    category: "lending",
  },
  meteora: {
    name: "Meteora",
    url: "https://app.meteora.ag",
    category: "dex",
  },
};

export const LST_MINTS: string[] = [
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", // JitoSOL
  "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1", // bSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", // stSOL
  "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm", // INF (Sanctum Infinity)
  "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A", // hSOL
  "Jso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPnJ1", // placeholder
];

export const STABLE_MINTS: string[] = [
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX", // USDH
  "UXDHiXq7KCXFzKBvxiJF4o2rNqb9SdWn1LBLS1eZ2k", // UXD
  "9nEqaUcb16sQ3Tn1psbkWqyhPdLmfHWjKGymREjsAgTE", // WUST (legacy)
  "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o", // DAI (Wormhole)
  "Fr3W7NPVvdVbwMcHgA7Gx2wUxP7QL9dKfFSMVmKTtaWa", // FRAX (Wormhole)
];

/**
 * Symbol (uppercase) → primary token mint address.
 * Used by strategy engine to populate primaryTokenMint for Bags swap integration.
 */
export const SYMBOL_TO_MINT: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  WSOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  MSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
  JITOSOL: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
  BSOL: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
  STSOL: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  ORCA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
  MNDE: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
  PYTH: "HZ1JovNiVvGrG3tRtqqFfQqcRPAGLJnf3cuCWK7rTMaD",
  ETH: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
  BTC: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
};
