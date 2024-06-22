<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { shortenSchema as schema } from "$types/validation/schema";
  import { editDialog, id as storeId, shortenedUrlsRoute } from "$store";
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import MoreHorizontal from "$lucide/ellipsis.svelte";
  import SuperDebug, { type Infer, type SuperForm } from "sveltekit-superforms";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { urlData } from "$store";

  export let shortened: string;
  export let id: number;
  let deleteDialog: boolean;
  export let superFrm: SuperForm<Infer<typeof schema>>;
  export let supabase: SupabaseClient;
  const { form: formData, enhance } = superFrm;
</script>

<AlertDialog.Root bind:open={deleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        on:click={async () => {
          await supabase.from("shortened_urls").delete().eq("id", id);
          if (urlData) urlData.reset();
        }}
        >Continue
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={$editDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Editing shortened URL</Dialog.Title>
      <Dialog.Description>You are currently editing {shortened}</Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/edit" use:enhance>
      <Form.Field form={superFrm} name="url">
        <Form.Control let:attrs>
          <Form.Label>URL</Form.Label>
          <Input {...attrs} bind:value={$formData.url} />
        </Form.Control>
        <Form.Description>This is your public display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Dialog.Footer>
        <Button variant="outline" on:click={() => ($editDialog = false)}>Cancel</Button>
        <Form.Button>Okay, done</Form.Button>
      </Dialog.Footer>
      <SuperDebug data={$formData}></SuperDebug>
    </form>
  </Dialog.Content>
</Dialog.Root>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative w-8 h-8 p-0">
      <span class="sr-only">Open menu</span>
      <MoreHorizontal class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => navigator.clipboard.writeText(`${shortenedUrlsRoute}/${shortened}`)}>
        Copy shortened URL
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => {
        $editDialog = true;
        $storeId = id;
      }}
      >Edit URL
    </DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => (deleteDialog = true)}
      >Delete shortened URL
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
