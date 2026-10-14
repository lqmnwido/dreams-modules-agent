# D-ReAMS — Agile guide in three phases

Write Markdown documentation in English. Only `prompts-ms.md` uses Malay; retain source-defined names, code identifiers and quoted UI labels.

Workflow: **Phase 1 documents → user locking → Phase 2 all frontend prototypes, one submodule at a time → Phase 3 backend and integration, one submodule at a time.**

Use [prompts.md](prompts.md) or the Malay alternative [prompts-ms.md](prompts-ms.md). Prompt numbers match across both languages. Shared architecture is in [ARCHITECTURE.md](ARCHITECTURE.md). The installer repository’s `docs/workflow/` contains concise document templates, not reviewed module specifications.

## Install skills instead of pasting phase prompts

From the installer checkout, select your harness:

```bash
cd /home/lqmnwido/Projects/dreams/dreams-modules-agent
node skills.js --codex
# Other options (do not run all of them):
# node skills.js --claude
# node skills.js --opencode
# node skills.js --cursor
# node skills.js --gemini
# node skills.js --copilot
# node skills.js --windsurf
```

Then open an agent session in the module workspace:

| Phase | Codex | Claude Code / OpenCode / Cursor / Cline |
| --- | --- | --- |
| Documentation and request user locking | `$d-documents` | `/d-documents` |
| One frontend prototype | `$d-frontend submodule-name` | `/d-frontend submodule-name` |
| One backend and integration | `$d-backend submodule-name` | `/d-backend submodule-name` |
| Scoped tests and TESTING evidence | `$d-testing submodule-name` | `/d-testing submodule-name` |
| Verified USERMANUAL and handover | `$d-manual submodule-name` | `/d-manual submodule-name` |

Default installation includes all five skills. Skills load their own phase instructions and references. The numbered prompts remain a manual alternative. Users still answer unresolved questions, lock documents, accept interfaces and authorize identified database execution. Skills do not install Playwright MCP/JDK or automatically make browser tools available.

`--dry-run` previews destinations without writes; `--project /path/workspace` installs project-local skills; `--list-harnesses` lists 79 named harnesses and a portable target; `--harness name` selects an adapter; `--all --dry-run` previews the dated registry before installation; `--dest /path/skills` supports another Agent Skills directory. See `docs/SKILLS.md` for paths, managed `--force` updates and compatibility limits. Restart the session if skills have not appeared. Installation does not change scaffolds, project AGENTS files or locks.

The complete list in `docs/HARNESS-SUPPORT.md` includes Cursor, Gemini, Copilot, Windsurf, Cline, Roo, Kilo, Continue, Augment, Amp, Goose, Kiro, Qwen, OpenHands and Zed. Vendor-documentation evidence differs from registry-only evidence; copying files does not prove every harness runs. Windsurf uses @skill; other tools may use skill selection or natural-language requests instead of /commands. Global `--all` reports skipped project-only targets; use `--project` for those targets. Feature/trust/cloud-worker configuration is not changed automatically.

## Working rules

- Each module owns a separate PostgreSQL database. Other modules use the owner’s API only. MFE frontend remotes and business APIs are separate mechanisms.
- Shell owns menus, navbar, layout, login, SSO and token refresh. UI comes from the Kai `@2enapps/ui` dependency; modules do not create a second Shell.
- **No separate database human-review form or APPROVED table is required.** Schema completeness remains mandatory; Phase 1 locking establishes the design baseline. Database execution needs an identified target, exact commands and execution authorization.
- Users lock documents. Agents do not change the manifest or lock/unlock documents themselves.
- Do not change installer/scaffolder code or existing scaffold files. If standalone development, metadata or tooling requires such changes, show the exact files/diff and ask first.
- If unsure, ask a specific question before dependent work. Preserve decision IDs and answers; do not repeat answered questions, invent rules or retry the same failure without new evidence.
- Fixtures are permitted **only for Phase 2 prototypes**. Backend/production code must not return dummy success or fall back to fixtures after API failures.

## 0. Create the workspace once

Check prerequisites:

