<script lang="ts">
  import { onMount, beforeUpdate } from "svelte";
  import Header from "./Header.svelte";
  import "../lib/output.css";
  import { entries, userData } from "./store";
  import Footer from "../lib/components/Footer.svelte";
  import LoginModal from "../lib/components/LoginModal.svelte";
  import { onNavigate, goto } from "$app/navigation";
  export let data;
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
    console.log(data);
  });
  userData.set(data.userData);
  entries.set(data.entries);
</script>

<Header />

<main class="mb-16">
  <slot />
</main>

<div class="relative">
  <Footer />
</div>
<LoginModal></LoginModal>
