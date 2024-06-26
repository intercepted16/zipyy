<script lang="ts">
  import { page } from "$app/stores";
  import CircleCheck from "$lucide/circle-check.svelte";
  import { Button } from "$ui/button";
  import { type EmailOtpType } from "@supabase/supabase-js";
  export let data;
  let { session } = data;
  $: ({ session } = data);
  const successType: EmailOtpType =
    ($page.url.searchParams.get("type") as EmailOtpType) ?? "confirmation";
  const successMessages = new Map<EmailOtpType, string>(
    Object.entries({
      signup: `Your account has been created successfully.`,
      confirmation: "Your email has been verified successfully.",
      // Render based on new email: "verified" if one email is verified, "updated" if both are verified (new_email is empty).
      email_change: `Your email has been ${session?.user.new_email ? "verified" : "updated"} successfully.`,
      recovery: "Your password has been updated successfully."
    }) as [EmailOtpType, string][]
  );
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
    {successMessages.get(successType)}
    {!session?.user.new_email ? "Please attempt the previous action." : ""}
    {#if session?.user.new_email}
      Please proceed to
      <span class="font-bold text-white">verify the other email.</span>
    {/if}
  </p>
  <Button class="btn md:btn-lg md:w-fit variant-filled-primary" href="/">Go home</Button>
</div>