```bash
node --version
npm --version
git --version
java --version
mvn --version
```

Node must be at least 22.12. The backend uses Java 25 and Spring Boot. Check the actual project’s Boot version and supporting JDK; do not silently change its target.

If the installer is not available:

```bash
mkdir -p /home/lqmnwido/Projects/dreams
cd /home/lqmnwido/Projects/dreams
git clone https://github.com/lqmnwido/dreams-modules-agent.git
cd dreams-modules-agent
node bin/install.mjs
```

For an existing checkout, inspect changes, branch and remote first:

```bash
cd /home/lqmnwido/Projects/dreams/dreams-modules-agent
git status --short
git branch --show-current
git remote -v
```

Only with a clean working tree, the main branch and the correct remote:

```bash
git fetch origin
git pull --ff-only origin main
node bin/install.mjs
```

Hosted alternative: the repository lists https://dreams-agents.kohich.site/. Download and inspect scripts before execution; this guide does not prove website availability.

```bash
curl -fL 'https://dreams-agents.kohich.site/install.sh' -o dreams-agent-install.sh
cat dreams-agent-install.sh
```

After review, run `bash dreams-agent-install.sh`. For PowerShell, download `install.ps1` from the same site using Invoke-WebRequest, inspect it with Get-Content and follow organizational execution policy; do not bypass it.

Enter the actual module identity, package, path, Java 25 and approved Boot version. Choose a permanent workspace location. The installer itself does not need npm install; do not rerun it to overwrite an existing workspace.

If workspace dependencies are not installed:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace
node scripts/maintenance.mjs install
node scripts/maintenance.mjs check-docs
```

Replace the example with the actual workspace path. `install` performs initial npm installation; `node scripts/maintenance.mjs` performs later Shell/npm-update maintenance. It is not another mandatory initial step. Do not update dependencies outside authorized scope.

## Uppercase compatibility without scaffold changes

Target documents are `.docs/SCOPE.md`, `ARCHITECTURE.md`, `DATABASE.md`, `BACKEND.md`, `FRONTEND.md`, `TESTING.md` and `USERMANUAL.md`, with `.docs/PRD.md` as the general record.

**The existing installer/maintenance implementation is unchanged:** it generates lowercase drafts and `lock-doc` accepts lowercase names only. Linux treats these as different files. Do not run `lock-doc scope` and claim it locks `SCOPE.md`.

Use Prompt 1 to inspect actual paths. For a new workspace, the user must confirm canonical uppercase names and authorize creation/renaming before Phase 1. For an existing workspace with locked hashes/designs, do not automatically rename files, discard records or keep competing sources of truth. Ask for a specific migration decision. This guide does not change existing workspaces or previous approvals.

## Phase 1 — read sources, prepare documents, confirm and lock

Place actual sources under `.docs/documents/`; do not assume an SRS exists. Read Module Code from `module.config.json` field `code`, then select the actual matching `.docs/documents/mockup/{module code}/` folder. For example, code M12 may match an existing m12 directory. Ask if the code/folder is missing or ambiguous; never use another module’s mockups. Use dated ZIP/mockup copies only when the user selects them as sources.

| Document | Content |
| --- | --- |
| PRD.md | General system information, phase/submodule status, key decisions, versions and evidence links |
| SCOPE.md | Relevant source requirements: submodules, functions, actors, workflows, rules, decisions and citations; routing to specialized specifications |
| ARCHITECTURE.md | Shared structure and database/API/MFE/Shell/UI ownership boundaries |
| DATABASE.md | Actual module tables, columns, types, nullability, defaults, keys, constraints, indexes, audit and deletion |
| BACKEND.md | Controllers, services, entities, repositories, forms, logic, requests/responses, permissions, errors and transactions |
| FRONTEND.md | Mockup ideas, screens, fields/actions, exact UI references, fixture scenarios and planned APIs |
| TESTING.md | Later test plans and actual evidence by phase/submodule |
| USERMANUAL.md | Instructions for verified functions; completed later |

Do not copy sources verbatim or duplicate every detail across files. Keep prose concise while making required payloads, storage and permissions concrete. Link SCOPE.md to specialized sections instead of duplicating DATABASE/BACKEND/FRONTEND.

**Prompts 1–4:** identify the module, paths and sources; read sources; prepare documents; resolve genuinely unanswered questions in groups of at most five.

**Prompt 5:** complete the PRD summary, then reread relevant sources once for confirmation. Record inspected files/sections, correct omissions and summarize actual findings. Stop and ask the user to lock the five design documents. Do not start frontend implementation yet.

### Uppercase locking script — user only

Use only after Phase 1 is confirmed complete, canonical uppercase paths are agreed, competing documents are absent and the user accepts the documents. The script records hashes only; it does not change content, create migrations or authorize database execution. It does not modify the scaffold script.

Check first:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace
node scripts/maintenance.mjs check-docs
```

