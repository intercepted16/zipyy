<script lang="ts">
  import { loginState } from "../store";
  import { signupOrLogin } from "../store";
  import type { PageData } from "./$types";
  import { loginSchema as schema } from "$lib/schema";
  import { Form } from "formsnap";
  import { Github } from "lucide-svelte";

  export let data: PageData;

  const form = data.form;

  const observeAndFocus = (element: HTMLElement) => {
    console.log(element);
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
    class="px-6 pt-2 pb-12 bg-white rounded-lg shadow dark:bg-gray-900 dark:text-white sm:px-12"
  >
    <div class="my-5 space-y-6">
      <img
        class="w-auto h-10 mx-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="text-2xl font-bold leading-9 tracking-tight text-center text-gray-900 dark:text-white"
      >
        Sign in to your account
      </h2>
    </div>
    <Form.Root
      let:tainted
      class="space-y-6"
      {form}
      {schema}
      let:config
      debug={true}
    >
      {form.valid}
      <div class={$loginState == 1 ? "hidden" : ""}>
        <Form.Field {config} name="email">
          <Form.Label
            class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >Email address</Form.Label
          >
          <Form.Input class="input" />
          <Form.Validation />
        </Form.Field>
      </div>
      <div class={$loginState == 0 ? "hidden" : ""}>
        <Form.Field {config} name="password">
          <Form.Label
            class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >Password</Form.Label
          >
          <Form.Input type="password" class="input" />
          <Form.Validation />
        </Form.Field>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="w-full btn variant-filled-primary enabled:hover:variant-filled-secondary"
          type={$loginState == 0 ? "button" : "submit"}
          disabled={$loginState == 0
            ? form.data.email || !tainted?.email
            : form.data.password || !tainted?.password}
          on:click={async () => {
            if ($loginState == 1 || form.data.email) return;
            const userExists = (
              await fetch(`/user/exists?user=${form.data.email}`)
            ).json();
            if (!(await userExists)) signupOrLogin.set("signup");
            $loginState++;
            observeAndFocus(document.querySelector("input[type='password']"));
          }}
          >{$loginState == 0
            ? "Next"
            : $signupOrLogin == "signup"
              ? "Signup for an account"
              : "Login to your account"}
        </button>
      </div>
      <span class="mx-auto text-sm font-semibold leading-relaxed text-gray-500"
        >By continuing, you agree to Shortly's <a
          href="/terms"
          class="text-white underline hover:text-primary-500">terms of use</a
        >
        &
        <a href="/terms" class="text-white underline hover:text-primary-500"
          >privacy policy</a
        >.</span
      >
    </Form.Root>
    <div>
      <div class="relative mt-10">
        <div
          class="absolute inset-0 flex items-center dark:hidden"
          aria-hidden="true"
        >
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm font-medium leading-6">
          <span class="px-6 text-gray-900 dark:text-white"
            >Or continue with</span
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-6">
        <a
          href="#top"
          class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
            />
          </svg>
          <span class="text-sm font-semibold leading-6">Twitter</span>
        </a>

        <button
          class="flex w-full items-center justify-center gap-1 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
          on:click={async () => {
            const { error } = await data.supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${data.url}/auth/callback`,
              },
            });
          }}
        >
          <Github class="w-6 h-6" />
          <span class="text-sm font-semibold leading-6">GitHub</span>
        </button>
      </div>
    </div>
  </div>
</div>
