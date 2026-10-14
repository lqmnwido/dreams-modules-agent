# D-ReAMS — three-phase Agile prompts

Write Markdown documentation in English. Only `prompts-ms.md` uses Malay; retain source-defined names, code identifiers and quoted UI labels.

Use one prompt at a time. Read and approve the actual proposal before sending an approval prompt. No placeholders are business answers. Phase 1 ends with user locking; Phase 2 is frontend-first, standalone and synthetic; Phase 3 is backend plus real integration. No separate database human-review record. Never modify scaffold files without exact authorization. See guide.md and ARCHITECTURE.md.

## Short phase commands

Install with `node skills.js --codex`, `--claude`, `--opencode`, `--cursor`, `--gemini`, `--copilot`, `--windsurf` or another `--harness NAME` from the installer checkout. Use `--list-harnesses` for the complete path/source inventory. Codex uses `$d-documents`, `$d-frontend <submodule>`, `$d-backend <submodule>`; Claude Code/OpenCode/Cursor/Cline use `/d-documents`, `/d-frontend <submodule>`, `/d-backend <submodule>`. See `docs/SKILLS.md` and `docs/HARNESS-SUPPORT.md` in that repository; other tools may use skill selection rather than slash commands. The numbered prompts below remain the manual alternative; skills do not bypass phase locks, user acceptance or an identified database execution plan.

## 1. Confirm module, sources and document paths

**Prompt:**

```text
Read AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module and sources under .docs/documents/. Do not assume an SRS exists or reuse another module's business rules.

Use the three-phase workflow: documents and user locking; standalone frontend prototypes for every submodule; backend and real integration. Database has no separate human schema-review/APPROVED record requirement.

Canonical design filenames are uppercase SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. Inspect existing lowercase files, locks and instructions first. If naming or an old locked policy conflicts, ask one specific question and identify affected paths; do not silently rename, bypass locks or edit scaffold code.

Summarize source availability and any real ambiguity. Read-only inspection may continue. Do not begin implementation.
```

## 2. Phase 1: read sources and write focused documents

**Prompt:**

```text
I authorize Phase 1 documentation for the confirmed module and source set. Read relevant documents, including DOCX tables/diagrams and mockup support files.

Write the unlocked .docs/ documents:
- SCOPE.md: complete source-derived requirement map, submodules, actors, workflows, decisions, citations and links wiring the specialized documents together.
- DATABASE.md: actual own-module PostgreSQL tables, fields/types/null/defaults, keys, relationships, constraints, indexes, audit/removal and query/transaction invariants.
- BACKEND.md: per-submodule controllers/services/repositories/entities/forms, function logic, API payloads, permissions, errors and source IDs.
- FRONTEND.md: mockup ideas, actual screens/fields/actions, exact general-tab-crud/shared UI references, dummy prototype scenarios and planned APIs.
- ARCHITECTURE.md: concise common ownership, MFE/Shell/UI boundaries and folder structures. Every module owns a separate database; other modules use its API only.

Keep wording simple and direct; do not duplicate all details in SCOPE.md or every file. PRD.md is general system/phase information. Keep citations; distinguish source facts from proposals. No source-defined facts left TBD. Ask for genuinely missing/conflicting rules before dependent design.

No code, migrations, scaffold changes or locks.
```

## 3. Resolve one decision group

**Prompt:**

```text
Present at most five genuinely unresolved decisions with stable IDs, one complete recommended answer, user effect, missing value/evidence and blocked work. Do not repeat source-defined or explicitly answered questions.

Keep unavailable provider evidence separate. Do not repeatedly ask for information I already said I do not have; continue independent decisions. If unclear, ask before dependent work, not after inventing a rule. Wait for my answers.
```

## 4. Apply the answered group

**Prompt:**

```text
I approve the concrete recommendations in your immediately preceding group exactly as written. List the covered IDs and apply only fully resolved decisions consistently to unlocked documents.

Do not infer missing values, provider contracts or acceptance from approval. Ask about remaining user choices and record unavailable external evidence. Present the next independent group or report decisions complete. No code or locks.
```

