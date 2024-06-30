import { SupabaseClient, Session, User } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      supabaseAdmin: SupabaseClient;
      getSession: () => Promise<Session | null>;
      user: User | null;
      userExists(email: string): Promise<boolean>;
    }
    interface PageData {
      session: Session | null;
    }
    // interface Error {}
    // interface PageState {}
    interface Platform {
      env?: {
        PUBLIC_SUPABASE_ANON_KEY: string;
        PUBLIC_SUPABASE_URL: string;
        PRIVATE_SUPABASE_SERVICE_ROLE_KEY: string;
      };
    }
  }
}

export {};
