---
name: d-backend
description: Implement one D-ReAMS Phase 3 Spring Boot Java 25 backend submodule and own PostgreSQL/Flyway migrations from locked designs, test real APIs and replace its accepted prototype fixtures. Use after Phase 2 interface acceptance; migration execution requires an identified authorized target.
---

# D-ReAMS Phase 3 — one backend and real integration

Read [backend contracts and checks](references/backend-contract.md) for concrete deliverables. This skill does not authorize unrelated submodules, unknown database execution or deployment.

Write Markdown documentation in English; only prompts-ms.md uses Malay. Preserve source-defined names, code identifiers and quoted UI labels.

## Start or resume safely

Read workspace AGENTS.md, module.config.json and .docs/PRD.md. Identify the actual module, phase, selected submodule, explicit user decisions and evidence. Speak the user's language. Invocation authorizes this skill's phase work within the stated module/submodule; it does not accept results on the user's behalf, change locked files, unlock documents, execute an unidentified migration target, or deploy.

Use uppercase .docs/SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md and FRONTEND.md. Existing scaffold versions may be lowercase. Updated maintenance scripts resolve uppercase/lowercase filenames through the same lock-doc and lock-phase1 commands; older workspace copies need an explicitly authorized script update. Inspect real paths and document-integrity.json; do not silently rename, bypass locks or create duplicate sources of truth. If naming or an old policy conflicts with the current requested workflow, ask one precise question before dependent changes. Never edit AGENTS/manifest/scaffold files merely because a skill is installed. Never discard existing human records.

Each module owns a separate PostgreSQL database; other modules access its data through APIs only. Shell owns menu/navbar/login/SSO/token refresh/route guards; @2enapps/ui from Kai supplies UI. Do not invent provider contracts, credentials, source rules or successful test results. Ask when unclear, keep stable decision IDs and explicit answers, and do not repeat answered questions or unavailable-information requests. Continue independent work; after a repeated failure diagnose before trying again.

## Entry and selection

Verify Phase 1 design locks/hashes and Phase 2 interface acceptance for the module before Phase 3. Read SCOPE.md, BACKEND.md, DATABASE.md and the frontend contract. No separate human database reviewer/APPROVED table is required. Required unknown schema/API/business definitions still block dependent work.

Use the user-selected submodule if identified; otherwise propose one with functions/classes/endpoints/forms/tables/indexes/roles/migration dependencies and wait for selection. Explain minimum shared prerequisites; do not hide another submodule or full-schema expansion there. Missing provider contract is not permission to invent one.

## Project and database standards

Read [backend patterns](references/BACKEND-PATTERNS.md) and [database patterns](references/DATABASE-PATTERNS.md) before code. Existing project/module patterns come before generic framework convention. Reuse compatible queries, DTO/errors/security/tests and package layout; do not install framework restructuring/scaffolding tools without approval.

Use PostgreSQL with Spring Data JPA. New schema uses snake_case/unquoted names, id BIGINT GENERATED ALWAYS AS IDENTITY (SERIAL is the permitted existing-pattern alternative), NUMERIC, TIMESTAMPTZ, PostgreSQL CREATE TYPE enums rather than free-text statuses, idx_/uniq_/fk_ naming and explicit FK ON DELETE/UPDATE. If these policies conflict with a source-defined or locked UUID, dynamic catalog, pagination or locking design, ask for a specific revision first; never silently convert it.

Before queries inspect existing implementations/indexes/relationships, batch opportunities, page-size limits and timeouts. Prevent N+1 with targeted joins/projections/eager/batch loading. Use keyset/cursor for large results but do not silently break the established pageNo/getParams/envelope contract. Caching needs scoped keys, TTL/invalidation and consistency; no blanket cache. Diagnose slow queries with authorized EXPLAIN (ANALYZE, BUFFERS), which actually executes statements. Keep transactions short; use cooperative transaction advisory locks for coordination where safe, not as a substitute for constraints or necessary row/queue locks.

Every schema change uses Flyway and a new migration; never edit applied migrations or use ad hoc DDL. Include tested rollback/recovery for every migration using representative non-production data; verify available Flyway undo support or document/test a compensating migration/restore approach. No destructive/DROP operation without specific approval and a confirmed backup. Production is read-only for AI unless identified mutations are explicitly authorized; never modify/delete data silently.

## Implementation

Use Java 25, project-compatible Spring Boot, PostgreSQL and Flyway. Keep Flyway enabled, Hibernate generation none and SQL initialization never. Bearer authentication remains default; preserve only the approved local bypass without treating bypass tests as real identity/security evidence.

Controller owns HTTP mappings; one service/submodule owns business logic and transaction boundaries; repository owns data access; one entity/table; forms live in form/{submodule}. Use actual source IDs including SDS/UC when no SRS exists. Do not add sample flagAktif fields, blanket CRUD/deletes or guessed roles.

