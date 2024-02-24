<script lang="ts">
  import { Button } from '$ui/button';
  import * as Form from '$ui/form';
  import { shortenSchema as schema } from '$lib/schema';
  import type { ActionData } from './$types';
  import { Github } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Dialog from '$ui/dialog';
  import { id, editDialog } from '$store';
  export let data;
  export let form: ActionData;
  let open: boolean;
  import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
  import {
    addSortBy,
    addPagination,
    addTableFilter,
    addSelectedRows,
    addHiddenColumns
  } from 'svelte-headless-table/plugins';
  import { readable } from 'svelte/store';
  import * as Table from '$lib/components/ui/table';
  import Actions from '$lib/components/data-table-actions.svelte';
  import { cn } from '$lib/utils';
  import { Input } from '$lib/components/ui/input';
  import DataTableCheckbox from '$lib/components/data-table-checkbox.svelte';
  import { ArrowUpDown, ChevronDown } from 'lucide-svelte';
  import { invalidate } from '$app/navigation';

  type urlData = {
    id: number;
    original: string;
    shortened: string;
    user_id: number | null;
  };

  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  let { urls: urlData } = data;
  $: ({ urls: urlData } = data);
  const superFrm = superForm(data.form, {
    validators: zodClient(schema),
    onUpdated: async ({ form }) => {
      console.log(form);
      if (!form.valid) return 1;
      open = true;
      console.log(await invalidate('urls'));
    }
  });

  const editForm = superForm(data.editForm, {
    validators: zodClient(schema),
    onSubmit: ({ formData }) => {
      formData.set('id', $id.toString());
    },
    onUpdated: async ({ form }) => {
      if (!form.valid) return 1;
      $editDialog = false;
      console.log(await invalidate('urls'));
    }
  });

  const { enhance, form: formData } = superFrm;

  let table;
  let columns;
  let headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows;
  let sortKeys;
  let hiddenColumnIds;
  let ids;
  let hideForId;
  let hasNextPage, hasPreviousPage, pageIndex;
  let filterValue;
  let selectedDataIds;

  function createUrlTable(urlData: urlData[]) {
    console.log('creating url table...');
    if (urlData?.length > 0) {
      table = createTable(readable(urlData), {
        sort: addSortBy({ disableMultiSort: true }),
        page: addPagination(),
        filter: addTableFilter({
          fn: ({ filterValue, value }) => value.includes(filterValue)
        }),
        select: addSelectedRows(),
        hide: addHiddenColumns()
      });
      columns = table.createColumns([
        table.column({
          header: (_, { pluginStates }) => {
            const { allPageRowsSelected } = pluginStates.select;
            return createRender(DataTableCheckbox, {
              checked: allPageRowsSelected
            });
          },
          accessor: 'id',
          cell: ({ row }, { pluginStates }) => {
            const { getRowState } = pluginStates.select;
            const { isSelected } = getRowState(row);
            return createRender(DataTableCheckbox, {
              checked: isSelected
            });
          },
          plugins: {
            sort: {
              disable: true
            },
            filter: {
              exclude: true
            }
          }
        }),
        table.column({
          header: 'Original',
          accessor: 'original',
          cell: ({ value }) => value.toLowerCase(),
          plugins: {
            filter: {
              getFilterValue(value: string) {
                return value.toLowerCase();
              }
            }
          }
        }),
        table.column({
          header: 'Shortened',
          accessor: 'shortened',
          cell: ({ value }) => {
            return `sh.ps.ai/${value}`;
          },
          plugins: {
            sort: {
              disable: true
            },
            filter: {
              exclude: true
            }
          }
        }),
        table.column({
          header: '',
          accessor: ({ id }) => id,
          cell: ({ row }) => {
            return createRender(Actions, {
              shortened: urlData[row.id as unknown as number].shortened,
              id: urlData[row.id as unknown as number].id,
              superFrm: editForm,
              data
            });
          },
          plugins: {
            sort: {
              disable: true
            }
          }
        })
      ]);
      ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
        table.createViewModel(columns));
      ({ sortKeys } = pluginStates.sort);
      ({ hiddenColumnIds } = pluginStates.hide);
      ids = flatColumns.map((c) => c.id);
      hideForId = Object.fromEntries(ids.map((id) => [id, true]));
      ({ hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page);
      ({ filterValue } = pluginStates.filter);
      ({ selectedDataIds } = pluginStates.select);
    }
  }
  $: {
    console.log(urlData);
    // @ts-expect-error
    createUrlTable(urlData);
  }
