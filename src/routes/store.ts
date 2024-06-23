import { writable, type Writable } from "svelte/store";
import type { Database, ShortenedUrls } from "$types/database/schema";
import { createBrowserClient, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { indexedDBStore } from "$lib/utils";
import { dev } from "$app/environment";

const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
const session = (await supabase.auth.getSession()).data.session;

export const getUrlData = async () => {
  if (!session) return [];
  // Here, JWT verification is necessary, so we use the `getUser()` function.
  const user = (await supabase.auth.getUser()).data.user;
  // Ignore null errors, as we already checked for the existence of session.
  return (await supabase.from("shortened_urls").select().eq("user_id", user!.id)).data ?? [];
};

interface WritableReset<T> extends Writable<T> {
  reset: () => Promise<void>;
}

export const urlData: WritableReset<ShortenedUrls[]> | null =
  isBrowser() && session ? await indexedDBStore<ShortenedUrls>("shortened_urls", getUrlData) : null;

export const editDialog = writable(false);
export const invalidateUrlData = writable(false);
//TODO: once I buy a domain, use that instead of /url
export const shortenedUrlsRoute = dev ? "localhost:3000/url" : "zipyy.vercel.app/url";
export const id = writable(0);
