<script lang="ts">
  import type { PageData } from "./$types";
  import { loginSchema as schema } from "$types/validation/schema";
  import * as Form from "$ui/form";
  import Github from "$lucide/github.svelte";
  import { Input } from "$ui/input";
  import { superForm } from "sveltekit-superforms";
  import { yupClient } from "sveltekit-superforms/adapters";
  export let data: PageData;
  const supabase = data.supabase;
  let signupOrLogin: string = "login";
  let loginState: number = 0;

  const form = superForm(data.form, {
    validators: yupClient(schema),
    onSubmit: async ({ formData }) => {
      formData.set("signupOrLogin", signupOrLogin);
    },
    onUpdate: async (e) => {
      if (loginState == 1 || $errors.email || !$tainted?.email) return;
      e.cancel();
      const userExists = (await supabase.rpc("email_exists", { email: $formData.email })).data;

      if (!userExists) signupOrLogin = "signup";
      loginState++;
      const el = document.querySelector("input[type='password']") as HTMLElement | null;
      if (el) observeAndFocus(el);
      return 0;
    }
  });

  const { enhance, form: formData, tainted, errors } = form;

  const observeAndFocus = (element: HTMLElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.focus();
        observer.disconnect();
      }
    });

    observer.observe(element);
  };
</script>

<div class="sm:max-w-[480px] h-full mx-auto flex justify-center items-center">
  <div
    class="px-6 pt-2 pb-12 bg-white rounded-lg shadow dark:bg-gray-900 dark:text-white sm:px-12 w-[450px]">
    <div class="my-5 space-y-6">
      <img class="w-auto h-10 mx-auto rounded" src="/img/logo.webp" alt="Your Company" />
      <h2
        class="text-2xl font-bold leading-9 tracking-tight text-center text-gray-900 dark:text-white">
        Login or signup in seconds
      </h2>
    </div>
    <form method="POST" class="space-y-6" use:enhance>
      <div class={loginState === 1 ? "hidden" : ""}>
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label>Email address</Form.Label>
            <Input autofocus={true} {...attrs} bind:value={$formData.email} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>
      </div>
      <div class={loginState === 0 ? "hidden" : ""}>
        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input type="password" {...attrs} bind:value={$formData.password} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>
      </div>
      <div class="flex items-center space-x-2">
        <Form.Button class="w-full"
          >{loginState === 0
            ? "Next"
            : signupOrLogin === "signup"
              ? "Signup for an account"
              : "Login to your account"}
        </Form.Button>
      </div>
      <span class="mx-auto text-sm font-semibold leading-relaxed text-gray-500"
        >By continuing, you agree to use the Software according to the <a
          href="https://raw.githubusercontent.com/intercepted16/zipyy/master/LICENSE"
          class="text-white">MIT license</a
        >.
      </span>
    </form>
    <div>
      <div class="relative mt-10">
        <div class="absolute inset-0 flex items-center dark:hidden" aria-hidden="true">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm font-medium leading-6">
          <span class="px-6 text-gray-900 dark:text-white">Or continue with</span>
        </div>
      </div>

      <div class="grid grid-cols-1 mt-6">
        <button
          class="flex w-full items-center justify-center gap-1 rounded-md bg-[#24292F] py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
          on:click={async () => {
            await data.supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${data.url}/auth/callback`
              }
            });
          }}>
          <Github class="w-6 h-6" />
          <span class="text-sm font-semibold leading-6">GitHub</span>
        </button>
      </div>
    </div>
  </div>
</div>
