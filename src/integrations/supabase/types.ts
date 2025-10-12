export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      events_timeline: {
        Row: {
          created_at: string
          event_date: string
          event_description: string | null
          event_name: string
          event_order: number | null
          event_time: string | null
          id: string
          invitation_id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_description?: string | null
          event_name: string
          event_order?: number | null
          event_time?: string | null
          id?: string
          invitation_id: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_description?: string | null
          event_name?: string
          event_order?: number | null
          event_time?: string | null
          id?: string
          invitation_id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_timeline_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_registry: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          invitation_id: string
          item_description: string | null
          item_name: string
          price: number | null
          priority: number | null
          purchased: boolean | null
          purchased_at: string | null
          purchased_by: string | null
          store_name: string | null
          store_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id: string
          item_description?: string | null
          item_name: string
          price?: number | null
          priority?: number | null
          purchased?: boolean | null
          purchased_at?: string | null
          purchased_by?: string | null
          store_name?: string | null
          store_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id?: string
          item_description?: string | null
          item_name?: string
          price?: number | null
          priority?: number | null
          purchased?: boolean | null
          purchased_at?: string | null
          purchased_by?: string | null
          store_name?: string | null
          store_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_registry_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_table_assignments: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          table_id: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          table_id: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_table_assignments_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: true
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_table_assignments_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          category: string | null
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          first_name: string
          id: string
          invitation_id: string
          invitation_sent: boolean | null
          invitation_sent_at: string | null
          last_name: string
          notes: string | null
          phone: string | null
          plus_one_allowed: boolean | null
          plus_one_name: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name: string
          id?: string
          invitation_id: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          plus_one_allowed?: boolean | null
          plus_one_name?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name?: string
          id?: string
          invitation_id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          plus_one_allowed?: boolean | null
          plus_one_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          custom_subdomain: string | null
          data: Json
          id: string
          password: string | null
          published_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          custom_subdomain?: string | null
          data?: Json
          id?: string
          password?: string | null
          published_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          custom_subdomain?: string | null
          data?: Json
          id?: string
          password?: string | null
          published_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      live_photo_wall: {
        Row: {
          created_at: string
          id: string
          invitation_id: string
          photo_url: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_id: string
          photo_url: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_id?: string
          photo_url?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_photo_wall_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          invitation_id: string | null
          recipient: string
          sent_at: string
          status: string
          subject: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          invitation_id?: string | null
          recipient: string
          sent_at?: string
          status: string
          subject?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          invitation_id?: string | null
          recipient?: string
          sent_at?: string
          status?: string
          subject?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_reminders: boolean
          email_rsvp_confirmations: boolean
          email_updates: boolean
          id: string
          reminder_days_before: number
          sms_reminders: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_reminders?: boolean
          email_rsvp_confirmations?: boolean
          email_updates?: boolean
          id?: string
          reminder_days_before?: number
          sms_reminders?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_reminders?: boolean
          email_rsvp_confirmations?: boolean
          email_updates?: boolean
          id?: string
          reminder_days_before?: number
          sms_reminders?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          dietary_restrictions: string | null
          email: string
          id: string
          invitation_id: string
          message: string | null
          name: string
          number_of_guests: number
          phone: string | null
          updated_at: string
          will_attend: string
        }
        Insert: {
          created_at?: string
          dietary_restrictions?: string | null
          email: string
          id?: string
          invitation_id: string
          message?: string | null
          name: string
          number_of_guests?: number
          phone?: string | null
          updated_at?: string
          will_attend: string
        }
        Update: {
          created_at?: string
          dietary_restrictions?: string | null
          email?: string
          id?: string
          invitation_id?: string
          message?: string | null
          name?: string
          number_of_guests?: number
          phone?: string | null
          updated_at?: string
          will_attend?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          invitation_id: string
          table_name: string | null
          table_number: number
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          invitation_id: string
          table_name?: string | null
          table_number: number
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          invitation_id?: string
          table_name?: string | null
          table_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan_type: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_plan: "basic" | "plus" | "premium"
      subscription_status: "active" | "canceled" | "expired" | "trialing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      subscription_plan: ["basic", "plus", "premium"],
      subscription_status: ["active", "canceled", "expired", "trialing"],
    },
  },
} as const
