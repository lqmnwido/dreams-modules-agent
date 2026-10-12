# Architecture

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. Use SRS for behavior, SDS for technical design and mockups for interface references. Source conflict/missing detail: ask, mark TBD and wait for a human decision.

| Decision | Choice | Source/ID | Approval |
| --- | --- | --- | --- |
| Database | PostgreSQL; version TBD | User standard | Required |
| Backend | Spring Boot {{boot}} / Java {{java}} / Maven | Installer input | Scope review pending |
| Frontend | Vue CLI 5 / Module Federation / @2enapps/ui | Local training | UI rules in AGENTS.md |
| Roles/statuses/APIs/schema/integrations | TBD | TBD | Pending |

Backend: controller → service → repository → table/entity; forms at API boundary; transactions in services; consistent errors/audit/security. Frontend: Shell provides auth/navigation; submodules own views/services; shared UI owns presentation/helpers.

Environment matrix (local/development/staging/production): ports, DB, Keycloak realm/client, MinIO bucket, network boundaries and deployment settings TBD. Secrets use environment/secret store.

Review dependencies/direction, concurrency/idempotency, ownership, file policies, integration failures/timeouts, indexes/pagination and rollback. No schema changes before database approval.