## 5. Phase 1: PRD summary and source confirmation reread

**Prompt:**

```text
Finish the Phase 1 documents and write a concise general phase/source/decision summary to PRD.md within this authorization.

Then reread the relevant source documents once for confirmation as explicitly requested. Check every source function, field, workflow and permission is represented and linked to storage/API/screen definitions. Correct omissions in unlocked drafts; record actual files/sections rechecked and update PRD.md to the real outcome.

Do not loop the source review or leave stale contradictory alternatives. If incomplete, ask only the exact remaining question and stop dependent work. Do not invent missing external contracts.

If complete, stop and ask me to lock the five Phase 1 design files. Do not start Phase 2 or create a database human-review table. No code or migrations.
```

## 6. Verify the user locks and select one frontend submodule

**Prompt:**

```text
I have locked the Phase 1 documents. Verify actual paths and hashes; do not rely on this statement alone. No separate database approval record is required.

Read SCOPE.md and FRONTEND.md. Propose one frontend submodule, its screens, exact reference files, dummy scenarios and standalone test approach without Shell/backend. Inspect available @2enapps/ui components and existing tooling/harness before proposing changes.

Identify any scaffold file change needed and ask before editing it. Propose missing lint/test tooling with exact versions/commands, not invented commands. Wait for submodule selection; do not implement all submodules.
```

## 7. Phase 2: implement the selected standalone prototype

**Prompt:**

```text
I approve the single frontend submodule and bounded non-scaffold plan just proposed. Name its ID and implement only it.

Read SCOPE.md/FRONTEND.md and general-tab-crud/list-main.vue, tab.vue and relevant details/list children. Do not substitute general-crud, training/crud/list or Shell admin screens. Use @2enapps/ui only; inspect installed shared code. If a required component is absent, leave an existing shared card blank with exact label [ component not available ]. Record the gap; do not create a button/input/custom component or patch UI library code.

Use synthetic dummy data for this prototype. Prepare the planned real API call as commented inactive code; do not send business API requests yet. Keep dummy mode visibly distinguishable, not a claimed backend success. Preserve getParams, returnResponseList envelope/list/total, returnResponseDetails and detailsBreadcrumbMixin; do not hand-build params or duplicate navigation state. Only implement domain-supported actions.

Use ESLint and Prettier, remove unused training imports/stubs and format changed files only. Run standalone without Shell, using the agreed harness. Do not alter scaffold files without separate file-specific authorization.

Report screens, reference/component/API mappings, missing-component cards, changes and actual lint/format/build results. Stop at this submodule.
```

## 8. Phase 2: test and show the interface

**Prompt:**

```text
For the current prototype, run white-box tests of implemented logic and black-box tests through Playwright MCP in a visible browser. Cover happy/negative/edge cases, validation/boundaries, search/reset, paging, tabs/breadcrumbs, supported actions and console/network errors. Verify no Shell/business API dependency and missing-component cards are explicit.

Use synthetic fixture scenarios; do not claim real API, SSO or authorization proof. Save screenshots/traces/results to evidence/ and update unlocked TESTING.md with prototype-only evidence. If a tool/browser is unavailable, mark Blocked, not Pass.

Fix defects within this submodule's authorized scope, rerun affected checks and show the interface for my review. Ask if uncertain; do not repeat failed attempts without a new diagnosis. Stop before the next submodule.
```

## 9. Accept the interface and propose the next prototype

**Prompt:**

```text
I accept the current submodule interface as shown, with its explicitly listed prototype limitations. Record this exact acceptance and evidence reference in PRD.md; do not claim production completion.

Propose one next frontend submodule and wait for authorization. Repeat the Phase 2 build/test/user-review cycle. If all interfaces are accepted, report that and prepare the metadata plan only; do not start backend or Shell integration automatically.
```

## 10. Finalize MFE metadata after all interfaces are accepted

**Prompt:**

