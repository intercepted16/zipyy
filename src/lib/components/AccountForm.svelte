<script lang="ts">
  import SuperDebug, { type Infer, type SuperValidated, superForm } from "sveltekit-superforms";
  import { yupClient } from "sveltekit-superforms/adapters";
  import * as Form from "$ui/form/index.js";
  import { Input } from "$ui/input/index.js";
  import { browser } from "$app/environment";
  import { accountFormSchema } from "$types/validation/schema";

  export let data: SuperValidated<Infer<typeof accountFormSchema>>;

  const form = superForm(data, {
    validators: yupClient(accountFormSchema)
  });
  const { form: formData, enhance } = form;
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

{#if browser && process.env.NODE_ENV === "development"}
  <SuperDebug data={$formData} />
{/if}
