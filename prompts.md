# D-ReAMS workflow prompts — English

Use one prompt at a time. Replace M12, module paths and source declarations with the actual module; never carry M12 business rules into another module. Approvals apply only to the concrete preceding proposal you have reviewed. See [guide.md](guide.md) for installation, locking/reopening scripts and conditional lint/format commands.

Implement one explicitly selected submodule at a time: backend → frontend → checks/tests → review → approval for the next. Shared prerequisites must be bounded and explained. Mockups supply draft functional requirements, not final visual design; match exact selected ui-element/general-tab-crud examples using @2enapps/ui. Frontend uses ESLint/Prettier; Java uses approved Java lint/style and a Java formatter. Existing locked designs still require human reopening if a change is needed.

### 1. Recover requirements and draft the scope

Prompt:

Read AGENTS.md and .docs/PRD.md for M12.

I approve completing the unlocked .docs/scope.md. If preserved source-review findings are insufficient, I explicitly authorize rereading only the sources needed to recover concrete requirements.

Use the supplied SDS and .docs/documents/mockup/m12/ as the authoritative functional mockup. Mockups are drafts for fields, actions and workflows, not the final visual specification. UI structure follows selected ui-element examples and @2enapps/ui. There is no standalone SRS. Dated folders and ZIPs are historical references.

Document actual submodules, functions, actors, fields, workflows, validation and permissions. Cite source filenames and sections.

Do not leave source-defined facts as TBD. For conflicting or missing rules, propose concrete resolutions and distinguish them from source requirements.

Preserve the source-review findings and their citations in the scope draft.

No code, migrations or locking.

Explanation: Recover and preserve the actual requirements.

### 2. Present unresolved scope decisions

Prompt:

Read the existing M12 scope draft and preserved source findings.

Consolidate unresolved decisions. Remove duplicates and identify anything already established by sources or explicitly confirmed in this conversation.

Present no more than five unresolved decisions at a time. For each:

- Give its stable decision ID.
- Explain the question simply.
- Give one complete recommended answer.
- Explain its effect on users.
- Identify any exact value or external information still needed.
- Identify what it blocks.
- Recommend whether the affected function can be deferred.

Separate business choices I can answer from external contracts requiring evidence.

Do not repeatedly request information I have already said I do not have. Record its unavailability and propose the next practical way to obtain evidence.

Wait for my answers before presenting the next group. Do not repeat the full source review.

Explanation: Review decisions in manageable groups.

### 3. Approve a scope decision group

Prompt:

I approve the recommendations in your immediately preceding scope decision group exactly as written.

Identify the decision IDs covered by this approval.

Apply fully resolved decisions to the unlocked .docs/scope.md.

Approval of a recommendation does not supply a missing value or external contract. Ask directly for any remaining choice I can answer; keep unavailable external evidence unresolved.

Do not mark unanswered details as approved or silently defer functions.

Present the next independent decision group, or report that all blocking scope decisions are resolved.

No code, migrations or locking.

Explanation: Use only when you agree with the whole preceding group. Otherwise, answer by decision ID.

### 4. Verify scope readiness

Prompt:

Check .docs/scope.md for readiness to prepare technical designs.

Verify concrete submodules, functions, actors, fields, workflows, validation and permissions.

Separate:

- Unresolved business decisions that prevent concrete design.
- External integration contracts that prevent implementation.
- Environment values that can wait until integration testing.
- Functions explicitly deferred by me.

If a business decision blocks design, present its recommended resolution and wait for my answer.

If the scope is ready for technical drafting, submit it for acceptance and clearly identify any remaining implementation dependencies.

Do not lock documents or invent human acceptance records.

Explanation: Business rules must be settled; later deployment values should not unnecessarily block drafting.

### 5. Prepare concrete technical drafts

Prompt:

I accept the completed scope and approve preparing the unlocked M12 technical drafts:

- .docs/architecture.md
- .docs/database.md
- .docs/backend.md
- .docs/frontend.md

Produce concrete designs.

Architecture:
Module boundaries, Shell integration, SSO, configuration and deployment.

Database:
Actual PostgreSQL tables, columns, types, nullability, defaults, keys, relationships, constraints, indexes, audit fields and deletion rules.

Backend:
Actual controllers, services, forms, REST endpoints, request/response fields, validation, errors, transactions and permissions.

Frontend:
Actual screens, fields, actions, services, exposes.js entries and Shell routes using @2enapps/ui and exact selected ui-element/general-tab-crud examples. Name each reference file and map components, schemas, helpers and layout. Do not invent a layout to copy the draft mockup.

