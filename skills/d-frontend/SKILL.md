---
name: d-frontend
description: Build and review one D-ReAMS Phase 2 standalone frontend submodule using general-tab-crud, @2enapps/ui, synthetic fixtures and inactive API calls, with lint and browser evidence. Use before backend integration; stop for user interface acceptance.
---

# D-ReAMS Phase 2 — one frontend prototype

Load [UI and service contracts](references/ui-contract.md) before implementing a screen. This skill is for frontend-first prototypes, not silently connecting production APIs or implementing the backend.

Write Markdown documentation in English; only prompts-ms.md uses Malay. Preserve source-defined names, code identifiers and quoted UI labels.

## Start or resume safely

Read workspace AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module, phase, selected submodule, explicit user decisions and evidence. Speak the user's language. Invocation authorizes this skill's phase work within the stated module/submodule; it does not accept results on the user's behalf, change locked files, unlock documents, execute an unidentified migration target, or deploy.

Use uppercase .docs/SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. Existing scaffold versions may be lowercase. Updated maintenance scripts resolve uppercase/lowercase filenames through the same lock-doc and lock-phase1 commands; older workspace copies need an explicitly authorized script update. Inspect real paths and document-integrity.json; do not silently rename, bypass locks or create duplicate sources of truth. If naming or an old policy conflicts with the current requested workflow, ask one precise question before dependent changes. Never edit AGENTS/manifest/scaffold files merely because a skill is installed. Never discard existing human records.

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

## Mandatory readable formatting and linting

Read [code style](references/CODE-STYLE.md). Every code change requires formatter and linter checks, reported separately. Use multiline method bodies with one statement per line, braced conditions and expanded long signatures/calls. Never compress declarations, branching and return into a one-line function. Java mapping annotations, signatures and bodies must be clearly separated. Use approved ESLint/Prettier for frontend and Java formatter/style tooling for backend. Missing tooling or failed/unrun checks block the completion claim; propose exact setup instead of skipping checks or disabling rules. Format changed authorized files only.

## Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. New scaffolds do not create per-submodule service folders. Existing workspaces are not automatically renamed.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.

## Frontend remote mode

Generated frontend .env, .env.local and .env.example default to VUE_APP_REMOTE=off. Use off for standalone work; set on only when serving the module through Shell, then restart/rebuild. Only on enables Module Federation, remoteEntry.js publication and the Shell remote configuration. The off setting does not create a standalone preview harness or bypass backend authentication; Phase 2 still needs its identified dev-only preview setup. Vue CLI loads .env.local as an override, so keep its value consistent with the intended mode. Existing workspaces are unchanged.
