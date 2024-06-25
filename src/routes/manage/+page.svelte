<script lang="ts">
  import AccountForm from "$lib/components/AccountForm.svelte";
  import { Separator } from "$ui/separator/index.js";

  export let data;
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Account</h3>
    <p class="text-sm text-muted-foreground">
      Update your account settings. Set your preferred language and timezone.
    </p>
  </div>
  <Separator />
  <AccountForm data={data.form} />
</div>
