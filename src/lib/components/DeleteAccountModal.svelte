<script>
  import { deleteAccountModal } from "../../routes/store";
  import { Modal, Button } from "flowbite-svelte";
</script>

<Modal bind:open={$deleteAccountModal} size="xs" autoclose outsideclose>
  <div class="text-center">
    <i class="text-5xl bi bi-radioactive"></i>
    <h3
      class="max-w-sm mx-auto mt-2 mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
    >
      Are you sure you want to delete your account?
    </h3>
    <Button
      color="red"
      class="me-2"
      on:click={() => {
        fetch("/api/deleteaccount", { method: "DELETE" });
      }}>Yes, I'm sure</Button
    >
    <Button color="alternative" outline>No, cancel</Button>
  </div>
</Modal>
