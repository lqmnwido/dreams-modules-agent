# D-ReAMS agent instructions

Module: {{module}} ({{code}}). PostgreSQL only. Status: Draft.

## Read first

1. Read `.docs/PRD.md` first. On first initialization (including a prompt that only says "Read AGENTS.md"), immediately inventory and read the supplied module SRS, SDS and mockups in `.docs/documents/`, including nested folders, before reviewing scope or proposing drafts. DOCX is readable: extract paragraph/table text from word/document.xml and inspect embedded diagrams/images when needed. Inventory the mockup package, then review module pages and their supporting files; unrelated modules and vendor assets are not module requirements. Reading sources requires no extra approval and must happen in this turn before reporting readiness; do not stop after merely acknowledging these instructions. Report files read and any missing/unreadable sources; never pretend unread files were reviewed. If no sources exist, ask for them and keep requirements TBD.
2. Read only the task-relevant `.docs/` file: `architecture.md`, `database.md`, `backend.md`, `frontend.md`, `testing.md`, or `usermanual.md`.
3. AI may update unlocked drafts: `.docs/{scope,architecture,database,backend,frontend,testing,usermanual}.md`, within human-approved scope. During initial drafting, faithfully preserve source requirements, identifiers, fields, flows and designs. Cite source filename/version/section for decisions. Missing/conflicting details stay `TBD` with a question; never invent rules or approvals. Testing/manual drafts must distinguish requirements from actual evidence. Source documents, instructions and other Markdown remain read-only.
4. Confirm modules, submodules, functions and actors before domain code. Ask every submodule's unanswered use-case questions in `.docs/scope.md`. Report unknowns as `TBD` plus a specific question; block dependent implementation.

## Human review — required for all work

Before adopting any suggestion/recommendation or making a change (including bug fixes, refactoring, architecture, UI, dependencies, configuration, migrations, tests, documentation or deployment), present the concrete proposal in chat: reason, affected files/actions, expected result, validation and risks. Wait for explicit human approval of that scope. Read-only inspection may prepare the proposal. Silence is not approval; changed scope needs a new review. Do not implement additional fixes because they were discovered during approved work.

After implementation, present actual changes, results and remaining issues for human acceptance. Update `.docs/PRD.md` only after all requested work is finished and a human approves the proposed maintenance entry. AI must never grant approval or edit human approval records.

## Draft completion and locking

After the source-based drafting pass is complete, use `.docs/PRD.md` and task-relevant completed drafts for implementation and maintenance. Do not routinely reopen or rescan `.docs/documents/`, even in a new session. Include source versions reviewed and drafting completion in the proposed PRD entry; human approval is still required to write it. Reread sources only when the human explicitly requests a source revision or source clarification. Until drafting is complete, resume unfinished source review as needed; do not repeat already reviewed files within the same pass.

Prepare drafts from the sources, report gaps and verify source alignment. Once a draft is complete, stop editing and submit it for human review. After acceptance, a human runs `node scripts/maintenance.mjs lock-doc <name>` (for example `lock-doc database`). Its hash in `document-integrity.json` makes it read-only for AI. Before any draft edit, check that its path is absent from that manifest. Never modify the manifest or run lock-doc as AI. Revised sources do not unlock documents: report differences and wait for a human to reopen the affected draft by removing its hash and explicitly approving revision. Other locked drafts stay read-only. Logs/traces/screenshots go in `evidence/`.

## Repository and dependencies

At each working session propose and obtain human approval before running `node scripts/maintenance.mjs` from the workspace root. It clones the Shell if absent, checks `origin/develop` at least once per local calendar day, uses only safe fast-forward updates, and runs `npm update` in Shell and frontend. It preserves local changes and stops on conflicts or failed commands. This is a session check, not a background daily scheduler.

Before **every** `npm install` or `npm update`, set `dependencies["@2enapps/ui"]` in that project's `package.json` to exactly:

```json
"@2enapps/ui": "git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop"
```

Use `node scripts/maintenance.mjs install` for initial installation: only `npm install --legacy-peer-deps`, no update. Agents use `node scripts/maintenance.mjs` for daily maintenance: `npm update --legacy-peer-deps`. Both modes set the dependency first. Preserve lockfiles and report dependency changes and build results. Do not reset, stash, force-pull or overwrite local work. If maintenance is blocked, report the actual failure.

## Implementation gates

