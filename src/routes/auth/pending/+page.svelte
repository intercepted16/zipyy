<script lang="ts">
  import CircleCheck from "$lucide/circle-check.svelte";
  import { Button } from "$ui/button";
  import { page } from "$app/stores";
  import { type EmailOtpType } from "@supabase/supabase-js";
  const pendingType: EmailOtpType =
    ($page.url.searchParams.get("type") as EmailOtpType) ?? "confirmation";
  const pendingMessages = new Map<EmailOtpType, string>(
    Object.entries({
      signup: "creating your account",
      confirmation: "creating your account",
      email_change: `changing your email`,
      recovery: "updating your password"
    }) as [EmailOtpType, string][]
  );
</script>

<div class="flex flex-col items-center justify-center my-36">
  <CircleCheck class="w-16 h-16 text-green-500" />
  <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
    <span class="text-blue-500 excludedText" data-svelte-h="svelte-6xrf68">Almost</span> there.
  </div>
  <p
    class="max-w-xl my-4 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
    <!--
      When 'new_email' is not empty, it indicates that the
      user has requested to change their email and it has not been completed yet.
-->
    Nearly there! To finish {pendingMessages.get(pendingType)}, simply verify the email address you
    provided earlier. Then, attempt to login.
  </p>
  <Button class="btn md:btn-lg md:w-fit variant-filled-primary" href="/">Go home</Button>
</div>
