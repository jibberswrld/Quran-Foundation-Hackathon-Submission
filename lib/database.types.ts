/**
 * Supabase generated-style types for public schema.
 * Keep in sync with supabase/migrations/*.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_goals: {
        Row: {
          user_id: string;
          goal_type: "finish_in_days" | "memorize_per_week";
          goal_value: number;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          goal_type: "finish_in_days" | "memorize_per_week";
          goal_value: number;
          started_at: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          goal_type?: "finish_in_days" | "memorize_per_week";
          goal_value?: number;
          started_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reading_progress: {
        Row: {
          user_id: string;
          last_verse_key: string;
          last_read_at: string;
          total_verses_read: number;
          streak_days: number;
          last_streak_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          last_verse_key: string;
          last_read_at: string;
          total_verses_read?: number;
          streak_days?: number;
          last_streak_date?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          last_verse_key?: string;
          last_read_at?: string;
          total_verses_read?: number;
          streak_days?: number;
          last_streak_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          verse_key: string;
          arabic_text: string;
          translation: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          verse_key: string;
          arabic_text: string;
          translation: string;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          verse_key?: string;
          arabic_text?: string;
          translation?: string;
          saved_at?: string;
        };
        Relationships: [];
      };
      reflections: {
        Row: {
          id: string;
          user_id: string;
          verse_key: string;
          body: string;
          saved_at: string;
          remote_post_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          verse_key: string;
          body: string;
          saved_at?: string;
          remote_post_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          verse_key?: string;
          body?: string;
          saved_at?: string;
          remote_post_id?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      delete_own_account: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
