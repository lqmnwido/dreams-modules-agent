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

Requirements: Node.js >=22.12 with npm, Git and access to the private Kai UI/Shell repositories. The installer itself has no npm dependencies. Skill --update explicitly needs Git/network access. Generated frontend/Shell projects use npm; backend builds require the selected Java version and Maven.

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

After Phase 1 drafting, source confirmation and consistency checks are complete, review and accept the five design documents. The agent stops and provides this command sequence. Run it yourself from the generated workspace root; stop if any command fails:

```bash
node scripts/maintenance.mjs check-docs
node scripts/maintenance.mjs lock
node scripts/maintenance.mjs check-docs
```

`lock` validates all five documents, converts any unlocked lowercase/mixed-case filenames to SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md, then records hashes for those uppercase paths. After successful completion all five filenames are uppercase and locked; their contents are unchanged. It refuses missing files, duplicate case variants, symlinks, changed protected files and already-locked designs. Renames are staged and reversed if the manifest update fails; a recovery error identifies files needing human attention. Do not run concurrent document edits or locking commands.

Do not start Phase 2 until all five designs are locked and the final check succeeds. PRD.md remains the ongoing phase record; TESTING.md and USERMANUAL.md are completed later and are not locked by lock.

To lock one accepted document separately, use `node scripts/maintenance.mjs lock scope` (or architecture, database, backend, frontend, testing or usermanual). This resolves the actual filename with the same safety checks but does not rename it; automatic uppercase normalization applies to lock. If some Phase 1 documents are already locked, verify them and lock only the remaining accepted documents individually; do not replace their hashes.

Subsequent design changes require the user to reopen the affected document and authorize revision. Agents must not run either locking command or edit the manifest. Locking does not authorize migration execution, database startup or deployment; exact targets/scripts and execution authorization remain required.

Older workspaces contain their original copy of scripts/maintenance.mjs and do not automatically gain lock or case resolution. Update that script through an explicitly authorized maintenance change before using the new command; do not rerun the generator over existing files. No inline Node script or manual hash editing is needed in updated workspaces.

## Reopen documents for changes — user only

Unlock only what you intend to revise. For one design document:

```bash
node scripts/maintenance.mjs unlock scope
```

For all five Phase 1 design documents:

```bash
node scripts/maintenance.mjs unlock
```

Unlock removes only the selected hash entries. It preserves filenames, contents, source documents, approval records and unrelated locks. Already-unlocked selections are reported without changing the manifest. The script rejects invalid names, duplicate filenames, symlinks and integrity violations in unrelated protected files. A selected draft that was already edited can be unlocked for an explicit human revision; that does not declare its edits reviewed or accepted.

Tell the agent which changes are authorized. After revision, source/consistency checks and your acceptance, lock the selected document again with `node scripts/maintenance.mjs lock scope`, or use `node scripts/maintenance.mjs lock` for all five unlocked Phase 1 designs. The batch lock normalizes all five filenames to uppercase; a single-document lock preserves its existing filename. Run check-docs afterward. Agents do not run lock and unlock commands or record acceptance on your behalf.

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

