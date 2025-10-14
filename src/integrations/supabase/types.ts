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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          document_id: string
          embedding: string | null
          id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string | null
          document_id: string
          embedding?: string | null
          id?: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          document_id?: string
          embedding?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_classifications: {
        Row: {
          confidence: number | null
          document_id: string
          node_id: number
          source: string | null
        }
        Insert: {
          confidence?: number | null
          document_id: string
          node_id: number
          source?: string | null
        }
        Update: {
          confidence?: number | null
          document_id?: string
          node_id?: number
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_classifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_classifications_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          document_id: string
          tag: string
        }
        Insert: {
          document_id: string
          tag: string
        }
        Update: {
          document_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_texts: {
        Row: {
          content: string | null
          doc_id: string | null
          extracted_at: string | null
          summary: string | null
        }
        Insert: {
          content?: string | null
          doc_id?: string | null
          extracted_at?: string | null
          summary?: string | null
        }
        Update: {
          content?: string | null
          doc_id?: string | null
          extracted_at?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_texts_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          processing_status: string | null
          source_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          processing_status?: string | null
          source_type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          processing_status?: string | null
          source_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gazette_chunks: {
        Row: {
          chunk_index: number
          content: string
          embedding: string | null
          gazette_id: string
          id: string
        }
        Insert: {
          chunk_index: number
          content: string
          embedding?: string | null
          gazette_id: string
          id?: string
        }
        Update: {
          chunk_index?: number
          content?: string
          embedding?: string | null
          gazette_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gazette_chunks_gazette_id_fkey"
            columns: ["gazette_id"]
            isOneToOne: false
            referencedRelation: "gazettes"
            referencedColumns: ["id"]
          },
        ]
      }
      gazettes: {
        Row: {
          created_at: string
          extracted_text: string | null
          file_name: string
          file_url: string
          id: string
          processing_status: string
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          file_name: string
          file_url: string
          id?: string
          processing_status?: string
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          file_name?: string
          file_url?: string
          id?: string
          processing_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_gazettes: {
        Row: {
          created_at: string
          gazette_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gazette_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gazette_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_gazettes_gazette_id_fkey"
            columns: ["gazette_id"]
            isOneToOne: false
            referencedRelation: "gazettes"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_tenders: {
        Row: {
          created_at: string | null
          id: string
          tender_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tender_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tender_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_tenders_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomies: {
        Row: {
          country_id: number | null
          description: string | null
          id: number
          name: string
          version: string | null
        }
        Insert: {
          country_id?: number | null
          description?: string | null
          id?: number
          name: string
          version?: string | null
        }
        Update: {
          country_id?: number | null
          description?: string | null
          id?: number
          name?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxonomies_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomy_nodes: {
        Row: {
          code: string
          description: string | null
          id: number
          label: string
          level: number
          parent_id: number | null
          taxonomy_id: number
        }
        Insert: {
          code: string
          description?: string | null
          id?: number
          label: string
          level: number
          parent_id?: number | null
          taxonomy_id: number
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
          label?: string
          level?: number
          parent_id?: number | null
          taxonomy_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_nodes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taxonomy_nodes_taxonomy_id_fkey"
            columns: ["taxonomy_id"]
            isOneToOne: false
            referencedRelation: "taxonomies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          budget_display: string | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          created_at: string | null
          days_left: number | null
          deadline: string
          description: string | null
          id: string
          location: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_display?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          created_at?: string | null
          days_left?: number | null
          deadline: string
          description?: string | null
          id?: string
          location?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_display?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          created_at?: string | null
          days_left?: number | null
          deadline?: string
          description?: string | null
          id?: string
          location?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          gazette_id: string
          id: string
          similarity: number
        }[]
      }
      match_gazette_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          chunk_index: number
          content: string
          gazette_id: string
          id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