Address pagination, N+1 prevention, concurrent updates, duplicate requests and integration failures.

Use the accepted scope and preserved source references. Do not reread original sources without identifying the specific need and obtaining any required authorization.

Distinguish definitive confirmed design from conditional recommendations. Submit unresolved decisions separately.

No code, migrations or locking.

Explanation: Design the actual schema, APIs and screens.

### 6. Review consistency across designs

Prompt:

Review scope, architecture, database, backend and frontend together.

For every included function, verify:

- Required data has concrete database storage.
- API request/response fields and permissions are defined.
- Screens and services use those APIs and display their fields.
- Each screen maps to the exact selected ui-element reference and shared components; draft mockup styling does not override it.
- Validation, statuses and errors agree.
- Relationships, indexes and transaction rules agree.
- Required integrations have defined contracts.

List concrete corrections separately from unanswered decisions and missing external evidence.

Give each item a stable ID and recommend a specific correction.

Do not declare implementation-ready while required contracts remain unresolved.

No code or migrations.

Explanation: Trace each function through all five documents.

### 7. Group remaining decisions and missing evidence

Prompt:

Consolidate the remaining M12 corrections, unanswered decisions and missing integration evidence.

Remove duplicates and identify anything already explicitly approved.

Present no more than five unanswered decisions at a time. For each, give:

- Stable decision ID.
- Simple explanation.
- One complete recommended answer.
- User effect.
- Any exact value I must supply.
- What it blocks.

Keep unavailable provider evidence in a separate dependency list. Do not keep asking me for documents or contacts I have already said I do not have.

Inspect authorized local Shell/shared-service code for additional evidence where useful. Distinguish consumer-code evidence from verified provider contracts.

Continue independent business decisions while external evidence is unavailable.

Do not ask me to approve or lock an incomplete schema. No code, migrations or locking.

Explanation: Use this when technical decisions remain. Resolve policies without repeating unavailable-provider questions.

### 8. Approve technical corrections or a decision group

Prompt:

I approve the concrete corrections and recommendations in your immediately preceding proposal exactly as written.

Identify the decision and correction IDs covered by this approval.

Apply resolved answers consistently to the unlocked scope, architecture, database, backend and frontend drafts.

If an answer still requires a missing value or unanswered choice, ask me directly before marking it resolved.

Do not invent external contracts, configuration, human approval records or function deferrals.

Present the next independent unresolved group, or report that all implementation blockers are resolved.

No code, migrations or locking.

Explanation: Repeat Prompts 7–8 until the applicable decisions are resolved.

### 9. Finalize the designs and reconcile approval wording

Prompt:

I approve finalizing the unlocked M12 designs using only explicitly confirmed decisions.

Make tables, constraints, indexes, API payloads, permissions, statuses and frontend mappings definitive for the agreed implementation scope.

Remove superseded alternatives and contradictory definitions. Preserve source citations and distinguish source requirements from approved recommendations.

Review the database approval section:

- If it does not exist, add an empty human approval table with reviewer, role, decision, reviewed schema revision, date and approval scope; set decision PENDING.
- If it already contains human entries, preserve them exactly.
- Identify placeholder values, missing fields or revision mismatches.
- Correct surrounding narrative so it accurately describes the existing entries.
- Do not claim that fields are blank when they contain values.
- Do not change my decision or other human review fields.

Run a final consistency review.

If schema or implementation blockers remain, explain them and stop without declaring a finalized implementation-ready revision.

Otherwise, identify the exact finalized schema revision and the document version or fingerprint that fixes its reviewed contents.

No code, migrations or locking.

Explanation: This avoids the contradiction between an APPROVED table and paragraphs claiming it is empty.

### 10. Explain how to record valid database approval

Prompt:

Verify whether the database draft contains a complete, concrete schema suitable for migration creation.

Separate schema blockers from later integration or deployment prerequisites.

If the schema is incomplete, list exactly what remains and stop.

If complete:

- Identify the exact finalized schema revision and its document version or fingerprint. If using a fingerprint, define schema-content coverage separately from the editable human approval section.
- Show the existing human approval section.
- Explain which fields are missing, placeholders or inconsistent.
- Explain what I must personally enter for reviewer, actual review role, decision, exact reviewed revision, actual review date and approval scope.

Do not suggest copying instructional placeholder text into those fields.

