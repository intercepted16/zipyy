<script lang="ts">
  import { onMount } from "svelte";
  import "../app.pcss";
  import { onNavigate } from "$app/navigation";
  import type { AfterNavigate } from "@sveltejs/kit";
  import { afterNavigate } from "$app/navigation";
  import { invalidate } from "$app/navigation";
  import { ModeWatcher } from "mode-watcher";
  import Header from "$lib/components/Header.svelte";

  export let data;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  afterNavigate((params: AfterNavigate) => {
    const elemPage = document.querySelector("#page");
    if (elemPage !== null) {
      elemPage.scrollTop = 0;
    }
  });

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

  interface keyPair<T> {
    [key: string]: T;
  }

  function splitHashes(hashString: string) {
    const hashList: keyPair<string> = {};

    // Remove the leading '#' and split the hash string by '&'
    const hashPairs = hashString.slice(1).split("&");

    // Iterate through hash pairs and split them into key-value pairs
    hashPairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      hashList[key] = value;
    });

    return hashList;
  }

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<ModeWatcher />
<Header />
<main class="my-8">
  <slot />
</main>

<!-- <Footer /> -->
