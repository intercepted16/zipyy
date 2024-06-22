<script lang="ts">
  import { Skeleton } from "$ui/skeleton";
  import { Button } from "$ui/button";
  import { type Session, type SupabaseClient } from "@supabase/supabase-js";
  export let supabase: SupabaseClient;
  export let session: Session | null;
</script>

<header
  class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex items-center h-14 max-w-screen-2xl">
    <div class="hidden mr-4 md:flex">
      <a href="/" class="flex items-center mr-6 space-x-2">
        <img src="/img/favicon.webp" alt="" class="w-8 h-8" />
        <span class="hidden font-bold sm:inline-block">zipyy</span></a>
    </div>
    {#await Promise.all( [import("$lib/components/Dropdowns/Theme/ThemeDropdown.svelte"), new Promise( (resolve) => setTimeout(resolve, 250) )] )}
      <div class="flex items-center justify-between flex-1 space-x-2 md:justify-end">
        {#each { length: 2 } as _}
          <Skeleton class="w-[108px] h-9" />
        {/each}
      </div>
    {:then [ThemeDropdown]}
      <div class="flex items-center justify-between flex-1 space-x-2 md:justify-end">
        {#if session}
          {#await import("$lib/components/Dropdowns/Account/AccountDropdown.svelte") then AccountDropdown}
            <AccountDropdown.default {session} {supabase} />
          {/await}
        {:else}
          <div class="mx-4 space-x-2">
            <Button href="/auth">Signup</Button>
            <Button href="/auth">Login</Button>
          </div>
        {/if}
        <nav class="flex items-center">
          <a href="/github" target="_blank" rel="noopener noreferrer">
            <div
              class="inline-flex items-center justify-center h-8 px-0 text-xs font-medium transition-colors rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-9">
              {#await import("$lucide/github.svelte") then Github}
                <Github.default class="w-5 h-5" />
              {/await}
              <span class="sr-only">GitHub</span>
            </div>
          </a>
          <svelte:component this={ThemeDropdown.default}></svelte:component>
        </nav>
      </div>
    {/await}
  </div>
</header>
