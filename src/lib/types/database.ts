import type { Database } from "./supabase";

export type urlData = Database["public"]["Tables"]["shortened_urls"]["Row"];