New scaffolds generate uppercase Markdown filenames, including all .docs design, testing and manual files. For older unlocked lowercase Phase 1 drafts, lock converts all five design filenames to uppercase as part of locking; it refuses duplicates or existing locks. See [document filename compatibility](guide.md#document-filename-compatibility). Existing workspace scripts are not updated automatically. Some legacy generated templates still describe the older database approval gate; reconcile them under explicit document revision before locking rather than inventing another approval record.

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
    ├── main.js                      # standalone mount for normal npm run serve
    ├── standalone-routes.js         # local prototype route targets
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
        ├── {submodule}/{ScreenName}.vue # implemented screen from FRONTEND.md
        └── ui-element/             # training references
```

Generated `.env`, `.env.local` and `.env.example` include:

```dotenv
VUE_APP_REMOTE=off
VUE_APP_BUCKET_MEMORIAL=memorial
```

The generic bucket pattern is `VUE_APP_BUCKET_{MODULE}={module}`. This names storage but does not provision the bucket or verify access. `UPLOAD_BUCKET_{MODULE}` remains a separate unconfigured setting.

- `off`: disables Module Federation for standalone development. It selects src/main.js, which mounts the local app with Pinia, i18n, shared UI and standalone-routes.js. No separate preview runner is required.
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

Use fixtures explicitly in Phase 2 and prepare real API calls as inactive comments. Production must never fall back to dummy success after an API failure. Implemented views use `{submodule}/{ScreenName}.vue` from FRONTEND.md; the flat service entry may use a sibling helper directory. Existing workspaces are not renamed automatically.

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

Choose one scope. Replace --opencode with any supported harness flag. Default installation is user-wide. Normal installation/deletion uses no network or npm dependencies; --update explicitly needs Git/network access. Restart/refresh the harness after installation.

Older workspaces are not patched automatically. If skills.js is absent, invoke it from the dreams-modules-agent checkout (using an absolute path if necessary), with --project /path/to/workspace for project scope. Never rerun the module generator over existing files just to add this launcher. These instructions describe the updated generator; publishing or refreshing the hosted website is separate from local verification.

## Named frontend screens and helper placement

Use source-screen names from FRONTEND.md as PascalCase Vue filenames: `src/views/{submodule}/{ScreenName}.vue`, for example Senarai Permohonan Lawatan → SenaraiPermohonanLawatan.vue. interface.vue is an initial scaffold placeholder only. Keep the flat API entry at `src/services/{module}/{submodule}.service.js`; place extracted schemas, demo/file logic and .mjs/.js helpers under `src/services/{module}/{submodule}/`, not views/{submodule}/. Update authorized imports, tests and exposes/Shell mappings together; do not change locked designs or existing workspaces silently.

See [frontend layout](docs/FRONTEND-LAYOUT.md) for exact examples. The generator currently creates interface.vue before source screens are known; these instructions govern its replacement during authorized implementation.

## Federation mapping after each screen

After completing each authorized screen, immediately add/update its mapping in the existing exposes.js before review; do not wait for all screens. This narrow per-screen exposes.js change is part of screen implementation authorization, even when that file came from the scaffold. Preserve consumed expose keys and unrelated entries, map to the actual case-sensitive named Vue file, and report screen path + expose key + expected Shell import. Do not expose helpers/fixtures or create a second expose.js. Verify configured format/lint/build checks. Keep VUE_APP_REMOTE=off for standalone work; Shell route/menu/SSO changes remain separately authorized. Final metadata work audits the mappings already added per screen.

## Normal standalone serve command

Standalone development uses the normal npm run serve command with VUE_APP_REMOTE=off, VUE_APP_MODUL and VUE_APP_MODUL_PORT from the environment. vue.config.js selects src/main.js when off and src/remote-entry.js when on. main.js activates Pinia before importing @2enapps/ui, installs i18n/shared UI and mounts local hash routes from standalone-routes.js. It does not supply real identity or permit external API/upload/audit calls. When a named screen is completed, update its local route target alongside its exposes.js mapping. Do not create preview/run.cjs, override VUE_CLI_SERVICE_CONFIG_PATH or hardcode another port in a runner. Add actual locale messages required by the selected screens during implementation. Existing workspace files are not changed by this generator update.

## Update or delete installed skills

Run from an updated installer checkout or a new workspace containing the updated skills installer. Replace --codex with --opencode, --claude, --cursor or any supported harness flag; the same actions apply to every adapter.

```bash
# Preview updates from the latest official GitHub main branch:
node skills.js --codex --update --dry-run
# Apply updates to all five skills for that harness:
node skills.js --codex --update

# Preview removal of one installed skill:
node skills.js --codex --skill d-manual --delete --dry-run
# Remove that skill and its managed command wrapper, if applicable:
node skills.js --codex --skill d-manual --delete
```

Add `--project .` for workspace-local installations; omit it for the harness's user-wide directory. Without --skill, the action selects all five skills. Review the preview before removing everything. Delete refuses unowned packages/commands and symlinks; it does not remove harness settings, application files or document locks. Missing installations are reported as absent.

`--update` needs Git/network access and reads skill resources from the official dreams-modules-agent main branch without executing the downloaded code. It explicitly replaces selected managed packages, including local edits, while preserving unowned destinations. `--update --dry-run` downloads to a temporary directory but leaves installed skills unchanged. A normal install is offline and uses the bundled snapshot; unchanged means that snapshot matches the installation, not that GitHub was checked. Use --force only to reinstall the current bundle after reviewing local edits.

An update refreshes installed SKILL.md/reference resources and managed command wrappers only. It does not upgrade an older workspace's skills.js/runtime, add future CLI features to it, update application scaffolds or alter the harness registry bundled with that installer. Older workspace commands that reject --update/--delete need an authorized runtime upgrade or invocation from the updated dreams-modules-agent checkout. Refresh/restart your agent session afterward. Do not run concurrent updates, installs or deletes against the same paths.
