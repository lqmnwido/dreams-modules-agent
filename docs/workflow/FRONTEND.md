# FRONTEND — screens and mockup ideas template

Mockups are draft functional requirements, not final visual designs. Fill actual source screens, fields and actions. All UI uses @2enapps/ui; use general-tab-crud as the complete example.

| Submodule / screen | Fields / actions / states | Source | Exact general-tab-crud file / shared components | Planned API | Fixture scenarios / review |
| --- | --- | --- | --- | --- | --- |

See ARCHITECTURE.md for getParams/returnResponseList/detailsBreadcrumbMixin contracts. Do not build separate parameters or breadcrumb state. Actions follow domain functions; do not copy delete/bulk actions without a requirement.

Phase 2: one submodule, synthetic fixtures, commented/inactive standby API calls, standalone without Shell, ESLint/Prettier, white-box tests and Playwright MCP visible-browser checks. Stop for user review before the next submodule. If the UI lacks a component, show an empty shared card labeled exactly `[ component not available ]`; record the gap without custom components, buttons or CSS.

After all interfaces are accepted, metadata.js/remote-entry.js/exposes.js must match the actual module; existing scaffold files require specific permission before editing. Phase 3 replaces fixtures with real APIs after backend testing, without dummy fallbacks. Integrate Shell/SSO under an authorized plan. Demo privilege flags do not prove backend authorization.
