# CRUD reference

This document identifies the reference files for new CRUD screens and the shared engines that control table/form behavior.

`@2enapps/ui` supplies the engines. `general-tab-crud` demonstrates the complete list-to-details flow, including search, dashboards and nested tabs.

## 1. Which reference to use

| Task | Reference |
| --- | --- |
| New CRUD screen (list → details) | `views/ui-element/general-tab-crud/list-main.vue` |
| Table behavior (bulk, print, reports, upload) | `@2enapps/ui` → `components/dynamic-form/generated-form/list-data.vue` |
| Form behavior (inputs, validation) | `@2enapps/ui` → `components/dynamic-form/generated-form/form-data.vue` |
| One-click list → details navigation | `detailsBreadcrumbMixin` from `@2enapps/ui` |

Do not substitute other screens as the complete reference. `general-crud` (without tabs), `training/crud/list` and the Shell administration screens cover narrower flows.

## 2. Files in `general-tab-crud/`

| File | Historical lines | Purpose |
| --- | --- | --- |
| `list-main.vue` | 781 | **Main reference:** list, search, dashboard and tabs |
| `tab.vue` | 248 | Tab wrapper loading six child screens |
| `details-one.vue` | 862 | Most complete details form |
| `details-two.vue` | 419 | Simple details form |
| `details-three.vue` | 262 | Display-only details |
| `details-four.vue` | 217 | Deeply nested tab details |
| `list-two.vue` | 387 | Child list (tab 2) |
| `list-three.vue` | 400 | Child list (tab 3) |
| `list-four.vue` | 405 | Child list (tab 4) |
| `list-five.vue` | 410 | Child list (tab 5) |

Start with `list-main.vue`. Read `details-one.vue` when forms need validation and lookups. Line counts describe the reference revision; inspect the actual files rather than treating these counts as current verification.

## 3. Running the reference

The reference route is registered in `shell/src/router/training-routes.js`:

```text
path: "/ui-element/general-tab-crud/list"
component: () => import("training/views/ui-element/general-tab-crud/list-main")
```

With the reference Shell running at its configured port, open `http://localhost:2400/ui-element/general-tab-crud/list`.

No backend is required by the reference fixture service. `services/training/crud.js` uses fixtures and `await delay()` to simulate network latency, without HTTP calls. This does not prove the route or server is currently running.

## 4. Data flow

### List

```text
created()
  → getSchemaList()          populate this.schemaList (table structure)
  → getSchemaFormCarian()    populate this.schemaFormCarian (search form)
  → initStatsSchema()        dashboard card structure
  → loadDashboardStats()     populate this.statsData from the service

user action → listData @paginatedProps(page)
  → getList(page)
      params = getParams("", page, this)
      finalRes = await getMainList(params, viewsType, roleType)
      this.totalRecord = finalRes.total
      this.list        = finalRes.list
      this.listCondition(this.list)     → assignSchemaToListData per row
  → this.list = ...
```

`getParams` reads `this.qSearch` and `this.searchObject` and supplies `pageSize` and `pageNo`. Use it instead of assembling separate search/pagination parameters.

### List → details

Use `detailsBreadcrumbMixin`; do not introduce separate `showDetailsForm` or ID state:

```js
listActions({ functionProps: { functionName }, data }) {
  if (functionName === "show")      this.openDetails(data.id, "view", data.nama);
  else if (functionName === "edit") this.openDetails(data.id, "",     data.nama);
  else if (functionName === "delete") this.deleteData(data.id);
}

onAddClick() { this.openDetails("", ""); }
```

The third `openDetails` argument is the breadcrumb label. Supply the record name; if absent, the mixin falls back to the locale’s `breadcrumb.details` value.

`backToList()` and `onBreadcrumbScreenChange()` come from the same mixin. Do not reimplement them.

## 5. Service contract

Preserve the shape used by `@/services/training/crud`:

```js
// Always wrap list responses with returnResponseList.
export async function getMainList(params, viewsType, roleType) {
  const response = {
    data: {
      data: page,        // array of rows
      pageNo,
      totalItems,       // total records, not page count
      totalPages,
    },
  };
  return returnResponseList(url, response);
}
```

`returnResponseList` in `services/training/http.js` adds two aliases to the same envelope:

| Field | Source | View consumer |
| --- | --- | --- |
| `res.list` | `res.data.data` | `getList()` → `this.list` |
| `res.total` | `res.data.totalItems` | `getList()` → `this.totalRecord` |

Report export through `getListForReport` reads `finalRes.data?.data` directly. Do not discard `response.data` after wrapping.

