# Database

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. PostgreSQL required; version/schema: TBD.

AI writes the source-based database draft here within approved scope; only a human records approval. Flyway is always enabled (`spring.flyway.enabled=true`). No migrations may be created before schema approval or executed before approval of the exact scripts and target database. Backend startup against a database requires this execution review; enabling Flyway is not approval. Never use Hibernate create/update or another schema tool to bypass this gate.

| Table/entity | Purpose | Submodule | SRS ID |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

| Table.column | Type | Null/default | PK/FK/UQ/index | Validation/domain |
| --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD |

| Parent → child | Cardinality/FK | Delete/update rule | Rationale |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

Review naming, keys, indexes/pagination, audit/soft delete, statuses, sensitivity/encryption/masking/retention, cross-module effects, existing data and rollback strategy.

## Required approval

| Reviewer | Role | Decision | Reviewed schema/version | Comments | Date |
| --- | --- | --- | --- | --- | --- |
| TBD | DBA/Architect/Product Owner | PENDING | TBD | TBD | TBD |

After APPROVED: sequential Flyway migrations in `src/main/resources/db/migration/`; test empty DB, current-version upgrade, project rollback/corrective migration and ERD match; record checksum and real logs.

| Migration | Purpose/dependency | Checksum | Result | Evidence |
| --- | --- | --- | --- | --- |
| TBD | TBD | TBD | Not run | TBD |
