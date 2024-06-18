import { writable, type Writable } from "svelte/store";
import { dev } from "$app/environment";
import type { Database, ShortenedUrls } from "$types/database/schema";
import { createBrowserClient, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { indexedDBStore } from "$lib/utils";

const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
const session = (await supabase.auth.getSession()).data.session;

export const getUrlData = async () => {
  console.log("ran");
  if (!session) return [];
  return (
    (await supabase.from("shortened_urls").select().eq("user_id", session?.user.id)).data ?? []
  );
};

interface WritableReset<T> extends Writable<T> {
  reset: () => Promise<void>;
}

export const urlData: WritableReset<ShortenedUrls[]> | null =
  isBrowser() && session ? await indexedDBStore<ShortenedUrls>("shortened_urls", getUrlData) : null;

export const editDialog = writable(false);
export const invalidateUrlData = writable(false);
export const shortenedUrlsRoute = !dev ? "sh.ps.ai" : "/url";
export const id = writable(0);
