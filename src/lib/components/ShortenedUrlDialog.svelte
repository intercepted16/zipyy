<script lang="ts">
  import * as Dialog from "$ui/dialog";
  import { Button } from "$ui/button";
  import type { ActionData } from "../../routes/$types";
  export let open: boolean;
  export let form: ActionData;
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>hi</Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Your shortened URL</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid items-center gap-4">
        <span
          >Original: <a href={`https://${form?.original ?? "google.com"}`}
            >{form?.original ?? "google.com"}</a
          ></span>
      </div>
      <div class="grid items-center gap-4">
        <span
          >Shortened: <a href={`https://${form?.shortened ?? "sh.ps.ai/dma)F1"}`}
            >{form?.shortened ?? "sh.ps.ai/dma)F1"}</a
          ></span>
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit" class="mb-2 sm:mb-0 w-full" on:click={() => (open = false)}
        >Okay
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
