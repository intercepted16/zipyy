<script lang="ts" context="module">
  import { z } from "zod";

  export const accountFormSchema = z.object({
    email: z.string().email()
  });

  export type AccountFormSchema = typeof accountFormSchema;
</script>

<script lang="ts">
  import SuperDebug, { type Infer, type SuperValidated, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as Form from "$ui/form/index.js";
  import { Input } from "$ui/input/index.js";
  import { browser } from "$app/environment";

  export let data: SuperValidated<Infer<AccountFormSchema>>;

  const form = superForm(data, {
    validators: zodClient(accountFormSchema)
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
  <Form.Button>Update account</Form.Button>
</form>

{#if browser && process.env.NODE_ENV === "development"}
  <SuperDebug data={$formData} />
{/if}
