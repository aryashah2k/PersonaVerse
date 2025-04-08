export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          current_plan: string
          tokens_left: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          current_plan?: string
          tokens_left?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          current_plan?: string
          tokens_left?: number
        }
      }
      files: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          processed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          profile_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          processed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          profile_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          processed?: boolean
        }
      }
      personas: {
        Row: {
          id: string
          name: string
          job: string
          location: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          job: string
          location: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          job?: string
          location?: string
          image_url?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type File = Database['public']['Tables']['files']['Row']
export type Persona = Database['public']['Tables']['personas']['Row']