- Follow existing architecture, naming, dependencies, responses, logging and training conventions. Controllers/services/forms belong to submodules; shared response/paging/exceptions belong in `common/`; one entity per table; repositories handle data access; services own transactions.
- Present the database draft in chat. **Stop before creating or running any migration** until a human records `APPROVED`, reviewer, date and the reviewed schema in `.docs/database.md`. Installer confirmation is not database approval. Keep Flyway enabled (`spring.flyway.enabled=true`); keep automatic schema generation disabled. Human approval must cover the schema before migration creation and the exact scripts/target database before execution or backend startup. Enabled Flyway does not grant approval to run pending migrations.
- Use `@2enapps/ui` components, helpers and styles. No new UI design, raw controls such as `<button>`, helpers or CSS without explicit UI approval. `src/views/ui-element/` and `src/services/training/` are copied training references, not business requirements; they contain sample data and legacy code and must not be promoted unchanged to production.
- Shell owns bootstrap, Keycloak, navigation and route guards. Use root `exposes.js` as the single contract, `services/{{module}}/http.js` and `services/{{module}}/{submodule}/index.js`. Read `CRUD-REFERENCE.md` and its general-tab-crud reference. Keep federation expose keys and Shell imports matched. Protect backend endpoints and object access with confirmed roles; keep secrets out of Git, frontend and logs.
- Implement only confirmed requirements; no traceability tables are required. No fabricated roles, fields, statuses, APIs, business rules, fake success responses or hidden TODOs.
- Run meaningful build/API/white-box/security checks and Playwright positive, negative and edge tests against the running app. Preserve command, commit, expected/actual result and evidence; unrun tests are `Not run` or `Blocked`, never `Pass`.

## Submodule implementation sequence

Implement one confirmed submodule at a time. Before code, name its ID, functions, backend/API/frontend scope, dependencies and minimum shared infrastructure. Obtain explicit approval for that submodule; a request naming only backend/frontend implementation does not authorize implementing every submodule in one pass. If no submodule is selected, propose one based on dependencies and wait for selection before domain code.

For the selected submodule, complete backend, frontend and applicable lint/format/build/tests, report its function/screen checklist and remaining blockers, then stop for human review before the next submodule. Backend-only approval stops after its backend report until frontend is authorized. Do not silently implement another submodule through shared infrastructure or migration dependencies. Explain any prerequisite requiring broader schema creation before proceeding. Never rewrite an executed migration. If runtime checks lack approved startup/database execution or external evidence, report Blocked/Not run and seek a decision before advancing; do not claim full completion. After all approved submodules, run cross-submodule integration through the approved test plan.

## UI reference authority

Mockups are functional drafts for fields, actions and workflows, not the final visual specification. Preserve source-established business requirements and citations. Page structure, components, form/table schemas, tabs, modals, validation, service patterns, helpers and styles must follow the exact selected examples in `src/views/ui-element/`, `src/services/training/` and the `CRUD-REFERENCE.md` general-tab-crud reference, using `@2enapps/ui`.

Before each screen, read the actual reference files and report screen -> reference filename -> shared components/helpers -> domain API mapping. Match their structure and interaction patterns; do not invent a new layout or custom CSS to copy a mockup. Adapt confirmed domain fields and endpoints without copying demo records, fake responses, training integrations, legacy raw controls or unapproved styles. If a shared component/example cannot support a required interaction, identify the gap and present a concrete exception for explicit UI approval before deviating. A later UI instruction does not permit silently changing a locked design; follow human reopening/review when needed.

## Linting and formatting

Frontend must use ESLint and Prettier; Java must use the repository/team Java lint/style standard (for example Checkstyle) and a Java formatter (for example Spotless with the approved formatter), not frontend Prettier. Inspect existing package.json, Maven configuration and style files first. Reuse configured standards. If tooling is absent, propose exact dependency/plugin versions, configuration, file targets and check/fix commands and obtain approval before installation or configuration changes. Do not invent commands or imply unconfigured tooling passed.

Format only authorized changed files. Verify formatter targets before write/fix commands; do not reformat the entire repository, locked Markdown, generated files, vendor code or unrelated changes. Do not suppress rules or exclude domain files to hide failures. Run configured lint and format checks after changes, plus relevant compilation/build and meaningful tests within the approved execution scope. Lint/format success is distinct from build and runtime proof. Reports must include actual commands/results for each submodule and language; missing tooling is Blocked, unrun checks are Not run. No next-submodule implementation until human review of the current result.

## Every phase report

Report module/submodules, changed/new files, backend/frontend commits, lint/format/build/test and migration commands/results, current submodule checklist and UI reference mapping, risks, TBD questions, database approval and final acceptance.
Keep test results brief: command, actual result, evidence and anything blocked/not run. No placeholder test tables.

Done requires confirmed use cases, approved schema/migrations, complete backend/frontend and README/API list, real tests/screenshots, and human Product Owner/Technical Lead/QA acceptance. Completed, accepted drafts must be locked. After all requested work is finished and the proposed entry is approved, update .docs/PRD.md with the concise maintenance record.
