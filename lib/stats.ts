import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface GenerationStats {
  totalGenerated: number;
  lastGenerated: string;
  countriesUsed: Record<string, number>;
  dailyStats: Record<string, number>;
}

// Default stats
const defaultStats: GenerationStats = {
  totalGenerated: 0,
  lastGenerated: "",
  countriesUsed: {},
  dailyStats: {},
};

// Supabase stats functions
export const supabaseStats = {
  // Get total generated count from Supabase
  getTotalGenerated: async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("stats")
        .select("stats_value")
        .eq("stats_name", "generated_counts")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists yet, return 0
        if (error.code === "PGRST116") {
          return 0;
        }
        console.error("Error fetching stats from Supabase:", error);
        return 0;
      }

      return data?.stats_value || 0;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return 0;
    }
  },

  // Increment generation count in Supabase using upsert
  incrementGenerated: async (): Promise<number> => {
    try {
      // Get current count
      const currentCount = await supabaseStats.getTotalGenerated();
      const newCount = currentCount + 1;

      // Upsert the generated_counts record
      const { data, error } = await supabase
        .from("stats")
        .upsert(
          {
            id: 1,
            stats_name: "generated_counts",
            stats_value: newCount,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        )
        .select("stats_value")
        .single();

      if (error) {
        console.error("Error updating stats in Supabase:", error);
        return currentCount;
      }

      return data?.stats_value || newCount;
    } catch (error) {
      console.error("Error incrementing stats:", error);
      return 0;
    }
  },

  // Get stats history (for charts/analytics later)
  getStatsHistory: async (
    limit = 30
  ): Promise<{ date: string; count: number }[]> => {
    try {
      const { data, error } = await supabase
        .from("stats")
        .select("created_at, stats_value")
        .eq("stats_name", "generated_counts")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching stats history:", error);
        return [];
      }

      return data.map((record) => ({
        date: record.created_at.split("T")[0],
        count: record.stats_value,
      }));
    } catch (error) {
      console.error("Error fetching stats history:", error);
      return [];
    }
  },
};

// Browser-side functions (localStorage + Supabase sync)
export const clientStats = {
  getStats: (): GenerationStats => {
    if (typeof window === "undefined") return defaultStats;

    try {
      const stored = localStorage.getItem("usermint-stats");
      return stored ? JSON.parse(stored) : defaultStats;
    } catch {
      return defaultStats;
    }
  },

  updateStats: async (countryCode: string): Promise<GenerationStats> => {
    if (typeof window === "undefined") return defaultStats;

    // Update local storage
    const stats = clientStats.getStats();
    const today = new Date().toISOString().split("T")[0];

    stats.totalGenerated += 1;
    stats.lastGenerated = new Date().toISOString();
    stats.countriesUsed[countryCode] =
      (stats.countriesUsed[countryCode] || 0) + 1;
    stats.dailyStats[today] = (stats.dailyStats[today] || 0) + 1;

    localStorage.setItem("usermint-stats", JSON.stringify(stats));

    // Sync with Supabase
    try {
      const supabaseCount = await supabaseStats.incrementGenerated();
      stats.totalGenerated = supabaseCount; // Use Supabase as source of truth for total
      localStorage.setItem("usermint-stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Failed to sync with Supabase:", error);
      // Continue with local stats if Supabase fails
    }

    return stats;
  },

  // Sync local stats with Supabase on app load
  syncWithSupabase: async (): Promise<GenerationStats> => {
    if (typeof window === "undefined") return defaultStats;

    try {
      const localStats = clientStats.getStats();
      const supabaseCount = await supabaseStats.getTotalGenerated();

      // Use Supabase count as source of truth, keep local metadata
      const syncedStats = {
        ...localStats,
        totalGenerated: Math.max(localStats.totalGenerated, supabaseCount),
      };

      localStorage.setItem("usermint-stats", JSON.stringify(syncedStats));
      return syncedStats;
    } catch (error) {
      console.error("Failed to sync with Supabase:", error);
      return clientStats.getStats();
    }
  },
};

// Real-time subscription management
const realtimeStats = {
  subscribeToStats: (callback: (newCount: number) => void): RealtimeChannel => {
    const channel = supabase
      .channel("stats-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "stats",
          filter: "stats_name=eq.generated_counts",
        },
        (payload) => {
          if (
            payload.new &&
            typeof payload.new === "object" &&
            "stats_value" in payload.new
          ) {
            const newCount = Number(payload.new.stats_value);
            callback(newCount);
          }
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
      });

    return channel;
  },

  unsubscribe: (channel: RealtimeChannel) => {
    supabase.removeChannel(channel);
  },
};

// Export everything needed
export { realtimeStats };
