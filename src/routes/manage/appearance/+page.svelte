<script lang="ts">
  import type { PageData } from "./$types.js";
  import AppearanceForm from "$lib/components/AppearanceForm.svelte";
  import { Separator } from "$ui/separator/index.js";

  export let data: PageData;
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Appearance</h3>
    <p class="text-sm text-muted-foreground">Customize the appearance of the app.</p>
  </div>
  <Separator />
  <AppearanceForm data={data.form} />
</div>