Distinguish approval to create migrations from approval to execute them.

Do not edit my human approval record, create migrations or run database commands.

Explanation: Personally review the finalized schema and enter real values. Sending this prompt does not record approval.

### 11. Verify approval, readiness and provide locking commands

Prompt:

I have personally completed the human database approval record and accept the finalized designs.

Verify:

- Required decisions for the agreed implementation scope are resolved.
- Tables, API contracts, permissions and screens are concrete and consistent.
- The database approval contains actual reviewer, role, decision, reviewed revision, date and approval scope.
- The reviewed revision matches the finalized schema contents.
- No schema change occurred after that approval without renewed review.

Do not treat APPROVED alone as sufficient when fields are placeholders or the schema remains incomplete.

If any check fails, explain exactly why and do not recommend locking.

If all checks pass, provide the exact commands to lock scope, architecture, database, backend and frontend.

Do not edit approval records or run locking commands.

Explanation: Lock only after the checks pass.

### 12. Select one submodule and agree on tooling

Prompt:

Before implementation, propose a submodule sequence from the accepted designs and select one candidate to start. Name its ID, functions, tables, endpoints, screens and minimum shared prerequisites.

Inspect configured frontend ESLint/Prettier and Java lint/style/formatter standards. Reuse existing settings. If missing, propose exact dependency/plugin versions, configuration, file targets and check/fix commands for approval; do not install yet. Java needs a Java formatter, not frontend Prettier.

Read the exact ui-element/general-tab-crud references for the candidate's screens and present screen → reference file → shared component/helper → API mapping. Mockups are functional drafts, not final visual design. Do not copy demo data, legacy raw controls or unapproved CSS into domain code.

Wait for my submodule and tooling approval. Do not implement all submodules, create migrations or change locked documents.

Explanation: Choose one bounded implementation unit and agree on tooling before code.

### 13. Implement the backend

Prompt:

I approve backend implementation for the single submodule and tooling proposed in your immediately preceding response. Name that submodule's ID; this does not authorize other submodules.

Verify locked-document integrity, that submodule's readiness and recorded schema approval first.

Implement its confirmed controllers, endpoints, forms/DTOs, validation, authorization, services, repositories, transactions, audit and outbox. Limit shared infrastructure to its named prerequisites; do not hide other submodules' implementation there.

Create migrations only within recorded schema approval. Explain FK dependencies first; if full-schema creation is a prerequisite, submit that broader plan before creating it. Never rewrite an executed migration.

Keep Flyway enabled, Hibernate generation disabled, SQL initialization disabled and bearer authentication enabled by default, preserving the approved local-only bypass. Do not invent unavailable provider contracts or fake successful adapters.

Keep the approved Java target. Use approved Java lint/style and formatter configuration; format authorized changed files only. Run formatter check, lint/style check, compilation and meaningful tests that do not connect to a database or execute migrations. Do not use frontend Prettier for Java or disable rules to hide failures.

Do not execute migrations or start against a database. Do not change locked designs; identify any required reopening.

Report the submodule function checklist, changed/new files, actual lint/format/build/test commands and results, and blockers. Stop for review; do not implement the next submodule.

Explanation: Implement one backend submodule, with targeted Java quality checks and no migration execution.

### 14. Implement the frontend

Prompt:

I approve frontend implementation for the current single submodule whose backend was just submitted. Name its ID before work.

Use accepted, locked designs. Read the selected ui-element/general-tab-crud files and match their page/component structure, schemas, tabs, modals, validation, service/helper patterns and shared styles using @2enapps/ui.

The mockup is a functional draft, not final visual design. Do not invent a layout or custom CSS to copy it, or copy demo data/training APIs. If a reference/component cannot support a required interaction, propose a specific exception before deviating. If a locked design conflicts, request the required revision first.

Implement only this submodule's screens and services against real REST contracts. Match exposes.js and Shell imports/routes; Shell owns SSO and refresh. Include loading, empty, success, validation, forbidden, errors and version conflicts without fake success.

Use approved ESLint/Prettier configuration. Format only authorized changed files and run lint, format check and build. Confirm script targets before write/fix; no whole-repository reformat or rule suppression.

Report screen → reference file → shared component/helper → API mapping, screen/function checklist, files, actual commands/results and integration blockers. Do not start apps or run integration tests without an approved plan. Stop; do not implement another submodule.

After current-submodule checks/tests and human review, propose the next submodule and wait for approval. Repeat the backend/frontend/test cycle per submodule; missing runtime evidence remains Blocked/Not run. After all submodules, prepare cross-submodule integration testing.

