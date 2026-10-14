# SCOPE — module requirements routing template

This documentation template is not a reviewed module scope. Fill it from actual Phase 1 sources; do not claim completeness before it is populated and confirmed.

## Identity and sources

Read the module name and code from module.config.json. Use its code field to select the actual matching .docs/documents/mockup/{module code}/ folder; ask if missing or ambiguous. List files, versions, sections and authoritative sources; record missing or unreadable files. Do not invent an SRS when none exists.

## Function map

| Submodule / function / source ID | Actor / record access | Input / outcome / workflow | Rules / exceptions | Source reference | Storage / API / screen |
| --- | --- | --- | --- | --- | --- |

Include every actual function. Link to DATABASE.md, BACKEND.md and FRONTEND.md sections instead of repeating all columns and payloads. Clearly distinguish source facts, conflicts and explicit decisions.

## Decisions and boundaries

| ID | Source fact / question | Recommendation | Explicit answer | Status / impact |
| --- | --- | --- | --- | --- |

Do not assume values, roles or provider contracts. Unanswered questions block only dependent work. Ask at most five questions per group; do not repeat answered questions or requests for evidence the user does not have.

## Phases and acceptance

Record the selected submodule, prototype/UI review/backend/integration progress and TESTING/evidence links. PRD.md holds the general summary. After Phase 1, confirm the relevant sources and ask the user to lock the five design documents before Phase 2. No separate database human-review table is required.
