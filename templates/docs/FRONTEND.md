# Frontend

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. {{module}}_fe follows local training Module Federation patterns.

Required dependency before every install/update:
`"@2enapps/ui": "git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop"`.

Use shared components/helpers/styles. New designs, raw controls, helpers and CSS require UI approval. Read `src/views/ui-element/` and `src/services/training/` as revision/reference examples; sample data and legacy controls are not approved production patterns.

Submodule layout: `src/services/{{module}}/{submodule}.service.js`, `src/views/{submodule}/{ScreenName}.vue`. The installer creates interface.vue as a temporary page scaffold per entered submodule. Once source screens are known, map each title to a named PascalCase Vue file before implementation. Extract .mjs/.js helpers to src/services/{{module}}/{submodule}/; keep the API entry flat. Root `exposes.js` is the single federation contract, matching training. Real fields/actions/endpoints require confirmed use cases. Credentials come from the host through `src/services/{{module}}/https.js`; API base URL and routing policies require review. Local settings live in `.env.local`; add other `.env.<mode>` files only with confirmed environment values.

Shell owns auth/navigation/host adapter. Match expose names, Shell remote config/env/loader/router, singleton Vue/Pinia/router/i18n/UI and CORS origin. Reference examples are not exposed automatically.

Read `CRUD-REFERENCE.md` first: use general-tab-crud/list-main.vue, `getParams`, `detailsBreadcrumbMixin`, standard validation and the response envelope preserving `data`, `list` and `total`. Match each `./views/{submodule}/interface` expose with Shell import `{{module}}/views/{submodule}/interface`.

Show standard loading/empty/success/validation/forbidden/error states. Use project upload helper, frontend/backend file validation and backend download authorization. No frontend credentials.

Frontend bucket default: `VUE_APP_BUCKET_{{env}}={{module}}` in .env, .env.local and .env.example. `UPLOAD_BUCKET_{{env}}` remains a separate unconfigured setting. Storage provisioning, access and object-prefix contracts still need verification. Environment values/ports are installer selections, not verified deployment settings. Run `npm run build`; verify `remoteEntry.js` and real Shell routes in browser.

Use source-screen names from FRONTEND.md as PascalCase Vue filenames: `src/views/{submodule}/{ScreenName}.vue`, for example Senarai Permohonan Lawatan → SenaraiPermohonanLawatan.vue. interface.vue is an initial scaffold placeholder only. Keep the flat API entry at `src/services/{module}/{submodule}.service.js`; place extracted schemas, demo/file logic and .mjs/.js helpers under `src/services/{module}/{submodule}/`, not views/{submodule}/. Update authorized imports, tests and exposes/Shell mappings together; do not change locked designs or existing workspaces silently.

After completing each authorized screen, immediately add/update its mapping in the existing exposes.js before review; do not wait for all screens. This narrow per-screen exposes.js change is part of screen implementation authorization, even when that file came from the scaffold. Preserve consumed expose keys and unrelated entries, map to the actual case-sensitive named Vue file, and report screen path + expose key + expected Shell import. Do not expose helpers/fixtures or create a second expose.js. Verify configured format/lint/build checks. Keep VUE_APP_REMOTE=off for standalone work; Shell route/menu/SSO changes remain separately authorized. Final metadata work audits the mappings already added per screen.

## Screen coverage, fixtures and shared UI details

Before implementing a selected submodule, inventory every screen in FRONTEND.md, including source IDs grouped into ranges or rows. Map each actual source screen to its own named `src/views/{submodule}/{ScreenName}.vue`, service, expose key, local route and verification status. Five source screens require five screen Vue files; one interface.vue with conditional sections does not satisfy that inventory. Tab/step hosts may compose the named screens where the source defines that flow. Do not invent extra business screens. Report unfinished screens explicitly and do not mark the submodule complete until every mapped screen is implemented and reviewed.

All synthetic business rows, dropdown fixture values, dashboard values and simulated response data for that submodule belong only in `src/services/{module}/{submodule}/hardcode-data.js`. Import them through the flat service or helpers; do not duplicate them inline in Vue files, schemas, the service, demo.mjs or module-root hardcode-data.js. Schema definitions and empty initial form state are not fixtures. Keep upstream training reference snapshots unchanged and separate from application data. Real calls remain commented in Phase 2; Phase 3 replaces fixture use without production fallback to fake success.

Render exactly one card/title for `Carian Terperinci`. Inspect ComponentCarian and the generated form's actual supported options. If the outer component owns the card/title, suppress the inner card/title through an existing supported option; do not nest two identically titled cards, invent a prop, patch the UI library or add custom CSS. Verify the rendered DOM and screenshot.

Keep the visible field label `Status`, but avoid the DOM ID `status` because the shared global `#status` rule styles an unrelated indicator. Use `status_new` for the UI control ID. Where the installed renderer derives its ID from field.name, use `status_new` as the UI schema/model key and map it explicitly to the existing approved API status key in the service. Preserve getParams and map its generated UI-key parameter rather than bypassing it. Do not rename backend/domain fields or invent a field.id override. Match labels, validation, reset and tests to the UI key; use unique namespaced suffixes for simultaneously rendered Status controls. Verify the dropdown and keyboard/accessibility behavior in the browser.
