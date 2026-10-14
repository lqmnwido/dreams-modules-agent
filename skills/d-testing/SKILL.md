---
name: d-testing
description: Plan and run scoped D-ReAMS submodule tests, formatting and linting checks, record actual evidence in TESTING.md, and report defects. Use for verification of frontend prototypes or implemented backend/integration behavior, not bulk implementation or deployment.
---

# D-ReAMS — scoped testing and evidence

Read workspace AGENTS.md, module.config.json, .docs/PRD.md, SCOPE.md, task-relevant FRONTEND/BACKEND/DATABASE specifications and existing TESTING.md. Inspect actual document paths and integrity hashes; never rename protected documents, edit locks or overwrite accepted evidence. Write Markdown in English except prompts-ms.md; preserve source identifiers and user-facing labels. Speak the user's language in conversation.

## Select the test scope

Identify the current phase, one selected submodule, actual implemented commit/files, acceptance requirements and prior test evidence. If the selected submodule or target is unclear, inspect available context first, then ask one precise question before dependent execution. Do not restart completed source review or repeat answered decisions. A request to run this skill covers scoped verification and writing unlocked TESTING evidence; it does not authorize unrelated implementations, another submodule, production mutations or deployment.

Separate these modes:

- Phase 2: synthetic fixtures and standalone frontend with VUE_APP_REMOTE=off. No real Shell, SSO, business API or storage calls. An upload schema does not authorize live uploads.
- Phase 3: real API, identity, own-module PostgreSQL and authorized provider/Shell integration. Explicitly identify local/test environment, accounts, permissions and cleanup before tests that write data.
- Plan only: when implementation, tools, accounts or authorized targets are missing, prepare executable test cases and mark them Not run/Blocked. Do not fabricate success or run an unidentified backend/database to make a test possible.

Inspect actual scripts, test discovery and profiles before running commands. Database-backed @SpringBootTest/@DataJpaTest may start Flyway. Use only an identified authorized execution plan for database startup/migrations/writes; general testing permission does not grant unknown-target or production-write access. No separate schema-review form is required, and locking/execution gates still apply.

## Verify behavior and quality

Use the [testing template](references/TESTING.md) for the result structure, [code style](references/CODE-STYLE.md) for mandatory readability/format/lint and [backend test patterns](references/BACKEND-PATTERNS.md) for applicable Java tests.

1. Map actual source/use-case IDs to implemented functions, expected outcomes and test cases. Do not infer blanket CRUD from a sample.
2. Frontend: test real state/service logic as white-box checks. Use Playwright MCP visible-browser black-box checks for rendering, positive/negative/edge flows, required fields/boundaries, navigation, search/reset, pagination, loading/empty/errors, console and network failures. Missing browser/MCP access is Blocked; browser tests alone are not white-box coverage. Never claim a browser run from static code inspection.
3. Backend: use JUnit 5/Mockito unit tests, @WebMvcTest controller tests, @DataJpaTest against authorized PostgreSQL and @SpringBootTest integration where applicable. Cover roles and record ownership, field validation, missing/duplicate/conflicting records, concurrency/idempotency, paging/filter/sort/empty results, provider failures/timeouts, response/error shape, file limits, audit and SQL injection/mass assignment/IDOR. Mocks do not prove live identity/provider behavior.
4. Run configured frontend ESLint/Prettier and approved Java formatter/lint checks separately. Enforce multiline functions and readable signatures. Do not suppress failures, disable security or change accepted behavior merely to pass. Missing tooling blocks the corresponding completion claim; propose exact setup before installation.
5. Run relevant build/test/security/dependency checks supported by the actual project. Do not invent scripts, add a second build system, silently replace PostgreSQL with H2, or reformat unrelated/reference files.

Reproduce defects with expected/actual results, source IDs, severity and evidence. Fix only within current implementation authorization; otherwise report the concrete fix needed. A locked-design correction requires the user to reopen the named document. After an authorized fix, rerun the affected checks and relevant regression tests; do not loop failed commands without diagnosing the cause.

## Record and stop

Preserve masked screenshots, traces and logs in evidence/ by phase/submodule. Exclude credentials, tokens, session secrets and unrelated personal data. Record commit/build, command/profile/target, discovered/executed test counts, expected versus actual results and evidence paths. Use Pass, Fail, Blocked and Not run distinctly; record fixture/mock/real integration boundaries.

Update unlocked TESTING.md and the authorized PRD summary with actual outcomes. If TESTING.md is locked, report findings without editing and request human reopening. Report completed coverage, defects, changed files, quality-check results and remaining work. Do not mark the submodule accepted, lock documents, move to another submodule or deploy on the user's behalf. Manual/handover work can use d-manual after verified behavior exists.

For a needed locked-document revision, identify the exact file and ask the human to use `node scripts/maintenance.mjs unlock <name>` and authorize the changes. `unlock` without a name reopens all five Phase 1 designs. Do not run these commands as AI. After user acceptance, provide `lock <name>` for a single document or `lock` for the five unlocked Phase 1 designs, followed by check-docs. Use updated workspace maintenance scripts; never replace these commands with inline manifest edits.

## Screen coverage, fixtures and shared UI details

Before implementing a selected submodule, inventory every screen in FRONTEND.md, including source IDs grouped into ranges or rows. Map each actual source screen to its own named `src/views/{submodule}/{ScreenName}.vue`, service, expose key, local route and verification status. Five source screens require five screen Vue files; one interface.vue with conditional sections does not satisfy that inventory. Tab/step hosts may compose the named screens where the source defines that flow. Do not invent extra business screens. Report unfinished screens explicitly and do not mark the submodule complete until every mapped screen is implemented and reviewed.

All synthetic business rows, dropdown fixture values, dashboard values and simulated response data for that submodule belong only in `src/services/{module}/{submodule}/hardcode-data.js`. Import them through the flat service or helpers; do not duplicate them inline in Vue files, schemas, the service, demo.mjs or module-root hardcode-data.js. Schema definitions and empty initial form state are not fixtures. Keep upstream training reference snapshots unchanged and separate from application data. Real calls remain commented in Phase 2; Phase 3 replaces fixture use without production fallback to fake success.

Render exactly one card/title for `Carian Terperinci`. Inspect ComponentCarian and the generated form's actual supported options. If the outer component owns the card/title, suppress the inner card/title through an existing supported option; do not nest two identically titled cards, invent a prop, patch the UI library or add custom CSS. Verify the rendered DOM and screenshot.

Keep the visible field label `Status`, but avoid the DOM ID `status` because the shared global `#status` rule styles an unrelated indicator. Use `status_new` for the UI control ID. Where the installed renderer derives its ID from field.name, use `status_new` as the UI schema/model key and map it explicitly to the existing approved API status key in the service. Preserve getParams and map its generated UI-key parameter rather than bypassing it. Do not rename backend/domain fields or invent a field.id override. Match labels, validation, reset and tests to the UI key; use unique namespaced suffixes for simultaneously rendered Status controls. Verify the dropdown and keyboard/accessibility behavior in the browser.
