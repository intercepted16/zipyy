<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Input } from "$lib/components/ui/input/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Form from "$ui/form";
  import type { Infer, SuperForm } from "sveltekit-superforms";
  import type { resetPasswordSchema } from "$types/validation/schema";
  export let open: boolean;
  export let resetPasswordForm: SuperForm<Infer<typeof resetPasswordSchema>>;
  const { form: formData, enhance } = resetPasswordForm;
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger class={buttonVariants({ variant: "link" })}
    >Forgot your password?</AlertDialog.Trigger>
  <AlertDialog.Content class="sm:max-w-[475px]">
    <AlertDialog.Header>
      <AlertDialog.Title>Reset your password</AlertDialog.Title>
      <AlertDialog.Description>
        Edit your password here. We'll send a reset link to your email.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <form method="POST" action="?/resetPassword" use:enhance>
      <Form.Field form={resetPasswordForm} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email address</Form.Label>
          <Input autofocus={true} {...attrs} bind:value={$formData.email} />
          <Form.FieldErrors />
        </Form.Control>
      </Form.Field>

      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <Form.Button>Reset password</Form.Button>
      </AlertDialog.Footer>
    </form>
  </AlertDialog.Content>
</AlertDialog.Root>