</script>

<div class="flex flex-col items-center max-w-screen-xl mx-auto text-center">
  <a
    href="#top"
    class="inline-flex items-center justify-between px-1 py-1 pl-4 pr-4 text-sm text-gray-700 bg-gray-100 rounded-full mb-7 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
    <span class="text-sm font-medium">Signup for all features.</span>
    <ChevronDown class="w-4 h-4 mt-1 ml-2" />
  </a>
  <div class="container flex flex-col items-center justify-center p-4 mx-auto text-center">
    <div class="relative z-[1] space-y-6 pb-24">
      <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        The best <span class="text-green-500 excludedText">URL shortener</span>.
      </div>
      <p
        class="max-w-xl mb-8 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
        A no-nonsense, free, private URL shortener you can trust. No accounts, no limits, no bloat!
        Built using
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap">Flask</strong>,
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >Tailwind CSS</strong>
        &
        <strong class="font-medium text-slate-800 dark:text-white whitespace-nowrap"
          >JavaScript</strong
        >.
      </p>
      <div class="flex flex-wrap gap-3 md:justify-center md:space-x-3">
        <Button
          href="/source"
          class="w-full btn md:btn-lg md:w-fit variant-ringed-surface hover:variant-filled-secondary"
          ><Github />
          View on Github</Button>
        <Button class="w-full btn md:btn-lg md:w-fit variant-filled-primary">Get started</Button>
      </div>
    </div>
  </div>
  <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
    <span class="font-semibold text-gray-400 uppercase excludedText">Really?</span>
    <div
      class="flex flex-wrap mt-8 text-gray-500 sm:justify-between *:flex *:items-center *:justify-center *:opacity-50 [&>*:hover]:opacity-100">
      <a
        href="https://bitly.com"
        class="mb-5 mr-5 text-black dark:text-white flex-center lg:mb-0 text-nowrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          id="bitly"
          ><defs><path id="a" d="M.014 48H48V0H.014z"></path></defs><g
            fill="none"
            fill-rule="evenodd"
            ><g transform="translate(-403 -952)"
              ><g transform="translate(403 952)"
                ><mask id="b" fill="#fff"><use xlink:href="#a"></use></mask><path
                  class="dark:fill-white fill-black"
                  d="M26.16 42.6c-2.694.048-4.658-.818-4.779-3.172-.045-.884-.03-1.824.013-2.392.26-3.44 2.666-5.915 5.04-6.39 2.954-.591 4.922.76 4.922 4.626 0 2.613-.726 7.25-5.196 7.329zM23.89 0C10.667 0 0 10.615 0 24.496c0 7.197 3.85 14.15 9.264 18.328 1.042.805 2.284.731 2.996.041.6-.58.55-1.98-.566-2.96-4.328-3.807-7.32-9.569-7.32-15.324 0-10.336 9.178-19.033 19.517-19.033 12.584 0 19.313 10.22 19.313 18.881 0 5.293-2.588 11.684-7.26 15.76.007-.019.97-1.913.97-5.603 0-6.28-3.98-9.683-8.597-9.683-3.343 0-5.344 1.195-6.706 2.31 0-2.559.085-7.336.085-7.336 0-3.154-1.104-5.678-4.955-5.733-2.228-.032-3.882.99-4.913 3.3-.372.868-.235 1.809.5 2.236.608.353 1.607.091 2.102-.57.33-.412.516-.5.803-.469.473.05.49.813.51 1.3.014.375.378 5.811.179 19.78 0 3.853 3.022 8.279 10.258 8.279 3.115 0 5.507-.87 8.982-2.845C40.452 42.149 48 35.482 48 24.206 48 10.116 36.59 0 23.89 0z"
                  mask="url(#b)"></path
                ></g
              ></g
            ></g
          ></svg>
      </a>
      <a
        href="#top"
        class="mb-5 mr-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400 opacity-80">
        <svg
          width="180"
          height="50"
          version="1.2"
          class="grayscale"
          xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="50" fill="#17527d" />
          <g transform="matrix(.99605 0 0 1 .0045556 0)" fill="#fff" stroke-width=".9779">
            <path
              d="m14.269 37.814h-5.577q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-17.676h-5.0607q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-4.356q0-0.684 0.27541-0.972 0.30984-0.324 0.96393-0.324h18.177q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v4.356q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288h-5.0607v17.676q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288z"
              color="#ffffff" />
            <path
              d="m27.902 37.814q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-4.284q0-0.684 0.27541-0.972 0.30984-0.324 0.96393-0.324h3.4082v-12.096h-3.4082q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-4.356q0-0.684 0.27541-0.972 0.30984-0.324 0.96393-0.324h14.666q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v4.356q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288h-3.3393v12.096h3.3393q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v4.284q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288z"
              color="#ffffff" />
            <path
              d="m56.51 37.814h-5.1639q-0.6541 0-0.96394-0.288-0.27541-0.324-0.27541-1.008v-23.328q0-0.684 0.27541-0.972 0.30984-0.324 0.96394-0.324h3.5803q0.6541 0 1.1016 0.216 0.48197 0.216 0.92951 0.756l6.6787 7.992v-7.668q0-0.684 0.27541-0.972 0.30984-0.324 0.96394-0.324h5.1639q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v23.328q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288h-5.1639q-0.6541 0-0.96394-0.288-0.27541-0.324-0.27541-1.008v-4.428l-5.8869-7.452v11.88q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288z"
              color="#ffffff" />
            <path
              d="m90.661 37.814h-5.577q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-4.608l-5.2672-7.38q-0.7918-1.116-1.0672-1.944-0.24098-0.828-0.24098-2.484v-6.912q0-0.684 0.27541-0.972 0.30984-0.324 0.96393-0.324h5.3016q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v5.904q0 0.36 0.03442 0.756 0.03443 0.396 0.27541 0.756l1.5836 2.592q0.17213 0.324 0.34426 0.468 0.20656 0.144 0.48197 0.144h0.34426q0.27541 0 0.44754-0.144 0.20656-0.144 0.37869-0.468l1.5836-2.592q0.24098-0.36 0.27541-0.756 0.03442-0.396 0.03442-0.756v-5.904q0-0.684 0.27541-0.972 0.30984-0.324 0.96393-0.324h5.1295q0.65409 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v6.912q0 1.656-0.27542 2.484-0.27541 0.828-1.0328 1.944l-5.2328 7.416v4.572q0 0.684-0.30984 1.008-0.27541 0.288-0.92951 0.288z"
              color="#ffffff" />
            <path
              d="m125.53 31.01q0 1.656-0.48197 3.024-0.44754 1.332-1.6525 2.304-1.1705 0.936-3.2361 1.476-2.0656 0.54-5.2672 0.54t-5.2672-0.54q-2.0656-0.54-3.2705-1.476-1.1705-0.972-1.6525-2.304-0.44754-1.368-0.44754-3.024v-17.82q0-0.684 0.27541-0.972 0.30984-0.324 0.96394-0.324h5.4049q0.65411 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v16.416q0 0.72 0.51639 1.224 0.5164 0.468 2.3066 0.468 1.8246 0 2.341-0.468 0.5164-0.504 0.5164-1.224v-16.416q0-0.684 0.2754-0.972 0.30984-0.324 0.96394-0.324h5.2328q0.65409 0 0.9295 0.324 0.30984 0.288 0.30984 0.972z"
              color="#ffffff" />
            <path
              d="m139.96 18.374v4.608h2.582q0.89508 0 1.2049-0.468 0.30983-0.504 0.30983-1.224v-1.224q0-0.72-0.30983-1.188-0.30984-0.504-1.2049-0.504zm-1.2393 19.44h-5.3016q-0.6541 0-0.96393-0.288-0.27541-0.324-0.27541-1.008v-23.328q0-0.684 0.27541-0.972 0.30983-0.324 0.96393-0.324h11.464q3.8557 0 5.3016 1.692 1.4803 1.656 1.4803 4.32v1.656q0 1.512-0.44754 2.592-0.41312 1.044-1.4803 1.512 1.859 0.216 2.9951 1.584 1.1705 1.368 1.1705 3.636v7.632q0 0.684-0.30983 1.008-0.27541 0.288-0.92951 0.288h-5.3361q-0.6541 0-0.96394-0.288-0.2754-0.324-0.2754-1.008v-5.508q0-0.792-0.30984-1.152-0.27542-0.396-0.99837-0.396h-4.8197v7.056q0 0.684-0.30983 1.008-0.27541 0.288-0.9295 0.288z"
              color="#ffffff" />
            <path
              d="m178.59 37.814h-17.523q-0.6541 0-0.96394-0.288-0.2754-0.324-0.2754-1.008v-23.328q0-0.684 0.2754-0.972 0.30984-0.324 0.96394-0.324h5.3361q0.6541 0 0.92951 0.324 0.30984 0.288 0.30984 0.972v17.82h4.7164v-5.832q0-0.684 0.2754-0.972 0.30984-0.324 0.96393-0.324h4.9918q0.65411 0 0.92952 0.324 0.30983 0.288 0.30983 0.972v11.34q0 0.684-0.30983 1.008-0.27541 0.288-0.92952 0.288z"
              color="#ffffff" />
          </g>
        </svg>
      </a>
      <a href="#top" class="mb-5 mr-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
        <span class="ml-2 text-xl font-semibold">hi</span>
      </a>
    </div>
  </div>
