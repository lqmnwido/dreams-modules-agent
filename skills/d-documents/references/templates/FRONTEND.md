# FRONTEND — screens and mockup ideas template

Mockups are draft functional requirements, not final visual designs. Fill actual source screens, fields and actions. All UI uses @2enapps/ui; use general-tab-crud as the complete example.

| Submodule / screen (source) | Vue file / expose mapping | Service entry / helper directory | Fields / actions / states | Source | Exact general-tab-crud file / shared components | Planned API | Fixture scenarios / review |
| --- | --- | --- | --- | --- | --- | --- | --- |

See ARCHITECTURE.md for getParams/returnResponseList/detailsBreadcrumbMixin contracts. Do not build separate parameters or breadcrumb state. Actions follow domain functions; do not copy delete/bulk actions without a requirement.

Phase 2: one submodule, synthetic fixtures, commented/inactive standby API calls, standalone without Shell, ESLint/Prettier, white-box tests and Playwright MCP visible-browser checks. Stop for user review before the next submodule. If the UI lacks a component, show an empty shared card labeled exactly `[ component not available ]`; record the gap without custom components, buttons or CSS.

After all interfaces are accepted, metadata.js/remote-entry.js/exposes.js must match the actual module; per-screen exposes.js updates are part of screen authorization; other existing scaffold changes require specific permission. Phase 3 replaces fixtures with real APIs after backend testing, without dummy fallbacks. Integrate Shell/SSO under an authorized plan. Demo privilege flags do not prove backend authorization.

Use source-screen names from FRONTEND.md as PascalCase Vue filenames: `src/views/{submodule}/{ScreenName}.vue`, for example Senarai Permohonan Lawatan → SenaraiPermohonanLawatan.vue. interface.vue is an initial scaffold placeholder only. Keep the flat API entry at `src/services/{module}/{submodule}.service.js`; place extracted schemas, demo/file logic and .mjs/.js helpers under `src/services/{module}/{submodule}/`, not views/{submodule}/. Update authorized imports, tests and exposes/Shell mappings together; do not change locked designs or existing workspaces silently.

After completing each authorized screen, immediately add/update its mapping in the existing exposes.js before review; do not wait for all screens. This narrow per-screen exposes.js change is part of screen implementation authorization, even when that file came from the scaffold. Preserve consumed expose keys and unrelated entries, map to the actual case-sensitive named Vue file, and report screen path + expose key + expected Shell import. Do not expose helpers/fixtures or create a second expose.js. Verify configured format/lint/build checks. Keep VUE_APP_REMOTE=off for standalone work; Shell route/menu/SSO changes remain separately authorized. Final metadata work audits the mappings already added per screen.
