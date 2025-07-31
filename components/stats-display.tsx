"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, Target } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { COUNTRIES_DATA } from "@/constants/countries";

interface StatsDisplayProps {
  variant?: "compact" | "full";
}

export function StatsDisplay({ variant = "compact" }: StatsDisplayProps) {
  const {
    stats,
    getTodayCount,
    getMostUsedCountry,
    totalGenerated,
    isLoading,
  } = useStats();

  const mostUsedCountry = getMostUsedCountry();
  const todayCount = getTodayCount();

  const getCountryName = (code: string) => {
    return COUNTRIES_DATA.find((c) => c.code === code)?.name || code;
  };

  if (variant === "compact") {
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
              {getCountryName(mostUsedCountry.country)} ({mostUsedCountry.count}
              )
            </Badge>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      key={`stats-full-${totalGenerated}`} // Force re-render
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGenerated}</div>
          <p className="text-xs text-muted-foreground">All time generations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCount}</div>
          <p className="text-xs text-muted-foreground">Generated today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Used</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {mostUsedCountry ? (
            <>
              <div className="text-2xl font-bold">{mostUsedCountry.count}</div>
              <p className="text-xs text-muted-foreground">
                {getCountryName(mostUsedCountry.country)}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">No data yet</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
