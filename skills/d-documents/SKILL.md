---
name: d-documents
description: Prepare and confirm D-ReAMS Phase 1 source-based SCOPE, ARCHITECTURE, DATABASE, BACKEND, FRONTEND and PRD documents, then request user locking. Use for module documentation and unresolved source decisions, not frontend or backend implementation.
---

# D-ReAMS Phase 1 — documents

Start or resume Phase 1 without requiring the user to paste the long prompt library. The document-phase skill is `d-documents`.

## Start or resume safely

Read workspace AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module, phase, selected submodule, explicit user decisions and evidence. Speak the user's language in conversation. Write Markdown documentation in English; only prompts-ms.md uses Malay. Preserve source-defined names, identifiers and quoted labels. Invocation authorizes this skill's phase work within the stated module/submodule; it does not accept results on the user's behalf, change locked files, unlock documents, execute an unidentified migration target, or deploy.

Use uppercase .docs/SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. New scaffolds generate uppercase Markdown filenames. Existing versions may be lowercase; lock normalizes the five unlocked Phase 1 filenames to uppercase and locks those paths, while lock <name> preserves the individual filename. Both refuse duplicates and existing locks; older workspace copies need an explicitly authorized script update. Inspect real paths and document-integrity.json; do not silently rename, bypass locks or create duplicate sources of truth. If naming or an old policy conflicts with the current requested workflow, ask one precise question before dependent changes. Never edit AGENTS/manifest/scaffold files merely because a skill is installed. Never discard existing human records.

Each module owns a separate PostgreSQL database; other modules access its data through APIs only. Shell owns menu/navbar/login/SSO/token refresh/route guards; @2enapps/ui from Kai supplies UI. Do not invent provider contracts, credentials, source rules or successful test results. Ask when unclear, keep stable decision IDs and explicit answers, and do not repeat answered questions or unavailable-information requests. Continue independent work; after a repeated failure diagnose before trying again.

## Module Code and mockup selection

Read the Module Code from `module.config.json` field `code` before selecting mockups; the module name/package is not the Module Code. Resolve mockups under `.docs/documents/mockup/{module code}`. For example, code `M12` uses `.docs/documents/mockup/m12/` only when that actual directory is the unique case-insensitive match. Prefer the exact directory name; inspect existing immediate directories for a unique case-only match, report the configured Module Code and resolved path before reading mockups, and never rename source folders. Treat the code as one folder name, not a path: reject separators, `.` and `..`, and do not follow a symlink outside the source tree. If the code is missing, unsafe, inconsistent with the requested module, or the folder is missing/ambiguous, ask the user for the exact code/path before reading mockups. Never substitute another module folder or a dated/ZIP copy without explicit source selection. Continue reading independently identified SRS/SDS while waiting. Record the Module Code and resolved mockup path in SCOPE.md and the PRD source summary.

## Source pass and focused documents

1. Inventory and read module-relevant SRS/SDS under `.docs/documents/` and mockups only from the resolved Module Code folder, including its nested/supporting files. Extract DOCX tables/text and inspect necessary diagrams. Report actual versions/files/sections and unreadable sources. Do not assume an SRS exists or treat vendor/unrelated modules as requirements.
2. Read [document templates](references/templates/SCOPE.md) for organization; follow linked specialized templates below as needed. Templates are not source facts or completed designs.
3. Write unlocked documents with simple, direct content and citations:
   - SCOPE.md: complete relevant source requirements, actors, submodules/functions, workflows, validation/permissions, decisions and routing links. Do not dump every technical detail here.
   - [ARCHITECTURE.md](references/templates/ARCHITECTURE.md): shared ownership/MFE/Shell/UI/folder structure; no module-specific business rules.
   - [DATABASE.md](references/templates/DATABASE.md): actual own-database PostgreSQL tables/columns/types/null/defaults/PK/FK/constraints/indexes/audit/deletion; concrete enough for later migrations.
   - [BACKEND.md](references/templates/BACKEND.md): real per-submodule classes/functions/API/forms/permissions/errors/transactions and source IDs.
   - [FRONTEND.md](references/templates/FRONTEND.md): mockup ideas/fields/actions, exact general-tab-crud/shared UI mappings, synthetic scenarios and planned API contracts. Mockup visual style does not override shared components.
   - [PRD.md](references/templates/PRD.md): general system/phase/decision/source/evidence summary, not duplicated specifications.
