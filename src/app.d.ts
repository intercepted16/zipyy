import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			supabaseAdmin: SupabaseClient;
			getSession(): Promise<Session | null>;
			userExists(email: string): Promise<boolean>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
