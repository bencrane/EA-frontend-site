// Database types matching Supabase schema

export type SystemStatus = 'draft' | 'live' | 'hidden';

export interface SystemAttributes {
  steps?: string[];
  tools?: string[];
  outputs?: string[];
  benefits?: string[];
  [key: string]: string[] | undefined;
}

export interface EASystem {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  long_description: string | null;
  category: string;
  status: SystemStatus;
  order_index: number;
  hero_image_url: string | null;
  attributes: SystemAttributes;
  created_at: string;
  updated_at: string;
}

export interface EASystemInsert {
  slug: string;
  title: string;
  short_description?: string | null;
  long_description?: string | null;
  category?: string;
  status?: SystemStatus;
  order_index?: number;
  hero_image_url?: string | null;
  attributes?: SystemAttributes;
}

export interface EASystemUpdate {
  slug?: string;
  title?: string;
  short_description?: string | null;
  long_description?: string | null;
  category?: string;
  status?: SystemStatus;
  order_index?: number;
  hero_image_url?: string | null;
  attributes?: SystemAttributes;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      ea_systems: {
        Row: EASystem;
        Insert: EASystemInsert;
        Update: EASystemUpdate;
      };
    };
  };
}
