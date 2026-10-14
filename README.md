# dreams-modules-agent

D-ReAMS module scaffolder and portable workflow skills. Create a module workspace, prepare and lock its design, review frontend prototypes one submodule at a time, then implement and integrate one backend submodule at a time.

Write Markdown documentation in English. Only `prompts-ms.md` uses Malay; preserve source-defined names, identifiers and quoted UI labels.

## Start here

- [Workflow guide](guide.md): setup, phase sequence, review gates and human-run locking.
- [English prompts](prompts.md) / [Malay prompts](prompts-ms.md): 18 copyable prompts per language.
- [Skill installation](docs/SKILLS.md) and [79-harness support matrix](docs/HARNESS-SUPPORT.md).
- [Shared architecture](ARCHITECTURE.md), [code style](docs/CODE-STYLE.md), [backend patterns](docs/BACKEND-PATTERNS.md) and [database patterns](docs/DATABASE-PATTERNS.md).
- [Hosted installer and prompt library](https://dreams-agents.kohich.site/): searchable harness installation and all five skill commands.

## Install the workspace generator

Requirements: Node.js >=22.12 with npm, Git and access to the private Kai UI/Shell repositories. The installer itself has no npm dependencies. Generated frontend/Shell projects use npm; backend builds require the selected Java version and Maven.

```bash
git clone https://github.com/lqmnwido/dreams-modules-agent.git
cd dreams-modules-agent
node bin/install.mjs
```

The questionnaire asks module name/code, workspace path, Java package/toolchain, frontend port, submodules and use-case inputs. Current installer defaults are Java 25 and Spring Boot 3.5.16; these are repository defaults, not a live latest-version lookup. Confirm project compatibility before changing versions. Blank business answers remain TBD. The installer previews the plan and asks before writing; cancellation writes nothing, and existing files/symlink parents are rejected. Never rerun it to overwrite an existing workspace.

For hosted installation, download and inspect the script before execution:

```bash
curl -fL 'https://dreams-agents.kohich.site/install.sh' -o dreams-agent-install.sh
cat dreams-agent-install.sh
# After review:
bash dreams-agent-install.sh
```

Windows PowerShell:

```powershell
Invoke-WebRequest 'https://dreams-agents.kohich.site/install.ps1' -OutFile dreams-agent-install.ps1
Get-Content dreams-agent-install.ps1
# After review, follow organizational execution policy:
.\dreams-agent-install.ps1
```

Use organizational Git credentials; never put tokens in commands or documentation. No execution-policy bypass or system-tool installation is included. Optional npm packaging exists but is not published by these instructions.

## Install skills for your harness

After workspace creation, run from the generated workspace or from this repository. Each new workspace bundles skills.js and its offline runtime/resources. Choose the harness you use; do not run every example:

```bash
node skills.js --codex
node skills.js --claude
node skills.js --opencode
node skills.js --cursor
node skills.js --gemini
node skills.js --copilot
node skills.js --windsurf
```

All five skills are installed by default across the same 79 named adapters plus the portable directory target:

| Skill | Purpose | Codex | Claude Code / OpenCode / Cursor / Cline |
| --- | --- | --- | --- |
| d-documents | Phase 1 source-based documents and request user locking | `$d-documents` | `/d-documents` |
| d-frontend | One standalone frontend prototype | `$d-frontend attendance` | `/d-frontend attendance` |
| d-backend | One backend submodule and real integration | `$d-backend attendance` | `/d-backend attendance` |
| d-testing | Scoped verification and actual TESTING evidence | `$d-testing attendance` | `/d-testing attendance` |
| d-manual | Verified USERMANUAL and handover | `$d-manual attendance` | `/d-manual attendance` |

Replace attendance with an actual submodule. Windsurf uses @skill mentions; other tools may use skill discovery rather than slash commands. Registry-based installation paths are not live harness tests. The legacy installer selection `--skill d-dooc` resolves to d-documents; old installed copies are not removed automatically.

```bash
node skills.js --list
node skills.js --list-harnesses
node skills.js --cursor --dry-run
node skills.js --harness NAME --project /path/to/module-workspace
node skills.js --opencode --skill d-testing --skill d-manual
```

Default installation is user-wide. `--project` targets an existing workspace. Review changed managed skills before using `--force`; unowned packages are never overwritten. Preview `--all` with `--all --dry-run`. Installing skills does not modify project locks/configuration or install MCP servers, browsers, JDKs or application dependencies. Refresh your harness session if necessary.

## Workflow and ownership

1. **Documents:** read actual sources, settle missing design decisions, confirm relevant sources once, then ask the user to lock the five design documents.
2. **Frontend:** build a synthetic standalone prototype for one submodule, run quality/tests, show it and wait for user interface review. Repeat until all interfaces are accepted.
3. **Backend/integration:** implement and verify one submodule using its locked contracts, authorize identified database execution separately, then connect real APIs. Stop for review before the next submodule.

Use d-testing within the relevant phase and d-manual after verified behavior exists. They do not introduce extra implementation phases or record user acceptance automatically.

Every module owns a separate PostgreSQL database. Only its backend/workers/migrations access it; other modules use its API. Shell owns menu/navbar/layout/login/SSO/token refresh. Vue MFEs load through Module Federation; business data travels through HTTP APIs. UI uses `@2enapps/ui` from Kai.

**Current workflow:** no separate human database-review table or APPROVED record is required. A complete locked database design is still required for migration creation. Executing migrations or starting a database-backed application requires exact scripts, target and execution authorization. Never modify locked designs silently or execute production changes under a general implementation request.

## Lock the completed Phase 1 documents — user only

After Phase 1 drafting, source confirmation and consistency checks are complete, review and accept the five design documents. The agent must stop here and provide the locking commands; the user runs them from the generated workspace root. Do not start Phase 2 until all five documents are locked and the final integrity check succeeds.

For the lowercase drafts currently generated by the installer, run these commands in order. Stop if any command fails; resolve the reported issue before continuing:

```bash
node scripts/maintenance.mjs check-docs
node scripts/maintenance.mjs lock-doc scope
node scripts/maintenance.mjs lock-doc architecture
node scripts/maintenance.mjs lock-doc database
node scripts/maintenance.mjs lock-doc backend
node scripts/maintenance.mjs lock-doc frontend
node scripts/maintenance.mjs check-docs
```

These commands lock `.docs/scope.md`, `.docs/architecture.md`, `.docs/database.md`, `.docs/backend.md` and `.docs/frontend.md`. They do not lock uppercase files such as SCOPE.md. If your workspace uses uppercase canonical files, use the [uppercase-compatible procedure in guide.md](guide.md#uppercase-locking-script--user-only) instead; do not run both procedures or silently rename files.

PRD.md remains the ongoing phase record. TESTING.md and USERMANUAL.md are completed and accepted later, so do not lock them as finished Phase 1 deliverables. If a design is already locked, verify its current hash and reviewed content rather than overwriting its baseline. Subsequent design changes require the user to reopen only the affected document and authorize revision.

Locking records the accepted design baseline. It does not execute migrations or authorize database startup, migration execution or deployment. Those actions still require their identified targets, scripts and execution authorization.

## Workspace documents and Module Code

```text
workspace/
├── AGENTS.md                # single workspace instruction file
├── .docs/
│   ├── PRD.md               # read first; AI updates after finished work
│   ├── SCOPE.md
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── DATABASE.md
│   ├── FRONTEND.md
│   ├── TESTING.md
│   ├── USERMANUAL.md
│   └── documents/           # place SRS, SDS, mockups here
├── module.config.json
├── document-integrity.json
├── skills.js                # offline harness skill installer
├── scripts/maintenance.mjs
├── scripts/skills/          # bundled installer runtime and all five skills
├── evidence/
├── {module}_fe/             # see frontend structure below
├── {module}_be/             # see backend structure below
└── shell/                   # cloned by network setup/maintenance
```

The tree shows canonical uppercase design names. **Compatibility limitation:** the current generator still emits lowercase design drafts and `lock-doc` accepts lowercase names. Inspect actual paths; do not silently rename locked files or claim `lock-doc scope` locks `SCOPE.md`. Follow the [guide’s uppercase compatibility and locking procedure](guide.md#uppercase-compatibility-without-scaffold-changes). Some legacy generated templates still describe the older database approval gate; reconcile them under explicit document revision before locking rather than inventing another approval record.

Read Module Code from `module.config.json` field `code`, not the module name/package. Select `.docs/documents/mockup/{module code}/` using the actual matching directory. For example, M12 may resolve to an existing m12 folder. Report the code/path and ask if missing or ambiguous; never substitute another module’s mockups or a dated ZIP without explicit source selection. Record sources in SCOPE.md and the PRD summary.

## Frontend layout and environment

```text
{module}_fe/
├── package.json
├── exposes.js                       # single federation contract
├── vue.config.js                    # federation, publicPath, singletons
├── .env                             # remote mode and module bucket defaults
├── .env.local                       # module environment for local work
├── .env.example                     # safe environment template
├── CRUD-REFERENCE.md                # copied training revision reference
└── src/
    ├── remote-entry.js
    ├── metadata.js                  # remote name, version, route prefix
    ├── services/
    │   ├── {module}/
    │   │   ├── https.js            # transport; credentials from host
    │   │   ├── hardcode-data.js     # synthetic Phase 2 fixture example
    │   │   ├── upload.js            # shared UI upload schema/service example
    │   │   └── {submodule}.service.js # service scaffold per submodule
    │   └── training/               # reference services for ui-element
    └── views/
        ├── {submodule}/interface.vue # exposed page scaffold per submodule
        └── ui-element/             # training references
```

Generated `.env`, `.env.local` and `.env.example` include:

```dotenv
VUE_APP_REMOTE=off
VUE_APP_BUCKET_MEMORIAL=memorial
```

The generic bucket pattern is `VUE_APP_BUCKET_{MODULE}={module}`. This names storage but does not provision the bucket or verify access. `UPLOAD_BUCKET_{MODULE}` remains a separate unconfigured setting.

- `off`: disables Module Federation for standalone development. It does not create the Phase 2 preview harness; the initial remote-entry.js remains `export {};`.
- `on`: enables Module Federation and remoteEntry.js publication for serving through Shell. Confirm Shell exposes/routes/permissions and host integration before use.
- Restart/rebuild after changing the flag. `.env.local` overrides `.env`; keep the effective mode consistent. Remote mode does not bypass backend authentication.

### Service responsibilities

| File | Responsibility |
| --- | --- |
| `{submodule}.service.js` | WHAT: business functions, endpoint paths, payload mapping and explicitly approved fallback selection |
| `https.js` | HOW: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, confirmed audit transport and transport errors |
| `hardcode-data.js` | Synthetic Phase 2 examples; `createDemoDocuments()` returns independent mutable rows |
| `upload.js` | Shared UI document-upload schema and host attachment/read-client examples |

Services import from `./https`; they do not duplicate fetch/auth/parse/audit plumbing. Module https.js follows the bundled training http.js structure. Preserve host credentials, response metadata and list/detail envelopes. Public-prefix/authId policies remain off unless the integration contract enables them. Audit event intent may come from services; actual audit delivery requires its confirmed contract and is not implemented merely by documenting the layer.

Use fixtures explicitly in Phase 2 and prepare real API calls as inactive comments. Production must never fall back to dummy success after an API failure. Views remain under `{submodule}/interface.vue`; only services use the flat file layout. Existing workspaces are not renamed automatically.

### Shared UI and uploads

Use `general-tab-crud/list-main.vue`, related details/tabs and @2enapps/ui form/table engines. Mockups supply functional ideas, not replacement visual components. Preserve getParams, returnResponseList envelopes and detailsBreadcrumbMixin. If a required component is unavailable, show an empty shared card labeled exactly `[ component not available ]` and record the gap.

The generated upload field follows V2T’s document example:

```javascript
upload: {
  type: "file",
  size: 5,
  align: "center",
  // isTus: true,
  // tusEndPoint: "http://localhost:1080/files/",
  bucketname: process.env.VUE_APP_BUCKET_MEMORIAL
}
```

The 5 MiB/required settings are examples; use accepted domain limits and backend validation. Tus remains inactive. The shared form already invokes its uploader; do not also call uploadExampleAttachment for the same selection. Real uploads require the configured host adapter and authorized private storage. No V2T ASR endpoint or automatic live upload is copied. Reference ui-element/training snapshots remain excluded from default exposes and may contain legacy code; they are not approved business implementations.

## Backend layout and security

Example module memorial, package com.dreams.memorial:

```text
memorial_be/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/dreams/memorial/
    │   │   ├── MemorialApplication.java
    │   │   ├── config/              # infrastructure wiring
    │   │   ├── security/            # JWT authentication; role mapping TBD
    │   │   ├── common/              # response/paging/exceptions after review
    │   │   ├── entity/              # one entity per approved table
    │   │   ├── repository/          # data access only
    │   │   ├── form/{submodule}/
    │   │   ├── service/{submodule}/
    │   │   └── controller/{submodule}/
    │   └── resources/
    │       ├── application.properties
    │       └── db/migration/        # Flyway; locked design, separate execution authorization
    └── test/java/com/dreams/memorial/
```

The generator creates package directories, the application/security configuration and Maven build. It does not implement business APIs/entities or generate SQL migrations. Use Spring Data JPA with the module’s own PostgreSQL database. Keep Flyway enabled, Hibernate generation none and SQL initialization never.

Authentication is enabled by default (`API_SECURITY_ENABLED=true`). Set `KEYCLOAK_ISSUER_URI` for secure mode; Shell obtains the access token and the backend validates it. Audience/role mappings and record access remain module-specific reviewed requirements.

After approval of backend startup and its migration scripts/target database, local functional testing without a bearer token:

```sh
mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments="--dreams.security.enabled=false"
```

Then use Postman's **No Auth** against `http://127.0.0.1:8082` (or your selected backend port). The generated local profile sets `server.address=127.0.0.1`. Disabling security with no local profile, mixed profiles, staging/production, or a non-loopback address causes startup failure. Local mode needs no Keycloak issuer. SQL/database configuration and Flyway approval still apply.

No-token mode disables JWT/request and method authorization and provides no authenticated user identity. Identity-dependent business functions may still require secure mode. Test authentication, roles, audit identity and record permissions with real tokens in secure mode. Restart without the disabling flag to restore authentication; unset `API_SECURITY_ENABLED=false` if you set it externally.

Run `mvn -Dtest=SecurityConfigTest test` for the generated filter/guard tests. These use test controllers and a stub decoder; they do not prove live Keycloak connectivity or token signatures.


## Formatting, linting and evidence

Every frontend/backend change requires both formatter and linter checks. Frontend uses approved ESLint/Prettier; backend uses approved Java formatter/style tools such as configured Spotless/Checkstyle. Write multiline methods, one statement per line, braced conditions and readable signatures. Format authorized changed files only. Missing tooling or failed/unrun checks block a completion claim; syntax/build checks do not substitute for lint/format checks. See [code style](docs/CODE-STYLE.md).

Use JUnit 5/Mockito/Spring Boot Test for backend scope and white-box plus Playwright MCP visible-browser tests for frontend behavior. Identify database-backed test targets first. Record actual Pass/Fail/Blocked/Not run outcomes and masked evidence under evidence/. Mocks, static checks and fixture screens are not live integration proof. d-manual documents verified tasks and real screenshots only; users accept and lock final documents.

## Workspace maintenance

From the generated workspace root:

```bash
node scripts/maintenance.mjs install    # initial npm install only
node scripts/maintenance.mjs            # later Shell check and npm update
node scripts/maintenance.mjs check-docs # check protected Markdown hashes
```

Maintenance clones missing Shell, checks its origin, fetches at least once per local day and fast-forwards only when safe. Local changes/divergence stop switching/pulling. Initial installation and later updates use --legacy-peer-deps and enforce:

```json
"@2enapps/ui": "git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop"
```

Agents need authorization for dependency maintenance; running it yourself authorizes the documented operation. No background scheduler is created. Hash checks are not an OS permission boundary. Users lock/reopen documents; agents never alter the integrity manifest. See guide.md for the exact path-compatible procedure.

## Maintain this repository

After changing prompts.md or prompts-ms.md, refresh the hosted prompt data:

```bash
npm run sync:prompts
npm run check
npm test
git diff --check
```

The sync command updates public/index.html with 18 prompts per language. Keep its skill cards aligned with all five installed skills. These commands verify prompt generation, syntax and repository tests; they do not run a module database, browser or deployment. This repository currently has no dedicated formatter/linter scripts; report those checks as unavailable instead of claiming they passed. Pushing Git changes does not by itself verify hosted deployment.

## Skill commands after bootstrap installation

New workspaces created through the hosted install.sh/install.ps1 bootstrap or direct CLI include a root skills.js launcher and scripts/skills/ runtime with all five skill packages. The temporary bootstrap checkout is not needed afterward. No harness skills are installed until you explicitly select a target.

From the generated workspace:

```bash
node skills.js --opencode
# Or install only in this workspace:
node skills.js --opencode --project .
```

Choose one scope. Replace --opencode with any supported harness flag. Default installation is user-wide. No network or npm dependencies are required by the skills installer itself. Restart/refresh the harness after installation.

Older workspaces are not patched automatically. If skills.js is absent, invoke it from the dreams-modules-agent checkout (using an absolute path if necessary), with --project /path/to/workspace for project scope. Never rerun the module generator over existing files just to add this launcher. These instructions describe the updated generator; publishing or refreshing the hosted website is separate from local verification.