If successful, the user runs:

```bash
node --input-type=module <<'NODE'
import { readFile, writeFile, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { checkDocuments } from './scripts/maintenance.mjs';

await checkDocuments(process.cwd());
const manifestPath = 'document-integrity.json';
if ((await lstat(manifestPath)).isSymbolicLink() || (await lstat('.docs')).isSymbolicLink()) {
  throw new Error('Manifest/.docs symlink: stop for review.');
}
const hashes = JSON.parse(await readFile(manifestPath, 'utf8'));
const documents = [
  '.docs/SCOPE.md', '.docs/ARCHITECTURE.md', '.docs/DATABASE.md',
  '.docs/BACKEND.md', '.docs/FRONTEND.md'
];
const additions = {};
for (const path of documents) {
  const legacy = path.replace(/([^/]+)\.md$/, name => name.toLowerCase());
  try {
    await lstat(legacy);
    throw new Error(`Lowercase file ${legacy} still exists; resolve the migration first.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (Object.hasOwn(hashes, path) || Object.hasOwn(hashes, legacy)) {
    throw new Error(`${path} or its legacy path is still locked; do not overwrite the baseline.`);
  }
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error(`${path}: not a regular file.`);
  additions[path] = createHash('sha256').update(await readFile(path)).digest('hex');
}
await writeFile(manifestPath, JSON.stringify({ ...hashes, ...additions }, null, 2) + '\n');
for (const path of documents) console.log(`${path}: locked`);
NODE

