export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      disease_detection_records: {
        Row: {
          confidence_score: number
          created_at: string
          crop_type: string
          detection_date: string
          disease_name: string
          id: string
          image_url: string | null
          notes: string | null
          treatment_recommendations: string | null
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          crop_type: string
          detection_date?: string
          disease_name: string
          id?: string
          image_url?: string | null
          notes?: string | null
          treatment_recommendations?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          crop_type?: string
          detection_date?: string
          disease_name?: string
          id?: string
          image_url?: string | null
          notes?: string | null
          treatment_recommendations?: string | null
          user_id?: string
        }
        Relationships: []
      }
      login_history: {
        Row: {
          device: string | null
          id: string
          location: string | null
          login_timestamp: string
          user_id: string
        }
        Insert: {
          device?: string | null
          id?: string
          location?: string | null
          login_timestamp?: string
          user_id: string
        }
        Update: {
          device?: string | null
          id?: string
          location?: string | null
          login_timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      soil_analysis_results: {
        Row: {
          created_at: string
          field_name: string
          id: string
          nitrogen_level: number
          notes: string | null
          organic_matter: number
          ph_level: number
          phosphorus_level: number
          potassium_level: number
          sample_date: string
          texture: string
          user_id: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          nitrogen_level: number
          notes?: string | null
          organic_matter: number
          ph_level: number
          phosphorus_level: number
          potassium_level: number
          sample_date: string
          texture: string
          user_id: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          nitrogen_level?: number
          notes?: string | null
          organic_matter?: number
          ph_level?: number
          phosphorus_level?: number
          potassium_level?: number
          sample_date?: string
          texture?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          theme: string | null
          units_system: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          units_system?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          units_system?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      yield_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          crop_type: string
          humidity: number
          id: string
          nitrogen: number
          organic_matter: number
          predicted_yield: number
          rainfall: number
          region: string
          soil_ph: number
          temperature: number
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          crop_type: string
          humidity: number
          id?: string
          nitrogen: number
          organic_matter: number
          predicted_yield: number
          rainfall: number
          region: string
          soil_ph: number
          temperature: number
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          crop_type?: string
          humidity?: number
          id?: string
          nitrogen?: number
          organic_matter?: number
          predicted_yield?: number
          rainfall?: number
          region?: string
          soil_ph?: number
          temperature?: number
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
