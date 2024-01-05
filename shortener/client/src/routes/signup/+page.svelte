<script>
  import { onMount } from "svelte";
  let form;
  let isInvalid = true;
  let emailInput;
  let passwordInput;
  let emailError = "Please enter a valid email address.";
  const signup = async () => {
    const response = await fetch("/api/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const responseBody = await response.json();
    if (response.status == 400) {
      if (responseBody["error"] == "INVALID_EMAIL") {
        emailInput.setCustomValidity("Invalid email.");
        // emailInput.nextElementSibling.innerHTML = "Please enter a valid email address.";
      } else if (responseBody["error"] == "INSECURE_PASSWORD") {
        passwordInput.setCustomValidity(
          "Please enter a password with 8 characters, and at least 1 symbol, 2 numbers, and 3 letters."
        );
      } else {
        emailInput.setCustomValidity("Invalid email.");
        // emailInput.nextElementSibling.innerHTML = "Please enter a valid email address.";
        passwordInput.setCustomValidity(
          "Please enter a password with 8 characters, and at least 1 symbol, 2 numbers, and 3 letters."
        );
      }
    } else if (response.status == 409) {
      emailInput.setCustomValidity("User already exists.");
      emailError =
        "User already exists. Please try again with a different email.";
    }

    // if (!form.checkValidity()) {
    //   signupBtn.disabled = true;
    //   return 1;
    // }

    function isValidEmail(email) {
      let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let match = email.match(pattern);
      return Boolean(match);
    }
  };

  //   onMount(() => {
  //     const form = document.querySelector("#signupForm");
  //     const passwordInput = document.querySelector("#signupPasswordInput");
  //     const emailInput = document.querySelector("#signupEmailInput");
  //     const signupBtn = document.querySelector("#signupBtn");

  //     // form.addEventListener("input", function () {
  //     //   emailInput.next().html("Please enter a valid email address.");
  //     //   passwordInput
  //     //     .next()
  //     //     .html("Your password must be at least 8 characters long.");
  //     //   emailInput.setCustomValidity("");
  //     //   passwordInput.setCustomValidity("");
  //     //   if (!form.checkValidity()) {
  //     //     signupBtn.attr("disabled", true);
  //     //   } else {
  //     //     signupBtn.removeAttr("disabled");
  //     //   }
  //     // });
  // })
</script>

<div class="bg-gray-50 dark:bg-gray-900">
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
  >
    <a
      href="#"
      class="flex items-center mb-6 text-2xl font-semibold text-gray-900"
    >
      <img
        class="w-8 h-8 mr-2"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="logo"
      />
      Flowbite
    </a>
    <div
      class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          Signup for an account
        </h1>
        <form
          class="space-y-4 md:space-y-6 group"
          bind:this={form}
          on:input={() => {
            isInvalid = !form.checkValidity();
            console.log(isInvalid);
            emailInput.setCustomValidity("");
            passwordInput.setCustomValidity("");
            emailError = "Please enter a valid email address.";
          }}
          id="signupForm"
          novalidate
        >
          <div>
            <label
              for="signupEmailInput"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="signupEmailInput"
              bind:this={emailInput}
              class="peer bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              placeholder="name@company.com"
              required
              pattern="^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{'{2,}'}$"
            />
            <span
              class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedText"
            >
              {emailError}
            </span>
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Password</label
            >
            <input
              type="password"
              name="password"
              id="signupPasswordInput"
              placeholder="••••••••"
              bind:this={passwordInput}
              pattern=".{'{8,}'}"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer"
              required
            />
            <span
              class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedText"
            >
              Your password must be at least 8 characters long
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded excludedText bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="remember" class="text-gray-500 dark:text-gray-300"
                  >Remember me</label
                >
              </div>
            </div>
          </div>
          <button
            type="button"
            class:opacity-50={isInvalid}
            class:pointer-events-none={isInvalid}
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 select-none"
            id="signupBtn"
            on:click={signup}
            disabled={isInvalid}
          >
            Signup
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?
            <a
              href="login2"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >Log in</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</div>
