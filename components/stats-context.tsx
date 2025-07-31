"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { clientStats, realtimeStats, type GenerationStats } from "@/lib/stats";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface StatsContextValue {
  stats: GenerationStats;
  incrementGeneration: (countryCode: string) => Promise<void>;
  getTodayCount: () => number;
  getMostUsedCountry: () => { country: string; count: number } | null;
  totalGenerated: number;
  isLoading: boolean;
}

const StatsContext = createContext<StatsContextValue | undefined>(undefined);

export default function StatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<GenerationStats>({
    totalGenerated: 0,
    lastGenerated: "",
    countriesUsed: {},
    dailyStats: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const syncedStats = await clientStats.syncWithSupabase();
        setStats(syncedStats);
      } catch (error) {
        const localStats = clientStats.getStats();
        setStats(localStats);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
    const handleRealtimeUpdate = (newCount: number) => {
      setStats((prevStats) => {
        const newStats = {
          ...prevStats,
          totalGenerated: newCount,
          lastGenerated: new Date().toISOString(),
        };
        try {
          localStorage.setItem("usermint-stats", JSON.stringify(newStats));
        } catch {}
        return newStats;
      });
    };
    channelRef.current = realtimeStats.subscribeToStats(handleRealtimeUpdate);
    return () => {
      if (channelRef.current) {
        realtimeStats.unsubscribe(channelRef.current);
      }
    };
  }, []);

  const incrementGeneration = useCallback(async (countryCode: string) => {
    try {
      const updatedStats = await clientStats.updateStats(countryCode);
      setStats(updatedStats);
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  }, []);

  const getTodayCount = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return stats.dailyStats[today] || 0;
  }, [stats.dailyStats]);

  const getMostUsedCountry = useCallback(() => {
    const entries = Object.entries(stats.countriesUsed);
    if (entries.length === 0) return null;
    return entries.reduce(
      (max, [country, count]) => (count > max.count ? { country, count } : max),
      { country: entries[0][0], count: entries[0][1] }
    );
  }, [stats.countriesUsed]);

  return (
    <StatsContext.Provider
      value={{
        stats,
        incrementGeneration,
        getTodayCount,
        getMostUsedCountry,
        totalGenerated: stats.totalGenerated,
        isLoading,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStatsContext() {
  const ctx = useContext(StatsContext);
  if (!ctx)
    throw new Error("useStatsContext must be used within a StatsProvider");
  return ctx;
}
