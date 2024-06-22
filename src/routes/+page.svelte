<script lang="ts">
  import LazyLoad from "$lib/components/LazyLoad";
  import { Input } from "$lib/components/ui/input";
  import { shortenSchema as schema } from "$types/validation/schema";
  import Github from "$lucide/github.svelte";
  import { urlData } from "$store";
  import { Button } from "$ui/button";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { ActionData } from "./$types";
  import ShortenedUrlDialog from "$lib/components/ShortenedUrlDialog.svelte";
  export let data;
  export let form: ActionData;
  import { anchorSmoothScroll } from "$lib/utils";

  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  let open: boolean;
  const superFrm = superForm(data.form, {
    validators: zodClient(schema),
    onUpdated: async ({ form }) => {
      if (!form.valid) return 1;
      open = true;
      if (urlData) await urlData.reset();
    }
  });
  const { enhance, form: formData } = superFrm;
</script>

<div class="flex flex-col items-center max-w-screen-xl mx-auto text-center">
  <div class="container flex flex-col items-center justify-center p-4 mx-auto text-center">
    <div class="relative z-[1] space-y-6 pb-24">
      <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        The best <span class="text-green-500 excludedText">URL shortener</span>.
      </div>
      <p
        class="max-w-xl mb-8 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
        A no-nonsense, free, private URL shortener you can trust. No accounts, no limits, no bloat!
        Built using
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap">Svelte</strong
        >,
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >Tailwind CSS</strong>
        &
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >Typescript</strong
        >.
      </p>
      <div class="flex flex-wrap gap-3 md:justify-center md:space-x-3">
        <Button
          href="/github"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full btn md:btn-lg md:w-fit variant-ringed-surface hover:variant-filled-secondary">
          <Github class="mr-1" />
          View on Github
        </Button>
        <Button
          class="w-full btn md:btn-lg md:w-fit variant-filled-primary"
          href="#shorten"
          on:click={anchorSmoothScroll}>Get started</Button>
      </div>
    </div>
  </div>
  <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
    <span class="font-semibold text-gray-400 uppercase excludedText">Really?</span>
    <div
      class="flex flex-wrap mt-8 text-gray-500 sm:justify-between *:flex *:items-center *:justify-center *:opacity-50 [&>*:hover]:opacity-100">
      <a
        href="https://bitly.com"
        target="_blank"
        rel="noopener noreferrer"
        class="mb-5 mr-5 text-black dark:text-white flex-center lg:mb-0 text-nowrap">
        <img alt="bitly" class="grayscale w-10 h-10" src="/img/bitly.svg" />
      </a>
      <a
        href="https://tinyurl.com"
        target="_blank"
        rel="noopener noreferrer"
        class="mb-5 mr-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400 opacity-80">
        <img alt="tinyurl" class="grayscale" src="/img/tinyurl.svg" />
      </a>
      <a
        href="https://shorturl.at"
        target="_blank"
        rel="noopener noreferrer"
        class="mb-5 mr-5 lg:mb-0 hover:none hover:text-gray-800 dark:hover:text-gray-400 no-hover-underline">
        <span
          class="text-center box-border text-decoration-none font-black text-[36px] font-[asap,arial] tracking-[-1px] break-words text-shadow-[0px 2px 2px #383b3d]"
          >shorturl.at</span>
      </a>
    </div>
  </div>
</div>
<div
  class="mx-auto rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:border-gray-700 dark:text-white dark:bg-gray-900 mt-2"
  id="shorten">
  <div class="p-6 space-y-4 sm:p-8 dark:text-white">
    <h1
      class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Shorten a URL...
    </h1>
    <LazyLoad
      options={{ rootMargin: "-4px", unobserveOnEnter: true }}
      skeleton={{ length: 4, class: "w-full h-8" }}>
      {#await import("$ui/form") then Form}
        <div>
          <form method="POST" action="?/shorten" class="space-y-2" use:enhance>
            <Form.Field form={superFrm} name="url">
              <Form.Control let:attrs>
                <Form.Label>URL</Form.Label>
                <Input bind:value={$formData.url} {...attrs} />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <ShortenedUrlDialog {form} {open} />
            <Form.Button class="w-full">Shorten</Form.Button>
          </form>
        </div>
      {/await}
    </LazyLoad>
  </div>
</div>
<!-- lazy load urlTable-->
{#if session && $urlData && $urlData.length > 0}
  <LazyLoad
    class="mt-4"
    options={{ unobserveOnEnter: true }}
    skeleton={{ length: 8, class: "h-8 sm:max-w-md flex mx-auto" }}>
    {#await import("$lib/components/UrlTable") then UrlTable}
      {#await data.editForm then editForm}
        <UrlTable.default superFrm={editForm} {supabase} />
      {/await}
    {/await}
  </LazyLoad>
{/if}
