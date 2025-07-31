import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface StatsRecord {
  id: number;
  created_at: string;
  stats_name: string;
  stats_value: number;
}

export type Database = {
  public: {
    Tables: {
      stats: {
        Row: StatsRecord;
        Insert: Omit<StatsRecord, "id" | "created_at">;
        Update: Partial<Omit<StatsRecord, "id" | "created_at">>;
      };
    };
  };
};
