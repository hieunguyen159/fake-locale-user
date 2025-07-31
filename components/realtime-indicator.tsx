"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Wifi, WifiOff } from "lucide-react";

export function RealtimeIndicator() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Monitor connection status
    const handleStateChange = (state: string) => {
      setIsConnected(state === "SUBSCRIBED");
      if (state === "SUBSCRIBED") {
        setLastUpdate(new Date());
      }
    };

    // Create a test channel to monitor connection
    const channel = supabase
      .channel("connection-test")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stats" },
        () => {
          setLastUpdate(new Date());
        }
      )
      .subscribe(handleStateChange);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3 text-green-500" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-500" />
          <span>Offline</span>
        </>
      )}
      {lastUpdate && (
        <span className="text-[10px]">{lastUpdate.toLocaleTimeString()}</span>
      )}
    </div>
  );
}