```text
Verify every Phase 2 submodule has user acceptance or an explicit unresolved status. Use actual module identity/default screen to prepare metadata.js, remote-entry.js containing export {}; and matching exposes.js keys. Follow the metadata example in ARCHITECTURE.md; do not copy V2T identity into another module.

If these files already exist as scaffold, show exact diffs and ask permission before modifying them. This prompt does not authorize scaffold edits. Do not add Shell routes/menus or connect SSO yet. Check federation names/imports statically, update PRD.md with actual Phase 2 status and stop for Phase 3 authorization.
```

## 11. Phase 3: select one backend submodule

**Prompt:**

```text
Read SCOPE.md, BACKEND.md, DATABASE.md and the accepted frontend contract. Verify Phase 1 design locks; database does not require a separate reviewer/APPROVED record.

Follow existing project/module patterns before framework conventions; never install restructuring scaffold tools without approval. Use PostgreSQL + Spring Data JPA and JUnit 5 + Mockito + Spring Boot Test. Plan @WebMvcTest, @DataJpaTest and @SpringBootTest with actual Maven/Gradle commands and an isolated test database. Read docs/BACKEND-PATTERNS.md and docs/DATABASE-PATTERNS.md in the installed/reference materials as applicable.

Propose one backend submodule with actual functions, classes, endpoints/forms, owned tables/indexes, migration dependencies, roles and tests. Use Java 25, Spring Boot and PostgreSQL. No cross-module database access; dependencies use APIs.

Inspect Java formatter/lint settings and propose missing tools/versions (for example team-approved Checkstyle and Spotless). Do not claim a universal Spring Boot formatter or lower Java target. Identify external contracts still missing and ask before dependent implementation. Do not touch scaffold files. Wait for selection.
```

## 12. Phase 3: implement one backend and create its migrations

**Prompt:**

```text
I authorize the single backend submodule and bounded plan just proposed. Name its ID. Implement actual controllers/services/forms/entities/repositories, validation, role/object access, transactions, paging/filter/sort, errors, concurrency and audit against BACKEND.md/DATABASE.md.

Apply the database standards: snake_case/unquoted identifiers; id BIGINT GENERATED ALWAYS AS IDENTITY or permitted SERIAL pattern; NUMERIC/TIMESTAMPTZ; CREATE TYPE enums; idx_/uniq_/fk_ names and explicit FK actions. Ask before changing conflicting locked UUID/catalog/API/locking definitions.

Reuse existing queries/indexes and check relationships/batching/page-size/timeouts. Prevent N+1; targeted eager/join/batch loading, partial/expression indexes and scoped caching only where appropriate. Use keyset/cursor for large results only with a compatible agreed API/UI contract. Keep transactions short; prefer advisory coordination where safe, retain necessary row locks. Use authorized EXPLAIN (ANALYZE, BUFFERS), acknowledging it executes queries.

Every migration needs representative-data forward and tested rollback/recovery evidence. Verify Flyway undo support or test a compensating/restore procedure; no fabricated automatic rollback. Production is read-only unless explicitly authorized; no destructive/DROP operation without approval and confirmed backup, and no silent data modification/deletion.

Create Flyway migrations for the module's own database from the locked design. No separate schema human review is required. Do not invent missing columns/rules or create another module's tables. Explain prerequisite tables; ask if implementation scope must expand. Do not rewrite executed migrations.

Keep Flyway enabled, Hibernate generation none, SQL initialization never and bearer authentication enabled by default. Preserve the local-only testing bypass without calling bypass tests real security evidence.

Use Java 25, approved Java lint/style and Java formatting, targeted changed files only. Run non-database checks/build/tests. No placeholders, dummy production responses, hidden TODOs, unused code, swallowed exceptions or mixed-submodule giant services. Never invent a provider contract.

Do not execute migrations or startup against a database until the target/execution plan is authorized. Do not change scaffold or locked files. Report actual functions/files/results and stop before another submodule.
```

## 13. Prepare exact database execution and API test plan

**Prompt:**

