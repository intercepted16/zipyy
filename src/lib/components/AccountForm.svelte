<script lang="ts">
  import SuperDebug, { type Infer, type SuperValidated, superForm } from "sveltekit-superforms";
  import { yupClient } from "sveltekit-superforms/adapters";
  import * as Form from "$ui/form/index.js";
  import { Input } from "$ui/input/index.js";
  import { browser } from "$app/environment";
  import { accountFormSchema } from "$types/validation/schema";
  import { Button } from "$ui/button";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  export let data: SuperValidated<Infer<typeof accountFormSchema>>;

  const form = superForm(data, {
    validators: yupClient(accountFormSchema)
  });
  const { form: formData, enhance } = form;
  let deleteAccountForm: HTMLFormElement;
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label>Email</Form.Label>
      <Input {...attrs} bind:value={$formData.email} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label>Password</Form.Label>
      <Input {...attrs} bind:value={$formData.password} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="confirmPassword">
    <Form.Control let:attrs>
      <Form.Label>Confirm password</Form.Label>
      <Input {...attrs} bind:value={$formData.confirmPassword} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Update account</Form.Button>
</form>

<form method="POST" bind:this={deleteAccountForm}>
  <input type="hidden" name="delete" value="true" />
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        class="bg-red-600 dark:bg-red-700 dark:text-white">Delete account</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete your account and remove your
          data from our servers.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={() => deleteAccountForm.submit()}
          >Continue</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</form>

{#if browser && process.env.NODE_ENV === "development"}
  <SuperDebug data={$formData} />
{/if}
