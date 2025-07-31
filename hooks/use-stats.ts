"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { clientStats, realtimeStats, type GenerationStats } from "@/lib/stats";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useStats() {
  const [stats, setStats] = useState<GenerationStats>({
    totalGenerated: 0,
    lastGenerated: "",
    countriesUsed: {},
    dailyStats: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load and sync stats on mount + setup real-time subscription
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        // Sync with Supabase first, then get local stats
        const syncedStats = await clientStats.syncWithSupabase();
        console.log("syncedStats", syncedStats);
        setStats(syncedStats);
      } catch (error) {
        // Fallback to local stats if sync fails
        const localStats = clientStats.getStats();
        setStats(localStats);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();

    // Setup real-time subscription
    const handleRealtimeUpdate = (newCount: number) => {
      setStats((prevStats) => {
        const newStats = {
          ...prevStats,
          totalGenerated: newCount,
          lastGenerated: new Date().toISOString(),
        };

        // Also update localStorage to keep in sync
        try {
          localStorage.setItem("usermint-stats", JSON.stringify(newStats));
        } catch (error) {
          console.error("Failed to update localStorage:", error);
        }

        return newStats;
      });
    };

    channelRef.current = realtimeStats.subscribeToStats(handleRealtimeUpdate);

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        realtimeStats.unsubscribe(channelRef.current);
      }
    };
  }, []);

  const incrementGeneration = async (countryCode: string) => {
    try {
      const updatedStats = await clientStats.updateStats(countryCode);
      setStats(updatedStats);
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  const getTodayCount = () => {
    const today = new Date().toISOString().split("T")[0];
    return stats.dailyStats[today] || 0;
  };

  const getMostUsedCountry = () => {
    const entries = Object.entries(stats.countriesUsed);
    if (entries.length === 0) return null;

    return entries.reduce(
      (max, [country, count]) => (count > max.count ? { country, count } : max),
      { country: entries[0][0], count: entries[0][1] }
    );
  };

  return {
    stats,
    incrementGeneration,
    getTodayCount,
    getMostUsedCountry,
    totalGenerated: stats.totalGenerated,
    isLoading,
  };
}