```text
Prepare the current submodule's execution plan in unlocked TESTING.md: migration filenames/checksums, target environment/host/port/database/schema/roles, commands, startup, accounts/services, recovery and expected evidence. Target only this module's database. Do not expose secrets.

Include the actual JUnit 5/Mockito unit, @WebMvcTest controller, @DataJpaTest PostgreSQL repository and @SpringBootTest integration test commands (mvn test or the existing Maven/Gradle wrapper, plus configured integration profiles). Include representative-data migration/rollback tests and bounded performance/locking checks; do not assume H2 or production test targets.

Include endpoint happy paths, every field/boundary, role/object scope, missing/conflicting/duplicate/concurrent records, pagination/sort/filter/empty, integration failure/timeouts, response/error contracts, SQL injection, mass assignment, IDOR, uploads and audit. Include build/lint/format/dependency/security-scan commands supported by the project.

A separate human schema-review table is not required; execution still needs an identified target. Do not execute this plan or claim unrun checks passed.
```

## 14. Execute the identified plan and test the backend

**Prompt:**

```text
I authorize the exact migration files/checksums, target database, startup and test commands in your immediately preceding complete plan. If any target or prerequisite is unknown or files changed, ask before execution.

Execute only that plan. Test real APIs and security with appropriate actual test identities; no dummy production responses. Keep failures and provider unavailability honest; no success fallback. Save real evidence and report Pass/Fail/Blocked/Not run, scan findings and critical warnings. Fix only within authorized scope; ask if design/scaffold changes are required. Stop at the selected submodule.
```

## 15. Replace prototype data and integrate the selected frontend

**Prompt:**

```text
I authorize connecting the current frontend submodule to its tested actual API. Activate its prepared API calls and remove/disable synthetic fixtures in production paths. Preserve getParams, returnResponseList/Details and breadcrumb contracts. The backend owns pagination/filtering; do not leave demo parseQuery/applyFilters as production logic.

Run ESLint/Prettier/build and real frontend/API Playwright checks for this submodule. No fixture fallback on HTTP errors. Show accurate loading, empty, validation, forbidden, conflict and integration errors. Missing shared components remain explicitly labeled, not silently invented or counted complete.

Do not connect Shell or edit scaffold unless separately authorized. Report evidence and stop for submodule acceptance before the next backend cycle.
```

## 16. Accept one integrated submodule and propose the next

**Prompt:**

```text
I accept the integrated submodule just demonstrated with the explicitly listed test status and limitations. Update PRD.md with actual implementation/evidence and propose one next backend submodule. Wait for authorization; repeat Phase 3 per submodule.

After all submodules, prepare a separate Shell MFE/SSO/menu/routes and cross-submodule test plan. Show exact files; ask permission before touching existing scaffold/Shell configuration. Do not deploy automatically.
```

## 17. Generate the backend README and final user documentation

**Prompt:**

```text
Update the authorized backend README to match real implementation: module purpose/scope, submodules, architecture/packages, prerequisites/setup/run, safe env variable names, own-database/Flyway instructions, Keycloak role/access matrix and complete implemented API list (submodule, method, path, function, request/response form, role, real source ID). Do not invent SRS IDs or list unimplemented endpoints as available. If README is locked, request reopening first.

Finish TESTING.md with real white-box/API/browser/security/dependency/lint/format/build results. Write USERMANUAL.md from actual behavior/screenshots by role/submodule. Distinguish prototype screenshots from live results and list missing-component limitations.

Update PRD.md with concise final system/phase summary and evidence links. Submit for user acceptance; ask the user to lock completed TESTING.md and USERMANUAL.md. Do not lock files yourself or deploy.
```

## 18. Prepare deployment separately

**Prompt:**

```text
Prepare, do not execute, a deployment plan with exact artifact/commit, environment/server, own-module database, migrations/checksums, env/secret references, Shell/remote/API configuration, commands, backups/recovery and health/security checks. Identify missing information once and ask before dependent work.

Do not deploy or execute production changes until the complete identified plan is explicitly authorized. Keep prototype fixtures disabled and unresolved components documented.
```

Read Module Code from module.config.json field code and resolve the actual matching .docs/documents/mockup/{module code}/ folder before reading mockups. Do not substitute the module name or another module folder; ask if missing or ambiguous.