4. Source-defined facts must be concrete, not TBD. Distinguish source requirements from recommended resolutions. Ask at most five genuinely unanswered decisions per group, with one concrete recommendation and impact; approval does not supply a missing value. Do not repeatedly ask for provider information the user lacks.
5. After drafting, record the Phase 1 summary in PRD.md within this phase authorization. Reread relevant sources once for the requested confirmation pass, checking completeness and consistency. Correct unlocked omissions and update the summary to the actual outcome. Resume a preserved unfinished pass rather than endlessly restarting source review.

## Phase 3 standards must be designed before locking

Read [database patterns](references/DATABASE-PATTERNS.md) while specifying tables/types/keys/indexes, rollback/recovery, query/cache/pagination/locking plans. Read [backend patterns](references/BACKEND-PATTERNS.md) for existing-project conventions, PostgreSQL/JPA and JUnit 5/Mockito/Spring Boot Test scope. Resolve any source/locked-design conflict explicitly before dependent work; do not leave a UUID-to-BIGINT or pageNo-to-cursor change for silent Phase 3 implementation. These standards add no separate human database-review form.

## Finish and stop

Cross-check each included function through storage, API payload/permissions and screen fields/actions. Fix contradictions within authorized unlocked documents; ask about new business choices. Keep integration evidence separate from schema completeness. Do not claim readiness while required definitions are missing.

There is no separate human database reviewer table or APPROVED record gate in this workflow. The user must still lock the five completed design documents after Phase 1. Verify actual hashes and paths, provide a compatible human-run locking procedure, and stop. Do not run locks or start Phase 2. Provide node scripts/maintenance.mjs check-docs, lock, then check-docs for the human to run with an updated maintenance script. Do not provide inline hash-editing scripts.

TESTING.md and USERMANUAL.md remain later evidence-based documents; do not fabricate test outcomes or screenshots. Report source coverage, decisions, changed files, remaining dependencies and exact next action. Next phase is `d-frontend` only after the user locks and authorizes it.

## Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. Keep the API entry flat; use an optional services/{module}/{submodule}/ directory for extracted supporting modules. Existing workspaces are not automatically renamed.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.

For a needed locked-document revision, identify the exact file and ask the human to use `node scripts/maintenance.mjs unlock <name>` and authorize the changes. `unlock` without a name reopens all five Phase 1 designs. Do not run these commands as AI. After user acceptance, provide `lock <name>` for a single document or `lock` for the five unlocked Phase 1 designs, followed by check-docs. Use updated workspace maintenance scripts; never replace these commands with inline manifest edits.

## Screen filenames and supporting modules

Use source-screen names from FRONTEND.md as PascalCase Vue filenames: `src/views/{submodule}/{ScreenName}.vue`, for example Senarai Permohonan Lawatan → SenaraiPermohonanLawatan.vue. interface.vue is an initial scaffold placeholder only. Keep the flat API entry at `src/services/{module}/{submodule}.service.js`; place extracted schemas, demo/file logic and .mjs/.js helpers under `src/services/{module}/{submodule}/`, not views/{submodule}/. Update authorized imports, tests and exposes/Shell mappings together; do not change locked designs or existing workspaces silently.

Read [frontend layout](references/FRONTEND-LAYOUT.md) when mapping screen paths and service helper ownership.

## Federation mapping after each screen

After completing each authorized screen, immediately add/update its mapping in the existing exposes.js before review; do not wait for all screens. This narrow per-screen exposes.js change is part of screen implementation authorization, even when that file came from the scaffold. Preserve consumed expose keys and unrelated entries, map to the actual case-sensitive named Vue file, and report screen path + expose key + expected Shell import. Do not expose helpers/fixtures or create a second expose.js. Verify configured format/lint/build checks. Keep VUE_APP_REMOTE=off for standalone work; Shell route/menu/SSO changes remain separately authorized. Final metadata work audits the mappings already added per screen.
