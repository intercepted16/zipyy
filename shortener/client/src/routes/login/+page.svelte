<script>
  import { onMount } from "svelte";
  let emailInput,
    passwordInput,
    isInvalid = true;
  let form;

  onMount(() => {
    emailInput = document.getElementById("loginEmailInput");
    passwordInput = document.getElementById("loginPasswordInput");

    emailInput.addEventListener("input", handleEmailInput);
    passwordInput.addEventListener("input", handlePasswordInput);
  });

  function handleEmailInput(e) {
    if (!isValidEmail(e.target.value)) {
      emailInput.setCustomValidity("Please enter a valid email address.");
      emailInput.nextElementSibling.textContent =
        "Please enter a valid email address.";
    } else {
      emailInput.setCustomValidity("");
      emailInput.nextElementSibling.textContent = "";
    }
  }

  function handlePasswordInput(e) {
    if (e.target.value.length < 7) {
      passwordInput.setCustomValidity(
        "Your password must be at least 7 characters long."
      );
      passwordInput.nextElementSibling.textContent =
        "Your password must be at least 7 characters long.";
    } else {
      passwordInput.setCustomValidity("");
      passwordInput.nextElementSibling.textContent = "";
    }
  }

  async function handleLoginClick(e) {
    e.preventDefault();

    if (!emailInput.checkValidity() || !passwordInput.checkValidity()) {
      return;
    }

    const response = await fetch("/api/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const statusCode = await response.text();

    if (statusCode == 401) {
      console.log("invalid email or pass");
      emailInput.setCustomValidity("Invalid email or password.");
      passwordInput.setCustomValidity("Invalid email or password.");
      emailInput.nextElementSibling.textContent = "";
      passwordInput.nextElementSibling.textContent =
        "Invalid email or password.";
    } else {
      emailInput.setCustomValidity("");
      passwordInput.setCustomValidity("");
    }

    if (!emailInput.checkValidity() || !passwordInput.checkValidity()) {
      console.log("invalid client side");
      return;
    }
    console.log(statusCode);
  }

  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
</script>

<div class="bg-gray-50 dark:bg-gray-900 h-screen">
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
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
          Sign in to your account
        </h1>
        <form
          class="space-y-4 md:space-y-6"
          id="loginForm"
          novalidate
          bind:this={form}
          on:input={() => {
            isInvalid = !form.checkValidity();
          }}
        >
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="loginEmailInput"
              class="peer bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              placeholder="name@company.com"
              required
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{'{2,}'}$"
            />
            <span
              class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedElement"
            >
              Please enter a valid email address.
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
              placeholder="••••••••"
              pattern=".{'{7,}'}"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer"
              id="loginPasswordInput"
              required
            />
            <span
              class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedElement"
            >
              Your password must be at least 7 characters long
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  class="excludedElement w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="remember" class="text-gray-500 dark:text-gray-300"
                  >Remember me</label
                >
              </div>
            </div>
            <a
              href="#"
              class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >Forgot password?</a
            >
          </div>
          <button
            type="button"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 select-none"
            id="loginBtn"
            on:click={handleLoginClick}
            class:pointer-events-none={isInvalid}
            class:opacity-50={isInvalid}
            disabled={isInvalid}
          >
            Sign in
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?
            <a
              href="signup2"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >Sign up</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</div>
