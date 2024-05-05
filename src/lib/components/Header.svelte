<script lang="ts">
  import { type Session, type SupabaseClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let supabase: SupabaseClient;
  export let session: Session | null;
  let Button: Awaited<typeof import("$ui/button").Button>;
  let ThemeDropdown: Awaited<typeof import("$lib/components/ThemeDropdown.svelte").default>;

  onMount(async () => {
    await Promise.all([
      import("$ui/button").then((module) => (Button = module.Button)),
      import("$lib/components/ThemeDropdown.svelte").then(
        (module) => (ThemeDropdown = module.default)
      )
    ]);
  });
  let open: boolean = false;
</script>

<header
  class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex items-center h-14 max-w-screen-2xl">
    <div class="hidden mr-4 md:flex">
      <a href="/" class="flex items-center mr-6 space-x-2">
        <img src="/img/favicon.webp" alt="" class="w-8 h-8" />
        <span class="hidden font-bold sm:inline-block">shortly</span></a>
      <nav class="flex items-center gap-6 text-sm">
        <a href="/contact" class="transition-colors hover:text-foreground/80 text-foreground/60"
          >Contact</a>
        <a
          href="/docs/components"
          class="transition-colors hover:text-foreground/80 text-foreground/60">Components</a>
        <a href="/themes" class="transition-colors hover:text-foreground/80 text-foreground/60"
          >Themes</a>
        <a href="/examples" class="transition-colors hover:text-foreground/80 text-foreground/60"
          >Examples</a>
        <a
          href="https://github.com/huntabyte/shadcn-svelte"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden transition-colors text-foreground/60 hover:text-foreground/80 lg:block"
          >GitHub</a>
      </nav>
    </div>
    {#if Button && ThemeDropdown}
      <svelte:component this={Button} size="icon" variant="ghost" class="md:hidden">
        {#await import("$lucide/align-left.svelte") then AlignLeft}
          <AlignLeft.default />
        {/await}
        <span class="sr-only">Toggle Menu</span></svelte:component>
      <div
        class="flex items-center justify-between flex-1 space-x-2 md:justify-end"
        in:fade={{ duration: 250 }}>
        {#if session}
          {#await import("$lib/components/AccountDropdown.svelte") then AccountDropdown}
            <AccountDropdown.default {session} {supabase} />
          {/await}
        {:else}
          <div class="mx-4 space-x-2">
            <svelte:component this={Button} href="/auth">Signup</svelte:component>
            <svelte:component this={Button} href="/auth">Login</svelte:component>
          </div>
        {/if}
        <nav class="flex items-center">
          <a
            href="https://github.com/huntabyte/shadcn-svelte"
            target="_blank"
            rel="noopener noreferrer">
            <div
              class="inline-flex items-center justify-center h-8 px-0 text-xs font-medium transition-colors rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-9">
              {#await import("$lucide/github.svelte") then Github}
                <Github.default class="w-5 h-5" />
              {/await}
              <span class="sr-only">GitHub</span>
            </div>
          </a>
          <a href="https://twitter.com/huntabyte" target="_blank" rel="noreferrer">
            <div
              class="inline-flex items-center justify-center h-8 px-0 text-xs font-medium transition-colors rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-9">
              {#await import("$lucide/twitter.svelte") then Twitter}
                <Twitter.default class="w-5 h-5" />
              {/await}
              <span class="sr-only">X (formerly known as Twitter)</span>
            </div>
          </a>
          <svelte:component this={ThemeDropdown}></svelte:component>
        </nav>
      </div>
    {/if}
  </div>
</header>
