# Frontend screen names and service helpers

Resolve screen names from the selected submodule and the source-screen mapping in FRONTEND.md before implementation. A submodule can contain several screens; do not treat its initial interface.vue scaffold as the permanent filename for all of them.

## Screen files

Use PascalCase Vue filenames derived from the actual screen title. For example, the source screen **Senarai Permohonan Lawatan** maps to:

```text
src/views/permohonan-lawatan/SenaraiPermohonanLawatan.vue
```

Document each source screen, concrete Vue path, service entry, supporting helper directory and federation expose/import mapping in FRONTEND.md. Use actual source-defined titles; do not invent additional screens or translate identifiers merely to make filenames English. Keep the same submodule directory identifier used by the accepted scope. Existing training examples keep their upstream names.

interface.vue is only an initial scaffold placeholder before source screens are known. During authorized implementation, replace it with the named screen and update imports, tests and the authorized exposes.js/Shell route mapping together. Do not leave a duplicate implementation or add an empty forwarding wrapper solely to retain the generic name. If an existing public expose key must remain compatible, map that key directly to the named file under the reviewed federation contract. Do not silently break Shell imports. Locked documents and scaffold/Shell configuration still require their existing reopening/file-specific authorization.

## Services and supporting modules

```text
src/
├── views/
│   └── permohonan-lawatan/
│       └── SenaraiPermohonanLawatan.vue
└── services/
    └── memorial/
        ├── https.js
        ├── upload.js
        ├── permohonan-lawatan.service.js
        └── permohonan-lawatan/
            ├── schemas.mjs
            ├── hardcode-data.js
            └── files.mjs
```

The flat `{submodule}.service.js` entry remains responsible for business functions, endpoint paths, payload mapping and explicitly approved fixture selection. The optional `services/{module}/{submodule}/` directory holds extracted schemas, dummy-data helpers, file-related logic and other submodule service support. Create only needed modules; do not create empty helper files. All synthetic submodule data lives only in the nested hardcode-data.js.

Keep standalone JavaScript modules (`.mjs` or `.js` helpers) out of business `views/{submodule}/`. Vue files own rendering and screen-local event wiring; extracted supporting logic belongs under services/{module}/{submodule}/. Preserve existing project extension conventions rather than converting .mjs to .js without a reason. Do not move shared ui-element reference snapshots.

Views import the flat service from `@/services/{module}/{submodule}.service` and supporting modules from `@/services/{module}/{submodule}/...`. The flat service imports transport through `./https`; nested modules use `../https` only when they actually require transport. Do not duplicate fetch/auth/URL/parsing/audit/error plumbing outside https.js. Frontend validation and fixture logic do not replace backend authorization or server validation.

## Verification

After an authorized rename/move, update every import, test, expose target and relevant navigation mapping. Check case-sensitive paths, cycles, lint/format/build and selected screen/service tests. Confirm standalone fixture behavior without real upload/API calls in Phase 2. Record exact changed paths and actual results. Updating these repository instructions does not rename or move files in an existing module workspace.

## Register each completed screen immediately

As soon as one authorized screen is implemented, add or update its mapping in the module's existing `exposes.js` before presenting it for review. Do not defer this step until every prototype/submodule is finished. The scaffold's canonical filename is `exposes.js`; do not create a second `expose.js`. If an existing project's webpack configuration uses another filename, follow that actual configuration.

This per-screen mapping update is included in the authorized screen implementation workflow. Do not request the same permission again merely because exposes.js originated in the scaffold. Other scaffold/configuration changes still need their existing authorization, and a locked document must be reopened by the user before editing.

For a new source-mapped screen, a federation entry may be:

```javascript
"./views/permohonan-lawatan/SenaraiPermohonanLawatan":
  "./src/views/permohonan-lawatan/SenaraiPermohonanLawatan.vue"
```

Its Shell import is `memorial/views/permohonan-lawatan/SenaraiPermohonanLawatan`. Use the actual module, submodule and reviewed expose key; preserve existing public keys when already consumed. Where a placeholder key remains required for compatibility, map it directly to the named file rather than introducing an empty Vue wrapper. Do not remove unrelated mappings or expose service/helpers, fixtures or training examples.

Before calling the screen complete, verify that its target file exists with exact case, its expose key is unique, imports resolve and configured format/lint/build checks pass. Report the screen path, expose key and expected Shell import together. VUE_APP_REMOTE=off remains the Phase 2 default; an expose mapping does not enable federation, connect Shell, register menus/routes or prove live SSO. After all prototypes are accepted, metadata finalization audits these already-added mappings rather than postponing their creation.

## Normal standalone serve command

Standalone development uses the normal npm run serve command with VUE_APP_REMOTE=off, VUE_APP_MODUL and VUE_APP_MODUL_PORT from the environment. vue.config.js selects src/main.js when off and src/remote-entry.js when on. main.js activates Pinia before importing @2enapps/ui, installs i18n/shared UI and mounts local hash routes from standalone-routes.js. It does not supply real identity or permit external API/upload/audit calls. When a named screen is completed, update its local route target alongside its exposes.js mapping. Do not create preview/run.cjs, override VUE_CLI_SERVICE_CONFIG_PATH or hardcode another port in a runner. Add actual locale messages required by the selected screens during implementation. Existing workspace files are not changed by this generator update.

## Screen coverage, fixtures and shared UI details

Before implementing a selected submodule, inventory every screen in FRONTEND.md, including source IDs grouped into ranges or rows. Map each actual source screen to its own named `src/views/{submodule}/{ScreenName}.vue`, service, expose key, local route and verification status. Five source screens require five screen Vue files; one interface.vue with conditional sections does not satisfy that inventory. Tab/step hosts may compose the named screens where the source defines that flow. Do not invent extra business screens. Report unfinished screens explicitly and do not mark the submodule complete until every mapped screen is implemented and reviewed.

All synthetic business rows, dropdown fixture values, dashboard values and simulated response data for that submodule belong only in `src/services/{module}/{submodule}/hardcode-data.js`. Import them through the flat service or helpers; do not duplicate them inline in Vue files, schemas, the service, demo.mjs or module-root hardcode-data.js. Schema definitions and empty initial form state are not fixtures. Keep upstream training reference snapshots unchanged and separate from application data. Real calls remain commented in Phase 2; Phase 3 replaces fixture use without production fallback to fake success.

Render exactly one card/title for `Carian Terperinci`. Inspect ComponentCarian and the generated form's actual supported options. If the outer component owns the card/title, suppress the inner card/title through an existing supported option; do not nest two identically titled cards, invent a prop, patch the UI library or add custom CSS. Verify the rendered DOM and screenshot.

Keep the visible field label `Status`, but avoid the DOM ID `status` because the shared global `#status` rule styles an unrelated indicator. Use `status_new` for the UI control ID. Where the installed renderer derives its ID from field.name, use `status_new` as the UI schema/model key and map it explicitly to the existing approved API status key in the service. Preserve getParams and map its generated UI-key parameter rather than bypassing it. Do not rename backend/domain fields or invent a field.id override. Match labels, validation, reset and tests to the UI key; use unique namespaced suffixes for simultaneously rendered Status controls. Verify the dropdown and keyboard/accessibility behavior in the browser.
