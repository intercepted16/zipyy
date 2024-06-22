<script lang="ts">
  import { page } from "$app/stores";
  import CircleX from "$lucide/circle-x.svelte";
  import { Button } from "$ui/button";
  import errors from "$lib/errors";
  import type { AuthError } from "@supabase/supabase-js";
  const errorParam = $page.url.searchParams.get("error");
  let error: AuthError | null;
  if (errorParam) error = JSON.parse(errorParam);
  else error = null;
</script>

<div class="flex flex-col items-center justify-center my-36">
  <CircleX class="w-16 h-16 text-red-500" />
  <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
    Verification <span class="text-red-500 excludedText">failed</span>.
  </div>
  <p
    class="max-w-xl my-4 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
    {errors.get(error?.code ?? "") ||
      "No error description provided. Please refer to the error code or contact support."}
  </p>
  <span class="text-sm italic mb-2">ERR: {error?.code}</span>
  <Button class="btn md:btn-lg md:w-fit variant-filled-primary" href="/">Go home</Button>
</div>