| Signature | Purpose |
| --- | --- |
| `getDetailsOne(id)` | Load one record through `returnResponseDetails` |
| `saveDetails(id, data)` | Empty ID creates; an existing ID updates |
| `deleteRecord(id)` | Delete and return `true`, only when domain requirements support deletion |
| `getListTwo/T Three(params, viewsType, roleType)` | Child lists inside tabs |
| `getDashboardStats()` | Dashboard card values |
| `getSummaryStats()` | Summary for `general-crud` without tabs |

## 6. Features wired in `list-main.vue`

| Feature | Location | Notes |
| --- | --- | --- |
| Server-side pagination | `getList(page)` | `:backendPaginated="true"` + `@paginatedProps` |
| Advanced search | `ComponentCarian` | Simple `qSearch` and full `searchObject` modes |
| Reset search | `onResetSearchClick()` | Clear both search modes together |
| Bulk selection | `@listMultipleSelectActions` | Requires `listSchema.multipleSelectabled` |
| Row action | `@listActions` | show / edit / delete |
| Row link action | `@listLinkActions` | Open details when the name is clicked |
| Report export | `getListForReport(type)` | Synchronize dropdown labels first |
| Printing | `schemaList.allowPrint: true` | Enabled in the reference screen |
| Dynamic columns | `@updateDisplayListField` | Save changes to `this.schemaList` |
| Dashboard cards | `StatCardGrid` | `statsSchema` + `statsData` + `statsLoading` |
| Tabs | `<tab>` → `tab.vue` | Six child screens in the reference |
| Breadcrumb | `detailsBreadcrumbMixin` | Do not implement manually |
| Permissions | `priv()` → `layoutStore.priv` | `flagDaftar` / `flagKemaskini` / `flagHapus` |
| Notifications | Computed `notificationProp` | `notificationStore` |
| Validation | `customValidator` | `standardValidation(field, self)` |

Enable only features required by actual module functions. Reference wiring does not itself authorize domain actions.

## 7. What to replace when adapting the example

Fixtures in `services/training/crud.js` include:

- `senaraiAccountPengguna`: list data.
- `getDashboardStats()`: `await delay(900)` followed by hardcoded values.
- `listTwo`: child list data.
- `getMainList`: demo-only `parseQuery` and `applyFilters`; real backend services own pagination and filtering.

`schemaFormCarian` dropdown `listData` is derived from fixtures. Ensure choices match relevant demo data during prototyping. Replace them with authoritative options during real integration; do not offer irrelevant choices.

## 8. Do not copy blindly

The reference revision reported zero ESLint errors and five `no-unused-expressions` warnings. These are historical observations, not results from the current checkout.

`formActions(data)` and `listMultipleSelectActions(payload)` contain stub expressions such as `data;` and `payload;`. Implement required behavior or remove unused stubs. Do not copy unused `infoSwal`, `confirmSwal` or `privSwal` imports.

## 9. When to inspect the shared engine

Inspect `list-data.vue` when required table behavior is not already understood. Changing the shared engine requires separate authorization; do not patch installed library files during module implementation.

The reference revision of `components/dynamic-form/generated-form/list-data.vue` had 2,291 lines and 16 props. It already included bulk selection, printing, report/Excel export through `setting-laporan`, upload, modals, validation, search and pagination. Inspect the actual revision before asserting support or counts.

Props in that reference:

```text
listSchema, listData, totalRecord, backendPaginated,
propListDataReport, reportSearch, customDisplayField,
viewMode, fontSize, removeStripe, offScroll,
hideTopPagination, setUsePagination, propSchemaDataReport,
propSchemaDataReportAsal, listDataFooter
```

Read the engine when investigating table behavior; do not assume its internal flow from a thin example screen.

## 10. Module fixture and upload examples

Generated `src/services/{module}/hardcode-data.js` provides synthetic document rows through `createDemoDocuments()`. Use independent copies in Phase 2 prototypes; replace them with real services in Phase 3 without fixture fallbacks.

Generated `src/services/{module}/upload.js` contains a `documentUploadField` matching the shared GeneratedFormData upload schema, with `type: "file"`, example `size: 5`, `align: "center"` and `process.env.VUE_APP_BUCKET_{MODULE}`. Tus configuration is commented out. Adapt the field and required/size/type validation to the actual domain contract. No live upload is wired automatically; Phase 2 remains offline.

For authorized integration, shared form uploads delegate through @2enapps/ui to the host. Do not call `uploadExampleAttachment` as well as the form’s uploader for the same file. `uploadReadClient()` retrieves the host client for authorized stored-artifact reads; the upload helper itself has no `.get` method. Do not copy V2T’s ASR endpoint into unrelated modules or invent uploaded-object metadata for fixtures.

## Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. New scaffolds do not create per-submodule service folders. Existing workspaces are not automatically renamed.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.
