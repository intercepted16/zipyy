<script lang="ts">
  import { inview, type Options } from "svelte-inview";
  import { Skeleton } from "$ui/skeleton";
  export let options: Options = {};
  export let inview_enter: Function = () => {};
  let entered: boolean = false;
  let className = "";
  export { className as class };
  export let skeleton: { length: number; class: string | null } | null = null;
</script>

<div
  use:inview={options}
  class={className}
  on:inview_enter={async () => {
    inview_enter();
    entered = true;
  }}>
</div>

{#if entered}
  <slot />
{:else if skeleton}
  {#each { length: skeleton.length } as _}
    <Skeleton class={skeleton.class ?? ""}></Skeleton>
  {/each}
{/if}
