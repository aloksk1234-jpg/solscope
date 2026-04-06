"use client";

import { useState, useEffect, useCallback } from "react";
import type { Portfolio } from "@/types";

const STORAGE_KEY = "solscope_wallets";
const MAX_WALLETS = 5;

export interface WalletEntry {
  address: string;
  addedAt: number;
}

export interface WalletData {
  address: string;
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

interface MultiWalletManagerProps {
  onWalletsChange: (wallets: WalletData[]) => void;
}

export function useMultiWallet() {
  const [addresses, setAddresses] = useState<WalletEntry[]>([]);
  const [walletData, setWalletData] = useState<Map<string, WalletData>>(new Map());
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WalletEntry[];
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage when addresses change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses, loaded]);

  // Fetch portfolio for a single address
  const fetchPortfolio = useCallback(async (address: string) => {
    setWalletData((prev) => {
      const next = new Map(prev);
      next.set(address, { address, portfolio: null, loading: true, error: null });
      return next;
    });

    try {
      const res = await fetch(`/api/portfolio?address=${address}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const portfolio = (await res.json()) as Portfolio;
      setWalletData((prev) => {
        const next = new Map(prev);
        next.set(address, { address, portfolio, loading: false, error: null });
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setWalletData((prev) => {
        const next = new Map(prev);
        next.set(address, { address, portfolio: null, loading: false, error: message });
        return next;
      });
    }
  }, []);

  // Fetch all portfolios when addresses change
  useEffect(() => {
    if (!loaded) return;
    for (const entry of addresses) {
      if (!walletData.has(entry.address)) {
        fetchPortfolio(entry.address);
      }
    }
  }, [addresses, loaded, walletData, fetchPortfolio]);

  function addWallet(address: string): boolean {
    if (addresses.some((w) => w.address === address)) return false;
    if (addresses.length >= MAX_WALLETS) return false;
    setAddresses((prev) => [...prev, { address, addedAt: Date.now() }]);
    return true;
  }

  function removeWallet(address: string) {
    setAddresses((prev) => prev.filter((w) => w.address !== address));
    setWalletData((prev) => {
      const next = new Map(prev);
      next.delete(address);
      return next;
    });
  }

  function refreshWallet(address: string) {
    fetchPortfolio(address);
  }

  const wallets = addresses.map(
    (entry) =>
      walletData.get(entry.address) ?? {
        address: entry.address,
        portfolio: null,
        loading: true,
        error: null,
      }
  );

  return {
    wallets,
    loaded,
    canAddMore: addresses.length < MAX_WALLETS,
    addWallet,
    removeWallet,
    refreshWallet,
  };
}

// Component wrapper (for use as a render-prop-style component if needed)
export default function MultiWalletManager({ onWalletsChange }: MultiWalletManagerProps) {
  const { wallets } = useMultiWallet();

  useEffect(() => {
    onWalletsChange(wallets);
  }, [wallets, onWalletsChange]);

  return null;
}
