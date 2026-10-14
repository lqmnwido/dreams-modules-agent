---
name: d-frontend
description: Build and review one D-ReAMS Phase 2 standalone frontend submodule using general-tab-crud, @2enapps/ui, synthetic fixtures and inactive API calls, with lint and browser evidence. Use before backend integration; stop for user interface acceptance.
---

# D-ReAMS Phase 2 — one frontend prototype

Load [UI and service contracts](references/ui-contract.md) before implementing a screen. This skill is for frontend-first prototypes, not silently connecting production APIs or implementing the backend.

Write Markdown documentation in English; only prompts-ms.md uses Malay. Preserve source-defined names, code identifiers and quoted UI labels.

## Start or resume safely

Read workspace AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module, phase, selected submodule, explicit user decisions and evidence. Speak the user's language. Invocation authorizes this skill's phase work within the stated module/submodule; it does not accept results on the user's behalf, change locked files, unlock documents, execute an unidentified migration target, or deploy.

Use uppercase .docs/SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. Existing scaffold versions may be lowercase and lock-doc currently supports lowercase only. Inspect real paths and document-integrity.json; do not silently rename, bypass locks or create duplicate sources of truth. If naming or an old policy conflicts with the current requested workflow, ask one precise question before dependent changes. Never edit AGENTS/manifest/scaffold files merely because a skill is installed. Never discard existing human records.

Each module owns a separate PostgreSQL database; other modules access its data through APIs only. Shell owns menu/navbar/login/SSO/token refresh/route guards; @2enapps/ui from Kai supplies UI. Do not invent provider contracts, credentials, source rules or successful test results. Ask when unclear, keep stable decision IDs and explicit answers, and do not repeat answered questions or unavailable-information requests. Continue independent work; after a repeated failure diagnose before trying again.

## Entry and submodule selection

Verify all five Phase 1 designs are locked with matching current hashes before implementation. There is no separate database approval record check. Read SCOPE.md and FRONTEND.md. If the user supplies a submodule argument, verify it against the scope and work on that one only. Otherwise propose one candidate and wait for selection; do not implement all submodules.

Inspect actual reference files, @2enapps/ui exports/components and existing dev harness/lint/test scripts. Propose any missing tooling/dependency versions and ask before installing outside authorized scope. If standalone or metadata needs an existing scaffold file changed, show the exact change and ask before editing it.

## Build the selected prototype

- Use only @2enapps/ui components/helpers/styles from Kai and the exact general-tab-crud examples. Read list-main.vue, tab.vue, relevant details-one..four/list-two..five, and actual shared form/list engine code as needed. Do not substitute general-crud/training list/Shell admin screens or create new layout/button/input/custom CSS.
- A required shared component missing after inspection stays blank in an existing shared card labeled exactly `[ component not available ]`. Record the gap; do not patch node_modules, hide the gap or call the interaction complete.
- Use synthetic module-specific dummy data. Prepare planned actual API calls as commented inactive code; no real business API requests yet. Label demo outcomes and keep fixtures separate from later production paths. Do not use real private data.
- Preserve getParams pagination/filter/search behavior, returnResponseList envelope plus list/total aliases, returnResponseDetails, assignSchemaToListData and detailsBreadcrumbMixin navigation. Do not hand-build search params, drop the report envelope or add parallel details/breadcrumb state.
- Support only source-defined actions. Training delete/bulk/print/tabs do not create new business permissions. Populate demo dropdown/filter/child/dashboard scenarios consistently; do not copy irrelevant fixtures or unused training stubs/imports.
- Run standalone without Shell/backend/SSO using an agreed dev-only harness with required UI/store/i18n setup. Do not build a production Shell/login replacement.

## Quality, evidence and review

Use configured ESLint/Prettier, targeted formatting, build and white-box logic tests. Check actual script targets before fixes; no unrelated reformat or rule suppression. White-box tests exercise implemented logic/state/services; Playwright MCP visible-browser black-box tests cover positive/negative/edge flows, validation, search/reset, pagination, navigation, supported actions and console/network errors. Playwright alone is not white-box proof.

Save screenshots/traces/logs under evidence/ by phase/submodule. Update unlocked TESTING.md with prototype-only Pass/Fail/Blocked/Not run evidence. If the browser/MCP is absent, report Blocked and ask about a suitable available test tool; never fabricate a visible browser or screenshot. Test doubles do not prove actual SSO, storage or backend authorization.

Show the interface and stop for user review. Do not infer acceptance from tests or invocation. After explicit user acceptance, record it in PRD.md and propose one next submodule. Each next submodule needs selection/authorization; repeat this complete cycle until all interfaces are accepted.

Only after every interface is accepted, prepare module-specific metadata.js/defaultExpose, remote-entry.js with `export {};` and matching exposes.js. Existing scaffold files still need exact authorization before edits. Do not copy V2T identifiers into another module, connect Shell or start backend automatically. Report blockers, missing-component cards and next Phase 3 action (`d-backend`).
