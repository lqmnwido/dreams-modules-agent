---
name: d-manual
description: Create or update a D-ReAMS USERMANUAL from implemented, tested submodule behavior with real masked screenshots and evidence links. Use for user instructions and handover after verification, not speculative feature documentation, acceptance recording or deployment.
---

# D-ReAMS — verified user manual and handover

Read workspace AGENTS.md, module.config.json, .docs/PRD.md, SCOPE.md, applicable FRONTEND/BACKEND specifications, TESTING.md evidence and existing USERMANUAL.md. Inspect actual paths and document-integrity.json first. Existing lowercase filenames may differ; do not silently rename files, unlock documents or create competing manuals. Write Markdown in English except prompts-ms.md; keep actual UI labels, source IDs and paths unchanged. Speak the user's language in conversation.

## Establish verified scope

Identify the selected submodule, roles, actual release/commit and verified functions. Prefer current implementation and matching test evidence for what users can actually do; keep accepted requirements and defects visible when behavior differs. Do not invent steps from a mockup, assume all planned functions work, or turn a fixture prototype into a production claim. Ask a precise question when the release or selected audience cannot be resolved from context.

A manual request authorizes writing the unlocked manual and related authorized PRD summary, not changing application behavior, installing tools, running unknown database targets, issuing certificates/uploads/emails or deploying. Inspect already-running authorized environments for screenshots; do not start a database-backed application without its execution authorization. Missing live access or test evidence is a documented limitation, not permission to fabricate results.

## Write usable instructions

Use the [manual template](references/USERMANUAL.md). Organize role → submodule → navigation → task. For each verified task include:

- Purpose, access requirements and relevant sign-in/navigation provided by Shell.
- Actual visible fields, required/optional inputs, accepted formats/limits and realistic synthetic examples.
- Numbered actions using exact UI labels, with expected status/messages and where the user goes next.
- Actual validation/permission/error handling, retry/recovery, cancellation and duplicate-action behavior where verified.
- Upload/download/report/QR/certificate instructions only when implemented and tested for that role.
- Known limitations, unresolved `[ component not available ]` cards and unavailable integrations; distinguish these from supported functions.

Document user actions rather than internal classes, repositories or migration procedures. Link technical setup to the actual backend/frontend README where appropriate. Do not add custom UI, invent controls, infer permissions from a hidden menu or expose secrets. Keep the scope to the selected verified unit; consolidate other units only when requested and backed by evidence.

## Screenshots and traceability

Use actual screenshots from the identified accepted/tested build and authorized accounts, preferably existing matching TESTING evidence. If capturing through a browser, use available approved tooling and stay within the authorized scenario. Never trigger destructive actions or real external side effects solely for an illustration without the relevant authorization.

Mask personal data, tokens and sensitive URLs before sharing. Show readable screens with useful captions and map each screenshot to the task/source ID, build and evidence path. Label standalone fixture screenshots as prototype evidence. Missing screenshots remain clearly Not captured; do not use generated imagery, unrelated screens or mockups as proof of runtime behavior. Preserve originals according to existing evidence policy and do not overwrite unrelated evidence.

Cross-check written steps, labels, permissions and outcomes against actual implementation and test results. Report discrepancies; do not silently rewrite a locked design or hide a failed test. Obtain human reopening before editing a locked USERMANUAL.md. If only some tasks are verified, document those and list the remainder with specific missing evidence.

## Deliver and stop

Update unlocked USERMANUAL.md and the authorized general PRD summary. Report covered roles/tasks, changed files, actual evidence, documentation checks and remaining limitations. Request user review/acceptance of the concrete manual. Provide compatible human-run locking instructions only after the manual is accepted and complete; never execute locks or record acceptance for the user. Deployment and production changes remain separate authorizations.

For a needed locked-document revision, identify the exact file and ask the human to use `node scripts/maintenance.mjs unlock <name>` and authorize the changes. `unlock` without a name reopens all five Phase 1 designs. Do not run these commands as AI. After user acceptance, provide `lock <name>` for a single document or `lock` for the five unlocked Phase 1 designs, followed by check-docs. Use updated workspace maintenance scripts; never replace these commands with inline manifest edits.
