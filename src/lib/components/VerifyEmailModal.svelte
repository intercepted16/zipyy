<script lang="ts">
  import { SvelteComponent } from "svelte";

  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
  export let parent: SvelteComponent;
</script>

<div class="modal-example-form {cBase}">
  <header class={cHeader}>Verify your email</header>
  <article>Please check your email for a link to verify your account.</article>
  <footer class="modal-footer {parent.regionFooter}">
    <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
      >{parent.buttonTextCancel}</button
    >
    <button class="btn {parent.buttonPositive}" on:click={parent.onClose}
      >Okay</button
    >
  </footer>
</div>
