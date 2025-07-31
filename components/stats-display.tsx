"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, Target } from "lucide-react";
import { useStatsContext } from "@/components/stats-context";
import { COUNTRIES_DATA } from "@/constants/countries";

export function StatsDisplay() {
  const {
    stats,
    getTodayCount,
    getMostUsedCountry,
    totalGenerated,
    isLoading,
  } = useStatsContext();
  const mostUsedCountry = getMostUsedCountry();
  const todayCount = getTodayCount();

  const getCountryName = (code: string) => {
    return COUNTRIES_DATA.find((c) => c.code === code)?.name || code;
  };
  console.log({ stats, totalGenerated });
  return (
    <div
      className="flex items-center gap-4 text-sm text-muted-foreground"
      key={`stats-display-${totalGenerated}`} // Force re-render on value change
    >
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span
          className="font-medium text-foreground"
          data-stats-counter={totalGenerated}
        >
          {isLoading ? "..." : totalGenerated}
        </span>
        <span>generated</span>
        {!isLoading && (
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            title="Live updates enabled"
          />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span className="font-medium text-foreground">{todayCount}</span>
        <span>today</span>
      </div>
      {mostUsedCountry && (
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <Badge variant="secondary" className="text-xs">
            {getCountryName(mostUsedCountry.country)} ({mostUsedCountry.count})
          </Badge>
        </div>
      )}
    </div>
  );
}