Implement actual validation, role and record scope, request/response mapping, errors/statuses, paging/filter/sort/empty, duplicates/concurrent updates, numbering, remote timeouts/failures and audit. Use bounded projection/fetch strategies to prevent N+1. Other modules are reached by API only, never credentials or cross-database queries/FKs.

Create Flyway migrations only from the locked concrete design for this module's database. Explain table dependencies; ask before expanding beyond the chosen unit. Never rewrite executed migrations. No extra schema approval form is required, but execution is separate: prepare exact scripts/checksums, environment/target database/schema/roles, commands/startup/recovery and tests. Obtain execution authorization before connecting/migrating or starting a backend that applies Flyway. Unknown targets stop execution.

Do not edit locked designs, manifest or scaffold files. If a correction is needed, identify exact affected files and request human reopening/authorization. Continue independent in-scope work where possible.

## Java and API quality

Inspect configured Java lint/style and formatter; use team standards (for example Checkstyle/Spotless), exact approved versions and file targets. Java uses a Java formatter, not frontend Prettier; there is no assumed universal Spring Boot formatter. Propose missing tooling before installation. Run targeted format/lint/compile and non-database tests; execute real DB/API tests only through an authorized plan.

Use JUnit 5 + Mockito and Spring Boot Test: unit service tests, @WebMvcTest controller slices, @DataJpaTest repositories on PostgreSQL, and @SpringBootTest integration tests. Run the actual project's suite (./mvnw test, mvn test or ./gradlew test as configured), preserving any existing integration-test profiles/plugins. Never add another build system, replace PostgreSQL with H2 silently, or run context/database tests against an unknown/production target. Verify test discovery and reports; mocks are not live proof.

Cover endpoint happy path, every field/boundary, each role and object scope, missing/conflict/duplicate/concurrent records, paging/sort/filter/empty, integration timeout/failure, consistent responses/errors, SQL injection, mass assignment, IDOR, upload and audit. Review actual dependency/security scan findings. No fake backend success, fixtures in production, hidden TODOs, unused code, mixed-submodule giant services, swallowed exceptions or secrets/PII logs. Separate mocks from live provider proof.

After tested real APIs exist, replace the selected accepted frontend prototype's fixtures with its prepared real service calls, preserving the envelope/getParams/breadcrumb contract. Backend now owns paging/filtering. Remove/disable production fixture paths; never fall back to dummy success after HTTP errors. Run frontend ESLint/Prettier/build and real frontend/API checks. Shell MFE/SSO/menu/routes and cross-submodule integration require an identified separate plan; ask before changing scaffold/Shell config.

## Deliver and stop

Keep the authorized backend README/API list synchronized with actual implementation (purpose/scope, submodules, packages, prerequisites/run/env without secrets, own-database/Flyway, Keycloak role matrix, endpoint/request/response/role/source-ID table). Locked README needs reopening first.

Report functions/screens, files, actual commands/results, evidence, scan findings and blockers as Pass/Fail/Blocked/Not run. Update general PRD phase/submodule status and unlocked TESTING evidence within authorization. Stop for review before another submodule. After all submodules, complete cross-submodule tests and USERMANUAL from verified screenshots, ask user acceptance/final document locking, and leave deployment separate.

## Mandatory readable formatting and linting

Read [code style](references/CODE-STYLE.md). Every code change requires formatter and linter checks, reported separately. Use multiline method bodies with one statement per line, braced conditions and expanded long signatures/calls. Never compress declarations, branching and return into a one-line function. Java mapping annotations, signatures and bodies must be clearly separated. Use approved ESLint/Prettier for frontend and Java formatter/style tooling for backend. Missing tooling or failed/unrun checks block the completion claim; propose exact setup instead of skipping checks or disabling rules. Format changed authorized files only.

## Frontend service layout

Frontend services are flat files at `src/services/{module}/{submodule}.service.js`, beside `https.js`, `hardcode-data.js` and `upload.js`. Import the transport and response wrappers from `./https`. Follow the bundled training `http.js` request/helper/client/response-wrapper structure; the module transport is named `https.js`. Preserve host credentials, response metadata and list/detail envelopes. Do not copy training-specific provider clients, legacy public/authId policies, IP lookups or audit side effects without an approved integration contract. New scaffolds do not create per-submodule service folders. Existing workspaces are not automatically renamed.

The submodule service defines WHAT to call: business-function names, endpoint paths, payload mapping and explicitly approved fallback selection. It imports the shared client instead of calling fetch, assembling URLs/auth headers, parsing raw responses or duplicating audit/error plumbing. The module https.js defines HOW requests run: fetch, URL construction, host credentials/authId policy, serialization/parsing, response wrappers, approved audit transport and transport errors. Services may handle documented domain errors after the transport propagates them. Audit event intent/metadata may originate in the service; transport delivery belongs in https.js under the confirmed host/provider contract. Do not invent an audit endpoint or report audit delivery implemented merely because the layer is documented. Phase 2 may explicitly select fixtures; never silently fall back to dummy success after a production API error.
