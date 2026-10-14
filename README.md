# dreams-modules-agent

Interactive D-ReAMS module scaffolder. No installer dependencies or npm registry publication needed: download/clone the tool and run its Node.js CLI. Frontend/Shell dependencies still use npm.

Requires Node.js >=22.12 (with npm), Git and access to company GitLab. Backend build requires your approved Java/Maven. This supports Spring Boot 3.x/Maven; other versions/build tools need reviewed templates.

The questionnaire asks module name/code, target workspace, Java group/package, approved Java/Boot versions, frontend port and submodules/use cases. Press Enter at the Java/version prompts to use Java 25 (LTS) and Spring Boot 3.5.16. These are reviewed defaults, not a live latest-version lookup; you may enter another approved version. Boot 3.5 has extended commercial support, not free LTS coverage. [Spring requirements](https://docs.spring.io/spring-boot/3.5/system-requirements.html), [support policy](https://spring.io/support-policy/). Blank business answers become TBD. It previews dependencies/folders and asks confirmation before writing. Cancellation writes nothing. It refuses existing files and symlink parents.

## Installation

Visit [D-ReAMS Modules Agent](https://dreams-agents.kohich.site/) for installation commands and the English / Bahasa Melayu prompt library. Enter your module code to customize the English prompts instead of using a fixed M12 reference.

The bootstrap scripts below use main, check prerequisites, clone the tool and run the questionnaire. They do not install system tools or require administrator access. For repeatable installation, use a reviewed release tag or commit.

Linux/macOS:

```sh
# Inspect the script before running it:
curl -fsSL 'https://dreams-agents.kohich.site/install.sh' | bash
```

Windows PowerShell:

```powershell
# Inspect the script before running it:
irm 'https://dreams-agents.kohich.site/install.ps1' | iex
```

Windows policy may require an organization-approved signed script or direct Git clone + `node bin/install.mjs`. No policy bypass is built in. Use Git credential management for private repositories; keep tokens out of commands/documents.

Optional npm/npx packaging is included but not published. After publication: `npx @lqmnwido/dreams-modules-agent`. The same interactive CLI runs.

## Phase skills — install once, use short commands

The workflow is available as portable Agent Skills, without changing the workspace scaffolder:

```sh
node skills.js --codex
# Or choose your harness:
node skills.js --claude
node skills.js --opencode
node skills.js --cursor
node skills.js --gemini
node skills.js --copilot
node skills.js --windsurf
```

Use `$d-dooc`, `$d-frontend <submodule>`, `$d-backend <submodule>` in Codex; use `/d-dooc`, `/d-frontend <submodule>`, `/d-backend <submodule>` in Claude Code/OpenCode/Cursor/Cline. Other harnesses use their documented skill invocation. These replace repeated long phase prompts; phase locks, user interface review and execution authorization still apply.

See [skills installation and invocation](docs/SKILLS.md) for user/project scope, dry runs, safe updates, custom destinations and exact harness compatibility. `node skills.js --list-harnesses` lists 79 named harness targets plus a portable directory, with paths and sources. Use `--harness NAME` or a direct flag. `--all --dry-run` previews the full dated registry; it does not claim every tool in existence. See the [complete support matrix](docs/HARNESS-SUPPORT.md). Skill instructions follow the current [three-phase guide](guide.md); older generated scaffold text and lowercase filenames are not silently migrated by installing skills.

## Generated workspace

```text
workspace/
├── AGENTS.md                # single workspace instruction file
├── .docs/
│   ├── PRD.md               # read first; AI updates after finished work
│   ├── scope.md
│   ├── architecture.md
│   ├── backend.md
│   ├── database.md
│   ├── frontend.md
│   ├── testing.md
│   ├── usermanual.md
│   └── documents/           # place SRS, SDS, mockups here
├── module.config.json
├── document-integrity.json
├── scripts/maintenance.mjs
├── evidence/
├── {module}_fe/             # see frontend structure below
├── {module}_be/             # see backend structure below
└── shell/                   # cloned by network setup/maintenance
```

Frontend includes the current training `src/views/ui-element/` and supporting `src/services/training/` snapshot. These contain mock data, legacy raw controls/styles and training integrations; they are reference material and excluded from the default expose map. Approved domain views/APIs and Shell route wiring remain pending.

## Frontend structure

```text
{module}_fe/
├── package.json
├── exposes.js                       # single federation contract
├── vue.config.js                    # federation, publicPath, singletons
├── .env.local                       # module environment for local work
├── .env.example                     # safe environment template
├── CRUD-REFERENCE.md                # copied training revision reference
└── src/
    ├── remote-entry.js
    ├── metadata.js                  # remote name, version, route prefix
    ├── services/
    │   ├── {module}/
    │   │   ├── http.js              # transport; credentials from host
    │   │   └── {submodule}/index.js # service scaffold per submodule
    │   └── training/               # reference services for ui-element
    └── views/
        ├── {submodule}/interface.vue # exposed page scaffold per submodule
        └── ui-element/             # training references
```

`exposes.js` matches training's contract naming. Each entered submodule exposes `./views/{submodule}/interface`, consumed as `{module}/views/{submodule}/interface` by Shell. Page scaffolds use only shared PageHeader; approved fields/actions are pending. Shell routes/permissions are not registered automatically. Metadata's route prefix is the scaffold default `/{module}`; confirm it before Shell registration.

`services/{module}/http.js` adapts training's generic transport and obtains credentials through `useHostAdapter`. The caller supplies the approved API base URL; public-prefix/authId policies default off and require explicit confirmation. Use the CRUD reference's `getParams`, `detailsBreadcrumbMixin`, `returnResponseList` envelope (preserving `data`, `list`, `total`) and shared validation helpers when implementing real flows.

## Backend structure

Example module `memorial`, package `com.dreams.memorial`:

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
    │       └── db/migration/        # Flyway; database approval required
    └── test/java/com/dreams/memorial/
```

The application class derives from the entered module name; package paths derive from the approved package. Backend creates package directories per entered submodule, application/security configuration and Maven build. No domain endpoints/entities/queries are invented. No SQL migrations are generated. Flyway is enabled; SQL initialization and Hibernate DDL remain disabled. A human must approve the schema before migration creation, then review the exact scripts and target database before execution or backend startup. MinIO, confirmed roles/audience/errors and deployment settings remain TBD.


## API authentication and local Postman testing

Authentication is enabled by default (`API_SECURITY_ENABLED=true`). Set `KEYCLOAK_ISSUER_URI` for secure mode; Shell obtains the access token and the backend validates it. Audience/role mappings and record access remain module-specific reviewed requirements.

After approval of backend startup and its migration scripts/target database, local functional testing without a bearer token:

```sh
mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments="--dreams.security.enabled=false"
```

Then use Postman's **No Auth** against `http://127.0.0.1:8082` (or your selected backend port). The generated local profile sets `server.address=127.0.0.1`. Disabling security with no local profile, mixed profiles, staging/production, or a non-loopback address causes startup failure. Local mode needs no Keycloak issuer. SQL/database configuration and Flyway approval still apply.

No-token mode disables JWT/request and method authorization and provides no authenticated user identity. Identity-dependent business functions may still require secure mode. Test authentication, roles, audit identity and record permissions with real tokens in secure mode. Restart without the disabling flag to restore authentication; unset `API_SECURITY_ENABLED=false` if you set it externally.

Run `mvn -Dtest=SecurityConfigTest test` for the generated filter/guard tests. These use test controllers and a stub decoder; they do not prove live Keycloak connectivity or token signatures.

## Daily work

From generated workspace root:

```sh
node scripts/maintenance.mjs install    # initial npm install only
node scripts/maintenance.mjs            # daily Shell fetch check + npm update
node scripts/maintenance.mjs check-docs # compare generated Markdown hashes
```

AI must obtain human approval before invoking maintenance; running it directly as a human authorizes its documented actions. Maintenance clones missing Shell, validates its origin, fetches at least once per local calendar day and fast-forward pulls only when safe. Local changes/divergence stop branch switching/pulling; no reset/stash/force operations. Initial setup runs only npm install; agents run npm update through daily maintenance. Both commands use --legacy-peer-deps. Before every install/update, both manifests use exactly:

```json
"@2enapps/ui": "git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop"
```

This runs on sessions, not as a background scheduled service. Generated configuration uses sample local ports; humans confirm environment settings. Dependency maintenance does not claim build/browser success.

Read `.docs/PRD.md` first. On the first drafting pass, agents read all supplied SRS/SDS/mockups in `.docs/documents/`, including nested folders, without waiting for extra permission to read. They report missing/unreadable files. AI edits unlocked scope/architecture/database/backend/frontend/testing/usermanual drafts only within approved scope, faithfully using those sources and citing versions/sections. Missing or conflicting facts remain TBD. After drafting is complete, agents use PRD and completed drafts; they reread original sources only on explicit human request for revision or clarification. Once a draft is complete, AI stops editing and submits it for human review. After acceptance, a human runs:

```sh
node scripts/maintenance.mjs lock-doc scope  # repeat for each accepted draft
```

The integrity manifest locks accepted drafts; AI must never alter it or invoke lock-doc. Revised sources require a human to explicitly reopen affected drafts (remove their hashes and approve revision). PRD entries still need completion and separate approval. Sources, instructions and other Markdown remain read-only. Locking does not grant migration approval. The hash checker detects edits; it is not an OS permission boundary. Evidence goes in `evidence/`. Never rerun the installer over existing files.
