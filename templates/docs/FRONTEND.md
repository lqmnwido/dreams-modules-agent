# Frontend

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. {{module}}_fe follows local training Module Federation patterns.

Required dependency before every install/update:
`"@2enapps/ui": "git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop"`.

Use shared components/helpers/styles. New designs, raw controls, helpers and CSS require UI approval. Read `src/views/ui-element/` and `src/services/training/` as revision/reference examples; sample data and legacy controls are not approved production patterns.

Submodule layout: `src/services/{{module}}/{submodule}.service.js`, `src/views/{submodule}/interface.vue`. Installer creates page/service scaffolds per entered submodule. Root `exposes.js` is the single federation contract, matching training. Real fields/actions/endpoints require confirmed use cases. Credentials come from the host through `src/services/{{module}}/https.js`; API base URL and routing policies require review. Local settings live in `.env.local`; add other `.env.<mode>` files only with confirmed environment values.

Shell owns auth/navigation/host adapter. Match expose names, Shell remote config/env/loader/router, singleton Vue/Pinia/router/i18n/UI and CORS origin. Reference examples are not exposed automatically.

Read `CRUD-REFERENCE.md` first: use general-tab-crud/list-main.vue, `getParams`, `detailsBreadcrumbMixin`, standard validation and the response envelope preserving `data`, `list` and `total`. Match each `./views/{submodule}/interface` expose with Shell import `{{module}}/views/{submodule}/interface`.

Show standard loading/empty/success/validation/forbidden/error states. Use project upload helper, frontend/backend file validation and backend download authorization. No frontend credentials.

Frontend bucket default: `VUE_APP_BUCKET_{{env}}={{module}}` in .env, .env.local and .env.example. `UPLOAD_BUCKET_{{env}}` remains a separate unconfigured setting. Storage provisioning, access and object-prefix contracts still need verification. Environment values/ports are installer selections, not verified deployment settings. Run `npm run build`; verify `remoteEntry.js` and real Shell routes in browser.
