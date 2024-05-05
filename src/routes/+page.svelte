<script lang="ts">
  import { Button } from "$ui/button";
  import { shortenSchema as schema } from "$lib/schema";
  import type { ActionData } from "./$types";
  import Github from "$lucide/github.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import ChevronDown from "$lucide/chevron-down.svelte";
  import type { ComponentType } from "svelte";
  import { onMount, SvelteComponent } from "svelte";
  import { inview } from "svelte-inview";
  import { invalidateUrlData } from "$store";
  import { Skeleton } from "$ui/skeleton";

  export let data;
  export let form: ActionData;

  let Form: typeof import("$ui/form");

  type urlData = {
    id: number;
    original: string;
    shortened: string;
    user_id: string | null;
  };

  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  let open: boolean;
  let urlData: urlData[] = [];
  const superFrm = superForm(data.form, {
    validators: zodClient(schema),
    onUpdated: async ({ form }) => {
      console.log(form);
      if (!form.valid) return 1;
      Dialog = await import("$ui/dialog");
      open = true;
      $invalidateUrlData = true;
    }
  });

  if (session?.user.id) {
    onMount(() => {
      const unsubscribe = invalidateUrlData.subscribe(async (value) => {
        if (value) {
          // fetch data and reset the invalidation indicator
          urlData = (await supabase.from("shortened_urls").select().eq("user_id", session?.user.id))
            .data as urlData[];
          localStorage.setItem("urlData", JSON.stringify(urlData));
          invalidateUrlData.set(false);
        }
      });

      return unsubscribe;
    });
  }

  const { enhance, form: formData } = superFrm;
  let editForm: Awaited<typeof data.editForm>;
  let UrlTable: ComponentType<
    SvelteComponent<{ superFrm: typeof editForm; urlData: urlData[]; supabase: typeof supabase }>
  >;
  let Dialog: any;
</script>

<div class="flex flex-col items-center max-w-screen-xl mx-auto text-center">
  <a
    href="#top"
    class="inline-flex items-center justify-between px-1 py-1 pl-4 pr-4 text-sm text-gray-700 bg-gray-100 rounded-full mb-7 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
    <span class="text-sm font-medium">Signup for all features.</span>
    <ChevronDown class="w-4 h-4 mt-1 ml-2" />
  </a>
  <div class="container flex flex-col items-center justify-center p-4 mx-auto text-center">
    <div class="relative z-[1] space-y-6 pb-24">
      <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        The best <span class="text-green-500 excludedText">URL shortener</span>.
      </div>
      <p
        class="max-w-xl mb-8 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
        A no-nonsense, free, private URL shortener you can trust. No accounts, no limits, no bloat!
        Built using
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap">Flask</strong>,
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >Tailwind CSS</strong>
        &
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >JavaScript</strong
        >.
      </p>
      <div class="flex flex-wrap gap-3 md:justify-center md:space-x-3">
        <Button
          href="/source"
          class="w-full btn md:btn-lg md:w-fit variant-ringed-surface hover:variant-filled-secondary">
          <Github />
          View on Github
        </Button>
        <Button class="w-full btn md:btn-lg md:w-fit variant-filled-primary">Get started</Button>
      </div>
    </div>
  </div>
  <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
    <span class="font-semibold text-gray-400 uppercase excludedText">Really?</span>
    <div
      class="flex flex-wrap mt-8 text-gray-500 sm:justify-between *:flex *:items-center *:justify-center *:opacity-50 [&>*:hover]:opacity-100">
      <a
        href="https://bitly.com"
        class="mb-5 mr-5 text-black dark:text-white flex-center lg:mb-0 text-nowrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          id="bitly">
          <defs>
            <path id="a" d="M.014 48H48V0H.014z"></path>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(-403 -952)">
              <g transform="translate(403 952)">
                <mask id="b" fill="#fff">
                  <use xlink:href="#a"></use>
                </mask>
                <path
                  class="dark:fill-white fill-black"
                  d="M26.16 42.6c-2.694.048-4.658-.818-4.779-3.172-.045-.884-.03-1.824.013-2.392.26-3.44 2.666-5.915 5.04-6.39 2.954-.591 4.922.76 4.922 4.626 0 2.613-.726 7.25-5.196 7.329zM23.89 0C10.667 0 0 10.615 0 24.496c0 7.197 3.85 14.15 9.264 18.328 1.042.805 2.284.731 2.996.041.6-.58.55-1.98-.566-2.96-4.328-3.807-7.32-9.569-7.32-15.324 0-10.336 9.178-19.033 19.517-19.033 12.584 0 19.313 10.22 19.313 18.881 0 5.293-2.588 11.684-7.26 15.76.007-.019.97-1.913.97-5.603 0-6.28-3.98-9.683-8.597-9.683-3.343 0-5.344 1.195-6.706 2.31 0-2.559.085-7.336.085-7.336 0-3.154-1.104-5.678-4.955-5.733-2.228-.032-3.882.99-4.913 3.3-.372.868-.235 1.809.5 2.236.608.353 1.607.091 2.102-.57.33-.412.516-.5.803-.469.473.05.49.813.51 1.3.014.375.378 5.811.179 19.78 0 3.853 3.022 8.279 10.258 8.279 3.115 0 5.507-.87 8.982-2.845C40.452 42.149 48 35.482 48 24.206 48 10.116 36.59 0 23.89 0z"
                  mask="url(#b)"></path>
              </g>
            </g>
          </g>
        </svg>
      </a>
      <a
        href="#top"
        class="mb-5 mr-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400 opacity-80">
        <img alt="tinyurl" class="grayscale" src="/img/tinyurl.svg" />
      </a>
      <a href="#top" class="mb-5 mr-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
        <span class="ml-2 text-xl font-semibold">hi</span>
      </a>
    </div>
  </div>
