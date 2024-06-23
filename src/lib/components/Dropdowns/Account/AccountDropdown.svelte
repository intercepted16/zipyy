<script lang="ts">
  import { Button } from "$ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { type Session, type SupabaseClient } from "@supabase/supabase-js";
  import type { Database } from "$types/database/schema";

  // JWT verification is not required, all we're doing is displaying the user's email.
  export let session: Session | null;
  export let supabase: SupabaseClient<Database>;
  let hover: boolean = false;
  let name: string;
  let open: boolean = false;
  if (session?.user.email) {
    name = session?.user.email.slice(0, 2);
  }
</script>

{#await import("$ui/alert-dialog") then AlertDialog}
  <AlertDialog.Root bind:open>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>
          If you don't remember your credentials, you wont be able to login again.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>No, cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={async () => await supabase.auth.signOut()}
          >Yes, I'm sure
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/await}

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} size="icon" class="group !bg-transparent">
      <img
        alt={session.user.email}
        class="w-full h-full"
        on:mouseenter={() => (hover = true)}
        on:mouseleave={() => (hover = false)}
        src={`https://ui-avatars.com/api/?name=${name}&rounded=true${hover ? "&background=0D8ABC&color=fff" : ""}`} />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item href="/manage">
        {#await import("$lucide/settings.svelte") then Settings}
          <Settings.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Settings</span>
        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => {
        open = true;
      }}>
      {#await import("$lucide/log-out.svelte") then LogOut}
        <LogOut.default class="mr-2 h-4 w-4" />
      {/await}
      <span>Log out</span>
      <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
