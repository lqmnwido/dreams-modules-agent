# Testing

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. Obtain human approval for the test plan before execution. Preserve real logs/screenshots/traces under `evidence/`; reports go in chat. Never mark unrun checks Pass. Report actual results concisely in chat, including blocked/not-run checks. After all requested work is finished, propose verification/evidence notes for human approval before updating .docs/PRD.md.

Backend/API: each endpoint happy path, field boundaries, roles/object access, missing/conflicting/duplicate records, pagination/sort/filter/empty results, concurrency, integration failures/timeouts and consistent errors.

White-box: business rules/all transitions, custom queries, validation/mapping, claim mapping, transaction commit/rollback, concurrent updates and exception mapping.

Playwright against running Shell with accounts for every role: positive/negative/edge cases; Unicode/long/empty values/date boundaries; double clicks/retry/refresh/back; concurrent users; expired tokens/changed roles/deep links/other users' records; large lists/slow networks/errors; empty/damaged/forged-MIME/oversized/duplicate files; invalid/reused/expired QR if applicable. Preserve allowed traces/videos/screenshots with sensitive data masked.

Quality: build/lint/format, dependency/security scan, architecture, injection/mass assignment/IDOR/uploads/audit. No dummy production responses, unused code, swallowed exceptions or secret logging. Generation/static checks do not prove live browser/API/database behavior.
