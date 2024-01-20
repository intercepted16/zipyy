<script lang="ts">
  import { url, shortened } from "../../routes/store";
  import type { SvelteComponent } from "svelte";

  export let parent: SvelteComponent;

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
</script>

<!-- @component Shortened URL custom component-->

<div class="modal-example-form {cBase}">
  <header class={cHeader}>Your shortened URL</header>
  <article>
    <div class="space-y-4">
      <span class="text-base font-bold leading-relaxed">
        Original:
        <a
          href={`https://${$url}`}
          class="text-sky-300 excludedText hover:underline">{$url}</a
        >
      </span>
      <br />
      <span class="text-base font-bold leading-relaxed">
        Shortened:
        <a
          class="text-sky-300 excludedText hover:underline"
          href={`https://sh.ps.ai/${$shortened}`}>{`sh.ps.ai/${$shortened}`}</a
        >
      </span>
    </div>
  </article>
  <!-- prettier-ignore -->
  <footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={parent.onClose}>Okay</button>
		</footer>
</div>
