---
name: d-dooc
description: Prepare and confirm D-ReAMS Phase 1 source-based SCOPE, ARCHITECTURE, DATABASE, BACKEND, FRONTEND and PRD documents, then request user locking. Use for module documentation and unresolved source decisions, not frontend or backend implementation.
---

# D-ReAMS Phase 1 — documents

Start or resume Phase 1 without requiring the user to paste the long prompt library. The command name is intentionally `d-dooc`.

## Start or resume safely

Read workspace AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module, phase, selected submodule, explicit user decisions and evidence. Speak the user's language. Invocation authorizes this skill's phase work within the stated module/submodule; it does not accept results on the user's behalf, change locked files, unlock documents, execute an unidentified migration target, or deploy.

Use uppercase .docs/SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. Existing scaffold versions may be lowercase and lock-doc currently supports lowercase only. Inspect real paths and document-integrity.json; do not silently rename, bypass locks or create duplicate sources of truth. If naming or an old policy conflicts with the current requested workflow, ask one precise question before dependent changes. Never edit AGENTS/manifest/scaffold files merely because a skill is installed. Never discard existing human records.

Each module owns a separate PostgreSQL database; other modules access its data through APIs only. Shell owns menu/navbar/login/SSO/token refresh/route guards; @2enapps/ui from Kai supplies UI. Do not invent provider contracts, credentials, source rules or successful test results. Ask when unclear, keep stable decision IDs and explicit answers, and do not repeat answered questions or unavailable-information requests. Continue independent work; after a repeated failure diagnose before trying again.

## Source pass and focused documents

1. Inventory and read supplied .docs/documents/ SRS/SDS/mockups including relevant nested/supporting files. Extract DOCX tables/text and inspect necessary diagrams. Report actual versions/files/sections and unreadable sources. Do not assume an SRS exists or treat vendor/unrelated modules as requirements.
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

There is no separate human database reviewer table or APPROVED record gate in this workflow. The user must still lock the five completed design documents after Phase 1. Verify actual hashes and paths, provide a compatible human-run locking procedure, and stop. Do not run locks or start Phase 2. Existing lowercase-only lock-doc is not a valid command for uppercase paths.

TESTING.md and USERMANUAL.md remain later evidence-based documents; do not fabricate test outcomes or screenshots. Report source coverage, decisions, changed files, remaining dependencies and exact next action. Next phase is `d-frontend` only after the user locks and authorizes it.
