<script lang="ts">
  import { onMount } from "svelte";
  import "../app.pcss";
  import { onNavigate } from "$app/navigation";
  import { invalidate } from "$app/navigation";
  import { ModeWatcher } from "mode-watcher";
  import { invalidateAll } from "$app/navigation";
  import Header from "$lib/components/Header.svelte";
  export let data;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onNavigate((navigation) => {
    // @ts-expect-error startViewTransition is a defined type
    if (!document.startViewTransition) {
      return;
    }

    return new Promise((resolve) => {
      // @ts-expect-error startViewTransition is a defined type
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (!newSession) {
        /**
         * Queue this as a task so the navigation won't prevent the
         * triggering function from completing
         */
        setTimeout(async () => {
          //          goto("/", { invalidateAll: true }); default refreshes, getting rid of url params
          await invalidateAll(); //so use this instead to invalidate but not remove params
        });
      }
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
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
