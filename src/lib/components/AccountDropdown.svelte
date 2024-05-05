<script lang="ts">
  import { Button } from "$ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { type Session, type SupabaseClient } from "@supabase/supabase-js";
  import type { Database } from "$lib/types/supabase";

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
          If you don"t remember your credentials, you wont be able to login again.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>No, cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={async () => await supabase.auth.signOut()}
          >Yes, I"m sure
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
      <DropdownMenu.Item>
        {#await import("$lucide/user.svelte") then User}
          <User.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Profile</span>
        <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        {#await import("$lucide/credit-card.svelte") then CreditCard}
          <CreditCard.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Billing</span>
        <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        {#await import("$lucide/settings.svelte") then Settings}
          <Settings.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Settings</span>
        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        {#await import("$lucide/keyboard.svelte") then Keyboard}
          <Keyboard.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Keyboard shortcuts</span>
        <DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        {#await import("$lucide/users.svelte") then Users}
          <Users.default class="mr-2 h-4 w-4" />
        {/await}
        <span>Teams</span>
      </DropdownMenu.Item>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          {#await import("$lucide/user-plus.svelte") then UserPlus}
            <UserPlus.default class="mr-2 h-4 w-4" />
          {/await}
          <span>Invite users</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item>
            {#await import("$lucide/mail.svelte") then Mail}
              <Mail.default class="mr-2 h-4 w-4" />
            {/await}
            <span>Email</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            {#await import("$lucide/message-square.svelte") then MessageSquare}
              <MessageSquare.default class="mr-2 h-4 w-4" />
            {/await}
            <span>Message</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            {#await import("$lucide/plus-circle.svelte") then PlusCircle}
              <PlusCircle.default class="mr-2 h-4 w-4" />
            {/await}
            <span>More...</span>
          </DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
      <DropdownMenu.Item>
        {#await import("$lucide/plus.svelte") then Plus}
          <Plus.default class="mr-2 h-4 w-4" />
        {/await}
        <span>New Team</span>
        <DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      {#await import("$lucide/github.svelte") then Github}
        <Github.default class="mr-2 h-4 w-4" />
      {/await}
      <span>GitHub</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      {#await import("$lucide/life-buoy.svelte") then LifeBuoy}
        <LifeBuoy.default class="mr-2 h-4 w-4" />
      {/await}
      <span>Support</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      {#await import("$lucide/cloud.svelte") then Cloud}
        <Cloud.default class="mr-2 h-4 w-4" />
      {/await}
      <span>API</span>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => {
        console.log("clicked");
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
