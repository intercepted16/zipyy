<script>
  import { Button, Modal } from "flowbite-svelte";
  import { viewAllModal, entries, shortenedDomain } from "../../routes/store";
</script>

<Modal
  title="Entries"
  bind:open={$viewAllModal}
  autoclose
  outsideclose
  class="custom-scrollbar"
>
  <div class="flow-root">
    <ul
      role="list"
      class="divide-y divide-gray-200 dark:divide-gray-700 custom-scrollbar"
    >
      {#each $entries as entry}
        <!-- content here -->
        <li class="py-3 sm:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <object
                class="w-8 h-8 rounded-full"
                type="image/webp"
                title=""
                data={`https://icon.horse/icon/${entry.original}`}
              >
                <img src="/img/world-wide-web.png" alt="World wide web" />
              </object>
            </div>
            <div class="flex-1 min-w-0 text-base font-semibold ms-4">
              <a
                href={`http://${entry.original}`}
                class="truncate hover:underline excludedText"
              >
                {entry.original}
              </a>
            </div>
            <div
              class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
            >
              <a
                href={`http://${$shortenedDomain}/${entry.shortened}`}
                class="hover:underline excludedText"
              >
                {`${$shortenedDomain}/${entry.shortened}`}
              </a>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
  <svelte:fragment slot="footer">
    <div class="mx-auto">
      <Button color="alternative" outline class="mr-2">Close</Button>
      <Button
        color="none"
        class="font-medium text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-700"
      >
        Okay
      </Button>
    </div>
  </svelte:fragment>
</Modal>
