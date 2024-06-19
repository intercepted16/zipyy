<script lang="ts" context="module">
  import { z } from "zod";

  export const appearanceFormSchema = z.object({
    theme: z.enum(["light", "dark"], {
      required_error: "Please select a theme."
    })
  });

  export type AppearanceFormSchema = typeof appearanceFormSchema;
</script>

<script lang="ts">
  import SuperDebug, { type Infer, type SuperValidated, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { browser } from "$app/environment";
  import * as Form from "$ui/form/index.js";
  import * as RadioGroup from "$ui/radio-group/index.js";
  import { Label } from "$ui/label/index.js";
  export let data: SuperValidated<Infer<AppearanceFormSchema>>;
  import { setMode } from "mode-watcher";

  const form = superForm(data, {
    validators: zodClient(appearanceFormSchema),
    onUpdate: ({ form }) => {
      setMode(form.data.theme);
    }
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-8">
  <Form.Fieldset {form} name="theme">
    <Form.Legend>Theme</Form.Legend>
    <Form.Description>Select the theme for the dashboard.</Form.Description>
    <Form.FieldErrors />
    <RadioGroup.Root
      class="grid max-w-md grid-cols-2 gap-8 pt-2"
      orientation="horizontal"
      bind:value={$formData.theme}>
      <Form.Control let:attrs>
        <Label class="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroup.Item {...attrs} value="light" class="sr-only" />
          <div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
            <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div class="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
              <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
              <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
            </div>
          </div>
          <span class="block w-full p-2 text-center font-normal"> Light </span>
        </Label>
      </Form.Control>
      <Form.Control let:attrs>
        <Label class="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroup.Item {...attrs} value="dark" class="sr-only" />
          <div
            class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
            <div class="space-y-2 rounded-sm bg-slate-950 p-2">
              <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div class="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div class="h-4 w-4 rounded-full bg-slate-400" />
                <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div class="h-4 w-4 rounded-full bg-slate-400" />
                <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <span class="block w-full p-2 text-center font-normal"> Dark </span>
        </Label>
      </Form.Control>
      <RadioGroup.Input name="theme" />
    </RadioGroup.Root>
  </Form.Fieldset>
  <Form.Button>Update preferences</Form.Button>
</form>

{#if browser && process.env.NODE_ENV === "development"}
  <SuperDebug data={$formData} />
{/if}
