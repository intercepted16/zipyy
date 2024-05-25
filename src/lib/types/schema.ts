export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      shortened_urls: {
        Row: {
          id: number;
          original: string | null;
          shortened: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          original?: string | null;
          shortened?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          original?: string | null;
          shortened?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shortened_urls_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_shortened_url: {
        Args: {
          original: string;
        };
        Returns: string;
      };
      delete_avatar: {
        Args: {
          avatar_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_storage_object: {
        Args: {
          bucket: string;
          object: string;
        };
        Returns: Record<string, unknown>;
      };
      email_exists: {
        Args: {
          email: string;
        };
        Returns: boolean;
      };
      set_user_metadata: {
        Args: {
          id: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
        };
        Returns: undefined;
      };
      shorten: {
        Args: {
          original: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

// Schema: public
// Tables
export type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
export type InsertProfiles = Database["public"]["Tables"]["profiles"]["Insert"];
export type UpdateProfiles = Database["public"]["Tables"]["profiles"]["Update"];

export type ShortenedUrls = Database["public"]["Tables"]["shortened_urls"]["Row"];
export type InsertShortenedUrls = Database["public"]["Tables"]["shortened_urls"]["Insert"];
export type UpdateShortenedUrls = Database["public"]["Tables"]["shortened_urls"]["Update"];

// Functions
export type ArgsCreateShortenedUrl =
  Database["public"]["Functions"]["create_shortened_url"]["Args"];
export type ReturnTypeCreateShortenedUrl =
  Database["public"]["Functions"]["create_shortened_url"]["Returns"];

export type ArgsDeleteAvatar = Database["public"]["Functions"]["delete_avatar"]["Args"];
export type ReturnTypeDeleteAvatar = Database["public"]["Functions"]["delete_avatar"]["Returns"];

export type ArgsDeleteStorageObject =
  Database["public"]["Functions"]["delete_storage_object"]["Args"];
export type ReturnTypeDeleteStorageObject =
  Database["public"]["Functions"]["delete_storage_object"]["Returns"];

export type ArgsEmailExists = Database["public"]["Functions"]["email_exists"]["Args"];
export type ReturnTypeEmailExists = Database["public"]["Functions"]["email_exists"]["Returns"];

export type ArgsSetUserMetadata = Database["public"]["Functions"]["set_user_metadata"]["Args"];
export type ReturnTypeSetUserMetadata =
  Database["public"]["Functions"]["set_user_metadata"]["Returns"];

export type ArgsShorten = Database["public"]["Functions"]["shorten"]["Args"];
export type ReturnTypeShorten = Database["public"]["Functions"]["shorten"]["Returns"];
