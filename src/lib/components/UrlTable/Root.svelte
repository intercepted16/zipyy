<script lang="ts">
  import Actions from "./Actions.svelte";
  import DataTableCheckbox from "./Checkbox.svelte";
  import { shortenSchema as schema } from "$types/validation/schema";
  import { editDialog, id, shortenedUrlsRoute } from "$store";
  import { createRender, createTable, Subscribe, Render } from "svelte-headless-table";
  import { cn } from "$lib/utils";
  import { Button } from "$ui/button";
  import * as Table from "$lib/components/ui/table";
  import {
    addHiddenColumns,
    addPagination,
    addSelectedRows,
    addSortBy,
    addTableFilter
  } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import { superForm, type SuperForm } from "sveltekit-superforms";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import ArrowUpDown from "$lucide/arrow-up.svelte";
  import { Input } from "$ui/input";
  import type { ShortenedUrls } from "$types/database/schema";
  import { urlData } from "$store";
  export let superFrm: SuperValidated<Infer<typeof schema>>;
  const editForm = superForm(superFrm, {
    validators: zodClient(schema),
    onSubmit: ({ formData }) => {
      formData.set("id", $id.toString());
    },
    onUpdated: async ({ form }) => {
      if (!form.valid) return 1;
      $editDialog = false;
      urlData.reset();
    }
  });
  export let supabase: SupabaseClient;
  function createUrlTable(urlData: ShortenedUrls[]) {
    const table = createTable(readable(urlData), {
  sort: addSortBy({ disableMultiSort: true }),
  page: addPagination(),
  filter: addTableFilter({
    fn: ({ filterValue, value }) => value.includes(filterValue)
  }),
  select: addSelectedRows(),
  hide: addHiddenColumns()
});
    const columns = table.createColumns([
      table.column({
        header: (_, { pluginStates }) => {
          const { allPageRowsSelected } = pluginStates.select;
          return createRender(DataTableCheckbox, {
            checked: allPageRowsSelected
          });
        },
        accessor: "id",
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
        header: "Original",
        accessor: "original",
        cell: ({ value }) => (value as string).toLowerCase(),
        plugins: {
          filter: {
            getFilterValue(value: string) {
              return value.toLowerCase();
            }
          }
        }
      }),
      table.column({
        header: "Shortened",
        accessor: "shortened",
        cell: ({ value }) => {
          return `${shortenedUrlsRoute}/${value}`;
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
        header: "",
        accessor: ({ id }) => id,
        cell: ({ row }) => {
          return createRender(Actions, {
            shortened: $urlData[row.id as unknown as number].shortened as string,
            id: $urlData[row.id as unknown as number].id,
            superFrm: editForm as SuperForm<Infer<typeof schema>>,
            supabase
          });
        },
        plugins: {
          sort: {
            disable: true
          }
        }
      })
    ]);
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
      table.createViewModel(columns);
    const { sortKeys } = pluginStates.sort;
    const { hiddenColumnIds } = pluginStates.hide;
    const ids = flatColumns.map((c) => c.id);
    const hideForId = Object.fromEntries(ids.map((id) => [id, true]));
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
    const { selectedDataIds } = pluginStates.select;
    return {
      ids,
      hiddenColumnIds,
      hideForId,
      selectedDataIds,
      filterValue,
      columns,
      flatColumns,
      table,
      headerRows,
      sortKeys,
      hasNextPage,
      hasPreviousPage,
      pageIndex,
      pageRows,
      tableAttrs,
      tableBodyAttrs,
      rows
    };
  }

  type createUrlTable = ReturnType<typeof createUrlTable>;
  let columns: createUrlTable["columns"];
  let ids: createUrlTable["ids"];
  let flatColumns: createUrlTable["flatColumns"];
  let pageRows: createUrlTable["pageRows"];
  let tableAttrs: createUrlTable["tableAttrs"];
  let sortKeys: createUrlTable["sortKeys"];
  let hasNextPage: createUrlTable["hasNextPage"];
  let hasPreviousPage: createUrlTable["hasPreviousPage"];
  let pageIndex: createUrlTable["pageIndex"];
  let filterValue: createUrlTable["filterValue"];
  let rows: createUrlTable["rows"];
  let selectedDataIds: createUrlTable["selectedDataIds"];
  let headerRows: createUrlTable["headerRows"];
  let hiddenColumnIds: createUrlTable["hiddenColumnIds"];
  let tableBodyAttrs: createUrlTable["tableBodyAttrs"];

  $: {
    ({
      ids,
      hiddenColumnIds,
      columns,
      flatColumns,
      pageRows,
      tableAttrs,
      sortKeys,
      hasNextPage,
      hasPreviousPage,
      pageIndex,
      filterValue,
      rows,
      selectedDataIds,
      headerRows,
      tableBodyAttrs
    } = createUrlTable($urlData));
  }
</script>

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
          <Table.Root {...tableAttrs}>
            <Table.Header>
              {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                  <Table.Row>
                    {#each headerRow.cells as cell (cell.id)}
                      <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                        <Table.Head {...attrs} class={cn("[&:has([role=checkbox])]:pl-3")}>
                          {#if cell.id === "amount"}
                            <div class="text-right font-medium">
                              <Render of={cell.render()} />
                            </div>
                          {:else if cell.id === "email"}
                            <Button variant="ghost" on:click={props.sort.toggle}>
                              <Render of={cell.render()} />
                              <ArrowUpDown
                                class={cn(
                                  $sortKeys[0]?.id === cell.id && "text-foreground",
                                  "ml-2 h-4 w-4"
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
                  <Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && "selected"}>
                    {#each row.cells as cell (cell.id)}
                      <Subscribe attrs={cell.attrs()} let:attrs>
                        <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                          {#if cell.id === "shortened"}
                            <a
                              href={`${shortenedUrlsRoute}/${
                                // @ts-ignore: Object is possibly "null".
                                $urlData[row.id].shortened
                              }`}
                              class="text-right font-medium">
                              <Render of={cell.render()} />
                            </a>
                          {:else if cell.id === "original"}
                            <a
                              href={`https://${
                                // @ts-ignore: Object is possibly "null".
                                $urlData[row.id].original
                              }`}
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
            {Object.keys($selectedDataIds).length} of{" "}
            {$rows.length} row(s) selected.
          </div>
          <Button
            variant="outline"
            size="sm"
            on:click={() => ($pageIndex = $pageIndex - 1)}
            disabled={!$hasPreviousPage}
            >Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!$hasNextPage}
            on:click={() => ($pageIndex = $pageIndex + 1)}
            >Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
