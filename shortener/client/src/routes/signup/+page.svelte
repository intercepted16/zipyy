<script lang="ts">
  import LoginStep0 from "$lib/components/LoginStep0.svelte";
  import LoginStep1 from "$lib/components/LoginStep1.svelte";
  import { loginState } from "../../routes/store";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { signupOrLogin } from "../../routes/store";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import { schema } from "$lib/schemas/signup-login.js";
  import InputWrapper from "$lib/components/InputWrapper.svelte";

  export let data: PageData;

  // Client API:
  const { form, enhance, errors, tainted } = superForm(data.form, {
    validators: schema,
    taintedMessage: null,
  });
  $: console.log($form.email);

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";

  $: console.log("___errors", $errors);

  // const { form, errors, enhance, tainted, allErrors } = superForm(
  //   superValidateSync(loginSchema),
  //   {
  //     taintedMessage: null,
  //     SPA: true,
  //     validators: loginSchema,
  //     async onUpdate({ form, cancel }) {
  //       console.log("submitted");
  //       let response;
  //       if (form.valid) {
  //         switch ($signupOrLogin) {
  //           case "signup":
  //             // signup
  //             response = await fetch("/user/signup", {
  //               method: "POST",
  //               body: JSON.stringify({
  //                 email: $form.email,
  //                 password: $form.password,
  //               }),
  //             });
  //             if (!response.ok) {
  //               console.log(response.status);
  //               console.log(await response.json());
  //               $errors.password = ["signup went oof!"];
  //               inputElement.dispatchEvent(new Event("input"));
  //               cancel();
  //               return 1;
  //             }
  //             $loginState++;
  //             break;
  //           case "login":
  //             // login
  //             response = await fetch("/user/login", {
  //               method: "POST",
  //               body: JSON.stringify({
  //                 email: $form.email,
  //                 password: $form.password,
  //               }),
  //             });
  //             if (!response.ok) {
  //               $errors.password = [
  //                 "Wrong password. Try again or click Forgot password to reset it.",
  //               ];
  //               inputElement.dispatchEvent(new Event("input"));
  //               cancel();
  //               return 1;
  //             }
  //             window.location.reload();
  //             break;
  //         }
  //       }
  //     },
  //   }
  // );

  let currentStep: typeof LoginStep0;
  $: currentStep = loginStates[$loginState];
  const loginStates = [LoginStep0, LoginStep1];
</script>

<!-- @component The custom Skeleton UI component modal -->
<div class="flex flex-col items-center justify-center pt-16">
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
        {tainted}
      />
      <InputWrapper
        {form}
        {errors}
        name="password"
        label="Your password"
        hidden={$loginState == 0}
        {tainted}
      />
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
        }}
        >{$loginState == 0
          ? "Next"
          : $signupOrLogin == "signup"
            ? "Signup for an account"
            : "Login to your account"}</button
      >
      <!-- <button
        type={$loginState == 0 ? "button" : "submit"}
        class="w-full btn variant-filled-primary"
        >{$loginState == 0
          ? "Next"
          : $signupOrLogin == "signup"
            ? "Signup for an account"
            : "Login to your account"}</button
      > -->
      <!-- <svelte:component
      this={currentStep}
      {loginState}
      {form}
      {enhance}
      {SuperDebug}
      {errors}
      {tainted}
      bind:inputElement
    /> -->
    </form>
  </div>
</div>
