<script lang="ts">
  import { onMount } from "svelte";
  import "../app.pcss";
  import { onNavigate } from "$app/navigation";
  import { invalidate } from "$app/navigation";
  import { ModeWatcher } from "mode-watcher";
  import Header from "$lib/components/Header.svelte";
  import type { Database } from "$lib/types/supabase";

  export let data;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onNavigate((navigation) => {
    // @ts-ignore
    if (!document.startViewTransition) {
      return;
    }

    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        const urlData: string | null = localStorage.getItem("urlData");
        if (urlData) localStorage.removeItem("urlData");
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<!--critical-->
<ModeWatcher />
<Header {supabase} {session} />
<main class="my-8">
  <slot />
</main>