</div>
<div
  class="mx-auto rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 dark:text-white dark:bg-gray-900">
  <div class="p-6 space-y-4 md:space-y-6 sm:p-8 dark:text-white">
    <h1
      class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Shorten a URL...
    </h1>
    <div>
      <form method="POST" action="?/shorten" class="space-y-2" use:enhance>
        <Form.Field form={superFrm} name="url">
          <Form.Control let:attrs>
            <Form.Label>URL</Form.Label>
            <Input bind:value={$formData.url} {...attrs} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>

        <Dialog.Root bind:open>
          <Dialog.Trigger>hi</Dialog.Trigger>
          <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
              <Dialog.Title>Your shortened URL</Dialog.Title>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
              <div class="grid items-center gap-4">
                <span
                  >Original: <a href={`https://${form?.original ?? 'google.com'}`}
                    >{form?.original ?? 'google.com'}</a
                  ></span>
              </div>
              <div class="grid items-center gap-4">
                <span
                  >Shortened: <a href={`https://${form?.shortened ?? 'sh.ps.ai/dma)F1'}`}
                    >{form?.shortened ?? 'sh.ps.ai/dma)F1'}</a
                  ></span>
              </div>
            </div>
            <Dialog.Footer>
              <Button type="submit" class="mb-2 sm:mb-0 w-full" on:click={() => (open = false)}
                >Okay</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
        <Form.Button class="w-full">Shorten</Form.Button>
      </form>
    </div>
  </div>
