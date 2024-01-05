<script>
  let isInvalid = true;
</script>

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
        Contact
      </h1>
      <form
        class="space-y-4 md:space-y-6 group"
        id="signupForm"
        action="https://formspree.io/f/mleyglgp"
        method="post"
        novalidate
        on:input={(e) => {
          isInvalid = !e.target.checkValidity();
        }}
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
            class="peer bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
            placeholder="name@company.com"
            required=""
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{'{2,}'}$"
          />
          <span
            class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedText"
          >
            Please enter a valid email address.
          </span>
        </div>
        <div>
          <label
            for="message"
            class="block mb-2 text-sm font-medium text-gray-900">Message</label
          >
          <input
            type="text"
            name="message"
            id="signupPasswordInput"
            placeholder="Your message"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer"
            required
          />
          <span
            class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block excludedElement"
          >
            Please enter a message.
          </span>
        </div>
        <button
          type="submit"
          class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 group-invalid:pointer-events-none group-invalid:opacity-50 select-none"
          id="signupBtn"
          disabled={isInvalid}
        >
          Send
        </button>
      </form>
    </div>
  </div>
</div>
