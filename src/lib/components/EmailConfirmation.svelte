<script lang="ts">
  import { Button } from "$ui/button";
  import CircleCheck from "$lucide/circle-check.svelte";
  import type { Session } from "@supabase/supabase-js";
  export let session: Session | null;
</script>

<div class="flex flex-col items-center justify-center my-36">
  <CircleCheck class="w-16 h-16 text-green-500" />
  <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
    Verification <span class="text-blue-500 excludedText" data-svelte-h="svelte-6xrf68"
      >successful</span
    >.
  </div>
  <p
    class="max-w-xl my-4 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
    <!--
      When 'new_email' is not empty, it indicates that the
      user has requested to change their email and it has not been completed yet.
-->
    Your email has been verified. {!session?.user.new_email
      ? "Please attempt the previous action."
      : ""}
    {#if session?.user.new_email}
      Please proceed to
      <span class="font-bold text-white">verify the other email.</span>
    {/if}
  </p>
  <Button class="btn md:btn-lg md:w-fit variant-filled-primary" href="/">Go home</Button>
</div>