Explanation: Follow the exact shared UI examples for one submodule, then stop for review.

### 15. Prepare the execution and test plan

Prompt:

I approve preparing the unlocked .docs/testing.md.

Prepare backend/API and frontend/Playwright checks covering confirmed functions, permissions, object access, validation, workflows, duplicates, concurrency and integration failures.

Focus this plan on the current selected submodule and its dependencies. After all submodules, prepare a separate cross-submodule integration round.

Compare generated migration files with the approved schema. Include actual frontend ESLint/Prettier and Java lint/formatter/build results and identify missing tooling.

Present:

- Exact migration filenames and checksums.
- Target environment and database host, port, name and schema.
- Migration commands.
- Startup commands.
- Test commands.
- Required accounts and services.
- Expected outcomes.
- Evidence locations.
- Recovery steps appropriate to the reviewed migrations.

Identify unanswered prerequisites.

Do not execute migrations, start applications or run this execution plan yet. Do not mark unrun checks as passed.

Explanation: Review the exact database target and execution plan.

### 16. Approve and execute the reviewed plan

Prompt:

I approve the exact migration files, checksums, target database, startup commands and test commands in your immediately preceding execution plan.

This approval covers only the identified environment and commands.

If the plan contains an unknown target, unanswered prerequisite or changed migration file, stop and ask me to resolve it before execution.

Otherwise, execute only the approved plan.

Preserve real evidence under evidence/. Report passed, failed, blocked and unrun checks accurately.

Do not deploy or change locked designs.

Explanation: Send only after checking the named target and commands.

### 17. Propose fixes for verified defects

Prompt:

Review failed tests and actual runtime evidence.

For each defect, explain:

- Cause.
- Affected functions and files.
- Concrete proposed fix.
- Required retesting.
- Whether it changes an accepted design or approved schema.

Submit fixes for approval before editing.

If a locked draft requires revision, identify it and explain how I must reopen it. Do not unlock documents yourself.

Do not rewrite an already executed migration as a defect fix.

Explanation: Base fixes on evidence and preserve migration history.

### 18. Apply approved fixes and retest

Prompt:

I approve the specific fixes in your immediately preceding proposal.

Implement those fixes and rerun the approved affected checks. Do not add unrelated changes.

If a fix requires a locked draft to be reopened, wait until I reopen it and authorize the revision.

If it changes the schema, obtain approval against the revised schema before creating a new migration. Do not execute a new migration without execution approval.

Rerun affected lint, formatter checks, build and meaningful tests for changed languages/files. Stay within the current submodule.

Preserve evidence and report remaining failures, blocked checks and limitations.

Explanation: Repeat Prompts 17–18 as necessary.

### 19. Prepare the user manual

Prompt:

I approve preparing the unlocked .docs/usermanual.md from the verified implementation.

Organize it by role and submodule.

Explain navigation, fields, actions, statuses, uploads/downloads and common messages.

Use real screenshots from the authorized running application and mask sensitive information.

Do not describe unimplemented or unverified behavior as available.

Submit the manual, final verification results and remaining limitations for acceptance.

Do not deploy.

Explanation: Document what users can actually do.

### 20. Prepare the PRD maintenance entry

Prompt:

Prepare a concise proposed .docs/PRD.md entry covering:

- Completed functionality.
- Confirmed decisions.
- Source versions and authoritative mockup reviewed.
- Final design and approved schema revision.
- Changed files.
- Actual lint, formatting, build and test evidence for each submodule.
- Remaining defects, limitations and next steps.
- Draft completion, human acceptance and document-lock status.

Future agents should use PRD and completed drafts without rereading original sources unless an authorized revision requires it.

Distinguish documented design, implemented functionality and verified runtime behavior.

Show the proposed entry before writing it. Do not invent human approvals or acceptance.

Explanation: Preserve a reliable record for future sessions.

### 21. Save the approved entry and finish

Prompt:

I approve the PRD entry in your immediately preceding message. Write that exact entry to .docs/PRD.md.

For testing and the user manual, verify actual human acceptance before recommending locking. If acceptance is missing, identify it explicitly.

Provide the commands to lock the accepted testing and user manual drafts. Do not run them.

Report outstanding work, limitations and any remaining acceptance required.

Do not deploy. Deployment requires a separate reviewed plan and explicit approval.

Explanation: Save the accepted record and finish this phase.
