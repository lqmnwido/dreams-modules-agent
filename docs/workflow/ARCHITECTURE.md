# D-ReAMS — shared architecture

Shared standards for every module. Module business requirements belong in SCOPE.md.

## System boundaries

- Each module has its own backend and **separate PostgreSQL database**. Only the owning module’s backend, workers and migration process may access that database.
- Other modules access data through the owning module’s API. Do not share database credentials or use cross-database queries, joins, foreign keys, repositories or entities.
- A separate database means a module-owned database, not different schemas inside one shared database. Deployment determines physical server placement.
- The UI uses Vue MFE. Shell loads remote frontends through Module Federation (`remoteEntry.js`/exposes). HTTP/REST APIs carry business data; they are separate from frontend remotes.
- Shell owns the side menu, navbar, application layout, login/logout, SSO, token refresh and route guards. Modules do not build their own login, SSO or Shell chrome.
- `@2enapps/ui` supplies components, helpers and styles. The Kai dependency is `git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop`.
- Integrated frontend services use the module transport and host-supplied credentials. The backend still validates tokens and record access; hiding a menu is not a security control.

```text
Shell ──Module Federation──> {module}_fe remote
                              │ REST API
                              ▼
                         {module}_be ──> own module database
                              │ API only
                              ▼
                         other module backend ──> its own database
```

## Workspace

```text
workspace/
├── AGENTS.md
├── .docs/
│   ├── PRD.md
│   ├── SCOPE.md
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── DATABASE.md
│   ├── FRONTEND.md
│   ├── TESTING.md
│   ├── USERMANUAL.md
│   └── documents/
├── module.config.json
├── document-integrity.json
├── scripts/maintenance.mjs
├── evidence/
├── {module}_fe/
├── {module}_be/
└── shell/
```

## Frontend

```text
{module}_fe/
├── package.json
├── exposes.js                 # single federation contract
├── vue.config.js              # federation/publicPath/singletons
├── .env                       # VUE_APP_REMOTE=off by default
├── .env.local
├── .env.example
├── CRUD-REFERENCE.md
└── src/
    ├── remote-entry.js
    ├── metadata.js
    ├── services/
    │   ├── {module}/
    │   │   ├── https.js
    │   │   └── {submodule}.service.js
    │   └── training/
    └── views/
        ├── {submodule}/{ScreenName}.vue
        └── ui-element/
```

Shell integration happens after standalone prototypes are accepted. The standalone harness is for development/testing only; do not build a second Shell. Ask first if the harness requires scaffold changes; this work does not authorize changing the scaffold.

## Backend

Example package: `com.dreams.memorial`. Actual names and packages follow the module configuration.

```text
memorial_be/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/dreams/memorial/
    │   │   ├── MemorialApplication.java
    │   │   ├── config/
    │   │   ├── security/
    │   │   ├── common/
    │   │   ├── entity/
    │   │   ├── repository/
    │   │   ├── form/{submodule}/
    │   │   ├── service/{submodule}/
    │   │   └── controller/{submodule}/
    │   └── resources/
    │       ├── application.properties
    │       └── db/migration/   # Flyway; own module database
    └── test/java/com/dreams/memorial/
```

Use Spring Boot, Java 25 and PostgreSQL. Dependency direction: controller → service → repository → entity/own database. Services own transactions; repositories handle data access. Use one entity per table and group controllers, services and forms by submodule. Keep only genuinely shared module infrastructure in `common/`.

## Required UI references

| Purpose | Reference |
| --- | --- |
| CRUD list → details | `src/views/ui-element/general-tab-crud/list-main.vue` |
| Tabs and children | `tab.vue`, `details-one.vue` through `details-four.vue`, `list-two.vue` through `list-five.vue` in the same folder |
| Table engine | `@2enapps/ui` → `components/dynamic-form/generated-form/list-data.vue` |
| Form engine | `@2enapps/ui` → `components/dynamic-form/generated-form/form-data.vue` |
| Breadcrumb/details | `detailsBreadcrumbMixin` from `@2enapps/ui` |

Do not replace the main reference with `general-crud`, `training/crud/list` or Shell administration screens. Read the current implementation; historical line counts and warning counts can change and are not current verification evidence.

Use existing shared UI components only. If a component is unavailable, show an empty shared card with the exact label `[ component not available ]` and record the gap in FRONTEND.md. Do not create alternative buttons, inputs, modals, CSS or components. Do not patch the Kai library or node_modules to hide the gap.

## Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. Keep the API entry flat; use an optional services/{module}/{submodule}/ directory for extracted supporting modules. Existing workspaces are not automatically renamed.

## Frontend data contracts

- `created()` initializes the list schema, search schema, statistics schema and statistics data.
- `getList(page)` uses `getParams("", page, this)` for `qSearch`, `searchObject`, `pageSize` and `pageNo`; do not build pagination/filter parameters separately.
- `getMainList(params, viewsType, roleType)` uses `returnResponseList(url, response)`. Preserve the HTTP envelope: `response.data.data`, `pageNo`, `totalItems`, `totalPages`, and the helper’s `res.list`/`res.total` aliases.
- Views read `finalRes.list` and `finalRes.total`; exports may read `finalRes.data?.data`. Do not discard the original envelope.
- Use `detailsBreadcrumbMixin`: `openDetails(id, mode, nama)`, `backToList()` and `onBreadcrumbScreenChange()`. Do not create a separate `showDetailsForm` or ID/navigation mechanism.
- `getDetailsOne(id)` uses `returnResponseDetails`; `saveDetails(id,data)` distinguishes creation from updates through the ID. Adapt domain names while preserving the contract shape.
- Enable delete, bulk, export and print actions only when domain requirements call for them; a UI example does not automatically grant deletion rights.
- Phase 2 only: label fixtures as demo data and prepare real API calls as inactive comments. In Phase 3, the server owns filtering/pagination; never fall back to fixtures after an API failure.

## Metadata after all prototypes are accepted

User-supplied V2T example. Other modules must use their actual identity and expose names rather than copying V2T values:

```javascript
export const V2T_METADATA = Object.freeze({
  remoteName: "v2t",
  displayName: "V2T",
  version: "0.1.0",
  apiVersion: 1,
  routePrefix: "/v2t",
  defaultExpose: "views/program/senarai-program"
});
```

`src/remote-entry.js`:

```javascript
export {};
```

Match metadata, expose keys and actual Shell imports. Metadata does not implement APIs, SSO or permissions. Do not overwrite existing scaffold files; present the specific diff and obtain permission first.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.

Generated frontend .env, .env.local and .env.example default to VUE_APP_REMOTE=off. Use off for standalone work; set on only when serving the module through Shell, then restart/rebuild. Only on enables Module Federation, remoteEntry.js publication and the Shell remote configuration. The off setting does not create a standalone preview harness or bypass backend authentication; Phase 2 still needs its identified dev-only preview setup. Vue CLI loads .env.local as an override, so keep its value consistent with the intended mode. Existing workspaces are unchanged.
