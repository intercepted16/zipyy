<script lang="ts">
  import { loginState } from "../../routes/store";
  import { signupOrLogin } from "../../routes/store";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import { schema } from "$lib/schemas/signup-login.js";
  import type { Writable } from "svelte/store";
  import { Form } from "formsnap";
  let loginField: Writable<HTMLInputElement>;
  import { get } from "svelte/store";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { createClient } from "@supabase/supabase-js";

  // const { errors, form, tainted } = getForm();

  export let data: PageData;

  // Client API:
  const superFrm = superForm(data.form, {
    validators: schema,
    taintedMessage: null,
    multipleSubmits: "prevent",
  });

  const { errors, tainted, form, delayed, submitting } = superFrm;

  $: console.log($errors);

  $: console.log($delayed);

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";

  // $: console.log("___errors", $errors);

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

  onMount(() => {
    window.addEventListener("keydown", (ev) => {
      if (ev.altKey && ev.key === "ArrowLeft") {
        if ($loginState == 1) {
          ev.preventDefault();
          ev.stopPropagation();
          $loginState--;
        }
      }
      if (
        ev.altKey &&
        ev.key === "ArrowRight" &&
        $tainted?.email &&
        !$errors.email &&
        $loginState == 0
      ) {
        ev.preventDefault();
        ev.stopPropagation();
        $loginState++;
      }
    });

    // Cleanup the event listener when the component is destroyed
    return () => {
      window.removeEventListener("keydown", () => {});
    };
  });
</script>

<!-- @component The custom Skeleton UI component modal -->
<!-- <div class="flex flex-col items-center justify-center pt-16">
  <div class={cBase}>
    <header class={cHeader}>
      {$loginState == 0 ? "Enter your email address" : "Enter your password"}
    </header>
    <article>
      {$loginState == 0
        ? "to login or signup..."
        : $signupOrLogin == "signup"
          ? "to create an account..."
          : "to login to your account..."}
    </article>
    <form class="flex flex-col space-y-6" method="POST" use:enhance>
      <SuperDebug data={$form} />
      <InputWrapper
        {form}
        {errors}
        name="email"
        label="Email address"
        hidden={$loginState == 1}
        autofocus={true}
        {tainted}
      />
      <div class:hidden={$loginState == 0}>
        <InputWrapper
          {form}
          {errors}
          name="password"
          label="Your password"
          {tainted}
          bind:inputElement={loginField}
        />
      </div>
      <button
        class="w-full btn variant-filled-primary enabled:hover:variant-filled-secondary"
        type={$loginState == 0 ? "button" : "submit"}
        disabled={$loginState == 0
          ? $errors.email || !$tainted?.email
          : $errors.password || !$tainted?.password}
        on:click={async () => {
          if ($loginState == 1 || $errors.email) return;
          let buttonClickTimestamp = Date.now();

          const userExists = (
            await fetch(`/user/exists?user=${$form.email}`)
          ).json();
          if (!(await userExists)) signupOrLogin.set("signup");
          $loginState++;
          observeAndFocus($loginField);
        }}
        >{$loginState == 0
          ? "Next"
          : $signupOrLogin == "signup"
            ? "Signup for an account"
            : "Login to your account"}</button
      >
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
    </form>
  </div>
</div> -->

<!-- <div class="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      class="w-auto h-10 mx-auto"
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
      alt="Your Company"
    />
    <h2
      class="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-white"
    >
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-white"
          >Email address</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-white"
            >Password</label
          >
          <div class="text-sm">
            <a
              href="#"
              class="font-semibold text-indigo-400 hover:text-indigo-300"
              >Forgot password?</a
            >
          </div>
        </div>
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >Sign in</button
        >
      </div>
    </form>

    <p class="mt-10 text-sm text-center text-gray-400">
      Not a member?
      <a
        href="#"
        class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
        >Start a 14 day free trial</a
      >
    </p>
  </div>
</div> -->

<div class="sm:max-w-[480px] h-full mx-auto flex justify-center items-center">
  <div
    class="px-6 pt-2 pb-12 bg-white shadow dark:bg-gray-900 dark:text-white rounded-lg sm:px-12"
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
      class="space-y-6"
      controlled
      form={superFrm}
      {schema}
      let:config
      debug={true}
    >
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
            ? $errors.email || !$tainted?.email
            : $errors.password || !$tainted?.password}
          on:click={async () => {
            if ($loginState == 1 || $errors.email) return;

            const userExists = (
              await fetch(`/user/exists?user=${$form.email}`)
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
        {#if $delayed || $submitting}
          <ProgressRadial width="w-8" />
        {/if}
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
          href="#"
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
          class="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
          on:click={async () => {
            const { error } = await data.supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${data.url}/auth/callback`,
              },
            });
          }}
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-semibold leading-6">GitHub</span>
        </button>
      </div>
    </div>
  </div>

  <!-- <p class="mt-10 text-sm text-center text-gray-500">
      Not a member?
      <a
        href="#"
        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >Start a 14 day free trial</a
      >
    </p> -->
</div>