</div>
<div
  class="mx-auto rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 dark:text-white dark:bg-gray-900">
  <div class="p-6 space-y-4 sm:p-8 dark:text-white">
    <h1
      class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Shorten a URL...
    </h1>
    <div
      use:inview={{ rootMargin: "-4px", unobserveOnEnter: true }}
      on:inview_enter={async () => {
        Form = await import("$ui/form");
      }}>
    </div>
    {#if Form}
      <div>
        <form method="POST" action="?/shorten" class="space-y-2" use:enhance>
          <Form.Field form={superFrm} name="url">
            <Form.Control let:attrs>
              <Form.Label>URL</Form.Label>
              <Input bind:value={$formData.url} {...attrs} />
              <Form.FieldErrors />
            </Form.Control>
          </Form.Field>

          {#if Dialog}
            <Dialog.Root bind:open>
              <Dialog.Trigger>hi</Dialog.Trigger>
              <Dialog.Content class="sm:max-w-[425px]">
                <Dialog.Header>
                  <Dialog.Title>Your shortened URL</Dialog.Title>
                </Dialog.Header>
                <div class="grid gap-4 py-4">
                  <div class="grid items-center gap-4">
                    <span
                      >Original: <a href={`https://${form?.original ?? "google.com"}`}
                        >{form?.original ?? "google.com"}</a
                      ></span>
                  </div>
                  <div class="grid items-center gap-4">
                    <span
                      >Shortened: <a href={`https://${form?.shortened ?? "sh.ps.ai/dma)F1"}`}
                        >{form?.shortened ?? "sh.ps.ai/dma)F1"}</a
                      ></span>
                  </div>
                </div>
                <Dialog.Footer>
                  <Button type="submit" class="mb-2 sm:mb-0 w-full" on:click={() => (open = false)}
                    >Okay
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          {/if}
          <Form.Button class="w-full">Shorten</Form.Button>
        </form>
      </div>
    {:else}
      {#each { length: 4 } as _}
        <Skeleton class="w-full h-8"></Skeleton>
      {/each}
    {/if}
  </div>
</div>
<!-- first check if theres a session in the first place,
if so, create a div to listen for intersection
when in view, (if in view), only for the first time,
fetch urls,
if its nothing, return
else dynamically import the url table,
which causes the other UrlTable if statement to rerender. -->
{#if session}
  <div
    class="mt-4"
    use:inview={{ unobserveOnEnter: true }}
    on:inview_enter={async () => {
      if (localStorage.getItem("urlData")) {
        //@ts-expect-error
        urlData = JSON.parse(localStorage.getItem("urlData"));
        console.log(typeof urlData);
      } else {
        //@ts-expect-error
        urlData = (await supabase.from("shortened_urls").select().eq("user_id", session?.user.id))
          .data;
        localStorage.setItem("urlData", JSON.stringify(urlData));
      }
      if (urlData.length < 0) return;
      // cache???
      UrlTable = (await import("$lib/components/UrlTable")).default;
    }}>
  </div>
  {#if UrlTable}
    {#await data.editForm then editForm}
      <svelte:component this={UrlTable} {urlData} superFrm={editForm} {supabase}></svelte:component>
    {/await}
  {:else}
    <div class="space-y-4 sm:px-0 px-4">
      {#each { length: 8 } as _}
        <Skeleton class="h-8 sm:max-w-md flex mx-auto" />
      {/each}
    </div>
  {/if}
{/if}