node scripts/maintenance.mjs check-docs
```

This guide does not automate unlocking. Changes after locking require the user to reopen only the affected documents and explicitly authorize revision. Agents must not change the manifest.

## Phase 2 — frontend first, one submodule at a time

After user locking and authorization, use **Prompt 6** to verify hashes, read SCOPE/FRONTEND and select one submodule. **Prompt 7** builds its prototype; **Prompt 8** tests and shows it; **Prompt 9** records interface acceptance and proposes the next submodule. Repeat 6–9 until all interfaces are accepted. Do not start the backend during this cycle.

### Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. New scaffolds do not create per-submodule service folders. Existing workspaces are not automatically renamed.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.

### Frontend environment and remote mode

Generated frontend .env, .env.local and .env.example default to VUE_APP_REMOTE=off. Use off for standalone work; set on only when serving the module through Shell, then restart/rebuild. Only on enables Module Federation, remoteEntry.js publication and the Shell remote configuration. The off setting does not create a standalone preview harness or bypass backend authentication; Phase 2 still needs its identified dev-only preview setup. Vue CLI loads .env.local as an override, so keep its value consistent with the intended mode. Existing workspaces are unchanged.


Generated frontend environment files also set the module bucket name:

```dotenv
VUE_APP_REMOTE=off
VUE_APP_BUCKET_MEMORIAL=memorial
```

Use `VUE_APP_BUCKET_{MODULE}={module}` for the actual module. The default appears in .env, .env.local and .env.example; it does not provision storage or verify permissions. UPLOAD_BUCKET_{MODULE} remains a separate unconfigured setting. Real uploads need an identified authorized integration, not Phase 2 fixtures.

```text
src/services/{module}/
├── https.js
├── hardcode-data.js
├── upload.js
└── {submodule}.service.js
```

The fixture helper returns independent synthetic document rows. The upload example follows the shared GeneratedFormData schema with type file, example size 5 MiB, center alignment and the module bucket variable. Adapt limits/required/type rules to accepted requirements; Tus remains commented out. Do not upload twice through both the shared form and service helper. Existing workspaces are not automatically migrated.

### Follow the exact UI and service references

Use `general-tab-crud/list-main.vue` as the main reference. Read `tab.vue`, `details-one.vue` through `details-four.vue`, and `list-two.vue` through `list-five.vue` where relevant. Do not substitute general-crud, training/crud/list or Shell administration screens as complete references. Inspect the @2enapps/ui `list-data.vue` and `form-data.vue` engines for actual behavior. Do not edit node_modules or the library.

| Feature | Use |
| --- | --- |
| List/search/dashboard initialization | getSchemaList, getSchemaFormCarian, initStatsSchema, loadDashboardStats |
| Paging/filter parameters | getParams("", page, this), qSearch and searchObject |
| Service list envelope | returnResponseList; preserve data.data, pageNo, totalItems, totalPages and list/total aliases |
| List decoration | assignSchemaToListData through listCondition |
| Details/breadcrumb | detailsBreadcrumbMixin, openDetails, backToList, onBreadcrumbScreenChange |
| Form validation | standardValidation and the example customValidator |
| Cards/search/notifications | StatCardGrid, ComponentCarian and the example stores/helpers |
| Bulk/print/export/dynamic columns/tabs | Actual example schema/event wiring, only for required domain functions |

Reset both qSearch and searchObject. Use the record name as the breadcrumb label. Exports may still read finalRes.data?.data; preserve the original envelope when adding aliases. Not every module needs six tabs or deletion. Adapt the example structure to actual functions; do not invent use cases from demonstrations.

If a component remains unavailable after library inspection, show an empty shared card labeled exactly **`[ component not available ]`**. Do not create custom buttons, inputs, modals, charts or CSS. Record the gap; do not hide its label or claim the interaction is complete.

### Fixtures and standby API calls

Use synthetic domain fixtures in the module service, not real personal data or unrelated training fixtures. Prepare planned real API calls as inactive comments; do not invent undocumented endpoints. Remove/comment unused imports so lint passes. Clearly label fixture CRUD and messages as prototypes; they do not prove backend persistence. Do not call real business APIs, Shell or SSO during standalone review.

Fixture services preserve real service shapes so integration does not require redesigning views. Demo filters/pagination must agree with fixtures; dropdown choices must match relevant demo data. Production uses server filtering/pagination instead of demo parseQuery/applyFilters functions.

### Standalone development, lint and testing

Use an existing dev-only harness without Shell. If none exists and creating one requires scaffold edits, ask before editing. It may supply required demo plugins/stores/i18n, not a second production login/Shell.

Run these only when scripts exist and their target files have been checked:

```bash
npm run lint
npm run format:check
npm run build
```

If tooling is missing, propose exact configuration/versions first. Do not invent npm scripts or format the entire repository. Fix authorized files only, then rerun checks.

Use `$d-testing submodule-name` in Codex, or `/d-testing submodule-name` in a slash-capable harness, to run the selected verification scope and record actual TESTING.md evidence. Keep VUE_APP_REMOTE=off and external API/storage calls inactive for Phase 2.

White-box tests exercise actual logic, state and fixture services. Playwright MCP visible-browser tests exercise black-box behavior. Cover happy/negative/edge cases, validation, navigation, paging/search/reset and console/network errors. Browser tests alone are not white-box tests. Show the actual UI and screenshots for user review. Missing tooling/browser access is Blocked, not Pass. Save evidence by phase/submodule.

### After all prototypes are accepted

**Prompt 10:** prepare actual metadata and federation contracts following ARCHITECTURE.md. remote-entry.js contains `export {};`. Obtain file-specific permission before changing existing scaffold files. Do not connect Shell automatically. Update PRD to prototype/UI accepted, not production complete.

## Phase 3 — backend, Flyway and real APIs

**Prompts 11–12:** read SCOPE/BACKEND/DATABASE, select one submodule and implement Spring Boot Java 25, the module’s own PostgreSQL database and Flyway. No separate database human-approval table is required. Do not invent missing schemas or alter locked designs without reopening. Access other modules through APIs only.

Backend specifications and implementation need concrete contracts:

| Area | Content |
| --- | --- |
| Controller | Class, HTTP method, endpoint, function, request/response forms, role and source ID |
| Entity | One entity per table, relationships, audit/soft deletion and notes |
| Repository | Query signature, purpose, pagination and related index |
| Service | One service per submodule; function/input/output/rules/transaction/source ID |
| Form | Fields, validation, entity/service mapping and sensitivity |
| Errors | Condition, HTTP status, code, message and logging |

Use actual source IDs, including SDS/UC references if no SRS exists. `findAllByFlagAktif` is appropriate only if flagAktif actually exists; do not invent a column to copy the example.

### Database implementation and backend patterns

See [DATABASE-PATTERNS.md](docs/DATABASE-PATTERNS.md) and [BACKEND-PATTERNS.md](docs/BACKEND-PATTERNS.md). Follow existing project/module patterns before framework tutorials. Do not install repository-restructuring scaffolding tools without approval.

Database standards: unquoted snake_case names, id BIGINT GENERATED ALWAYS AS IDENTITY primary keys (SERIAL as an existing project-pattern alternative), NUMERIC, TIMESTAMPTZ, CREATE TYPE for closed enums, idx_/uniq_/fk_ names and explicit FK ON DELETE/UPDATE rules. Record these in Phase 1. Do not automatically convert locked UUID schemas, dynamic catalogs or pagination contracts; obtain a specific revision decision for conflicts.

Before querying, inspect existing queries, indexes, relationships, batching, page-size limits and timeouts. Avoid N+1 with targeted eager/join/batch fetching. Keyset/cursor pagination for large results must remain compatible with API/UI contracts; do not silently replace getParams/pageNo. Caching requires scoped keys, TTL/invalidation and correct permissions. Add partial/expression indexes for actual query requirements, not arbitrarily.

All schema changes use new Flyway migrations. Test every migration forward and through rollback/recovery against representative non-production data. Verify Flyway edition/undo support; otherwise use a tested compensating migration or backup/restore procedure, not an invented down command. Production is read-only unless a specific mutation is authorized. DROP/destructive changes require approval and a confirmed backup. Never silently modify/delete data.

Use EXPLAIN (ANALYZE, BUFFERS) for slow-query diagnosis on authorized targets; it executes queries. Keep transactions short and atomic. Use advisory coordination where safe with defined keys/order/timeouts; preserve row locks needed for correctness or queue claims.

### Backend testing by scope

Use d-testing for the selected backend/integration unit after its implementation exists. Confirm actual test profiles, accounts, database target and authorized writes before execution. Testing does not authorize production mutations or another submodule.

Stack: PostgreSQL + Spring Data JPA; JUnit 5 + Mockito + Spring Boot Test. Use Mockito for service unit tests, @WebMvcTest for controllers, @DataJpaTest with PostgreSQL for repositories and @SpringBootTest for integration. Do not silently substitute H2 or run context/Flyway tests against unidentified databases.

Use the existing build system. From the backend directory, these are alternatives, not commands that must all run:

```bash
# Maven project with Maven installed:
mvn test
# If the Maven wrapper already exists:
./mvnw test
# For an existing Gradle project with a wrapper:
./gradlew test
```

Do not add Gradle to Maven projects or create wrappers without a requirement/approval. Integration tests may need a specific verify/profile command; inspect actual plugins/profiles, test discovery and reports. Startup/database-backed tests require an authorized execution plan. Unit mocks do not prove real provider/database behavior.

### Java lint/format and security

Follow actual team/project standards. Proposed Checkstyle or Spotless setup needs explicit versions, formatter and settings; do not assume a universal Spring Boot formatter. Do not use frontend Prettier for Java.

Only when the plugins are configured:

```bash
mvn spotless:check
mvn checkstyle:check
mvn -DskipTests compile
```

Format/fix changed Java files only, then rerun checks/build/tests. Formatting does not justify startup or Flyway execution.

For each endpoint, test happy paths, every field/boundary, role/object access, missing/conflicting/duplicate records, concurrency, pagination/sort/filter/empty results, integration errors/timeouts and consistent payload/errors. Check SQL injection, mass assignment, IDOR, uploads, audit and logs without secrets/PII. Review dependency/security scans, critical warnings and architecture boundaries. Repositories manage data; services own transactions. No giant mixed-submodule services, dummy backend responses, hidden TODOs or unused code.

### Execution authorization is separate from schema review

**Prompt 13** prepares exact scripts/checksums, target environment/database/roles, startup/tests/recovery and evidence. **Prompt 14** authorizes that identified plan after the user confirms the target. Never connect to an unidentified database or assume production migration permission. Flyway being enabled does not authorize every pending migration. Never rewrite executed migrations.

### Connect real APIs, then Shell

**Prompt 15** replaces fixtures with real APIs for the tested backend submodule. Preserve service contracts and UI examples, remove production fixture fallbacks and rerun frontend/API tests. **Prompt 16** accepts the submodule and proposes the next backend submodule. Repeat 11–16.

After all submodules, plan Shell MFE/SSO/menu/routes and cross-submodule tests. Show exact diffs and obtain file-specific permission for scaffold/Shell configuration. Do not build a new login or connect browsers directly to databases. Standalone tests do not prove federation, SSO or backend authorization.

## Completion

Use d-manual after verified behavior exists. It writes unlocked USERMANUAL.md for the selected roles/tasks, links actual TESTING evidence and uses real masked screenshots. Missing screenshots remain Not captured; mockups are not runtime proof. Ask user acceptance before providing final locking instructions.

**Prompt 17:** generate an accurate backend README covering purpose/scope, submodules, package structure, prerequisites/setup/run, environment variables without secrets, own-database/migration instructions, Keycloak access matrix and complete API list. Reopen a locked README before editing. Complete TESTING/USERMANUAL from actual evidence and keep PRD as a general summary. Users accept and lock final documents through an uppercase-compatible procedure; agents do not lock them.

**Prompt 18:** deployment requires a separate plan and authorization. Do not deploy merely because code/tests are complete. Record missing components/integrations as actual limitations.

## Evidence required for reports

Each report identifies phase/submodule, functions/screens, changed files, commands, actual Pass/Fail/Blocked/Not run results, screenshot/trace/log paths, limitations and the next decision. Do not record test results before execution or copy historical reference line/warning counts as current verification evidence.

## Required formatting and linting

Every frontend/backend change must pass both formatting and linting checks. Use approved ESLint/Prettier for frontend and the project’s Java formatter/lint configuration for backend. Write readable multiline methods; never compress declarations, conditions and returns into one line. Missing tooling or failed/unrun checks block a completion claim. Report each command/result separately and format authorized changed files only. See [CODE-STYLE.md](docs/CODE-STYLE.md) for examples and the verification procedure.

## Testing and manual skills

Use `$d-testing <submodule>` and `$d-manual <submodule>` in Codex, or `/d-testing <submodule>` and `/d-manual <submodule>` in Claude Code/OpenCode/Cursor/Cline. Other harnesses use their supported skill invocation. Testing records actual results in TESTING.md; manual work documents verified behavior in USERMANUAL.md with real masked evidence. Both preserve locks, scoped execution and user acceptance.

```bash
node skills.js --codex --skill d-testing --skill d-manual
```

Replace --codex with your harness flag. Default installation includes all five skills; no MCP/browser/JDK or application dependencies are installed automatically.

## Keep the hosted prompts synchronized

From dreams-modules-agent after editing either Markdown prompt library:

```bash
npm run sync:prompts
npm run check
npm test
git diff --check
```

The sync command refreshes public/index.html with 18 prompts per language; its Skills section lists all five skills. Repository syntax/tests are separate from module lint/format/browser/database verification. Dedicated formatter/linter scripts are not currently configured in the installer repository; report them as unavailable rather than passed. A Git push does not prove the hosted site deployed successfully.