</div>
{#if urlData?.length > 0}
  <div
    class="mx-auto rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 dark:text-white dark:bg-gray-900 mt-5">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8 dark:text-white">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Your shortened URLs
      </h1>
      <div>
        <div class="w-full">
          <div class="flex items-center py-4">
            <Input
              class="max-w-sm"
              placeholder="Filter shortened URLs..."
              type="text"
              bind:value={$filterValue} />
          </div>
          <div class="rounded-md border">
            <Table.Root {...$tableAttrs}>
              <Table.Header>
                {#each $headerRows as headerRow}
                  <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                      {#each headerRow.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                          <Table.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
                            {#if cell.id === 'amount'}
                              <div class="text-right font-medium">
                                <Render of={cell.render()} />
                              </div>
                            {:else if cell.id === 'email'}
                              <Button variant="ghost" on:click={props.sort.toggle}>
                                <Render of={cell.render()} />
                                <ArrowUpDown
                                  class={cn(
                                    $sortKeys[0]?.id === cell.id && 'text-foreground',
                                    'ml-2 h-4 w-4'
                                  )} />
                              </Button>
                            {:else}
                              <Render of={cell.render()} />
                            {/if}
                          </Table.Head>
                        </Subscribe>
                      {/each}
                    </Table.Row>
                  </Subscribe>
                {/each}
              </Table.Header>
              <Table.Body {...$tableBodyAttrs}>
                {#each $pageRows as row (row.id)}
                  <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
                      {#each row.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                          <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                            {#if cell.id === 'shortened'}
                              <a
                                href={`https://sh.ps.ai/${urlData[row.id].shortened}`}
                                class="text-right font-medium">
                                <Render of={cell.render()} />
                              </a>
                            {:else if cell.id === 'original'}
                              <a
                                href={`https://${urlData[row.id].original}`}
                                class="text-right font-medium">
                                <Render of={cell.render()} />
                              </a>
                            {:else}
                              <Render of={cell.render()} />
                            {/if}
                          </Table.Cell>
                        </Subscribe>
                      {/each}
                    </Table.Row>
                  </Subscribe>
                {/each}
              </Table.Body>
            </Table.Root>
          </div>
          <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
              {Object.keys($selectedDataIds).length} of{' '}
              {$rows.length} row(s) selected.
            </div>
            <Button
              variant="outline"
              size="sm"
              on:click={() => ($pageIndex = $pageIndex - 1)}
              disabled={!$hasPreviousPage}>Previous</Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!$hasNextPage}
              on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
