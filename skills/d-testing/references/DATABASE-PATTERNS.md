# Phase 3 — PostgreSQL implementation patterns

User-defined standards for new module design and implementation. Record these during Phase 1 DATABASE.md preparation, then apply in Phase 3. They do not silently replace a source-defined or locked UUID schema, catalog, API pagination contract or proven locking protocol: identify the conflict and ask for a specific revision before dependent changes. No separate database human-review record is introduced.

## Schema rules

| Area | Required rule |
| --- | --- |
| Identifiers | Unquoted snake_case table/column names; avoid reserved words and quoted mixed-case identifiers |
| Primary key | Column named id; prefer BIGINT GENERATED ALWAYS AS IDENTITY. SERIAL is the permitted alternative where the project's existing pattern requires it. No new UUID PK default |
| Foreign-key type | Match the actual referenced key type; no guessed/cast identifier mapping or cross-module database FK |
| Precise decimal | NUMERIC with explicit precision/scale from domain requirements; no floating-point money |
| Timestamp | TIMESTAMPTZ for instants rather than TIMESTAMP. Keep date/time-only business concepts as date/time where required |
| Status/enum | PostgreSQL custom type via CREATE TYPE ... AS ENUM, with explicit values and migration strategy; no unconstrained free-text status columns |
| Ordinary index | idx_{table}_{column}; for compound keys include ordered column names, explicit predicate/expression and purpose |
| Uniqueness | uniq_{table}_{column}; document compound columns and any partial predicate |
| Foreign-key name | fk_{table}_{related}; explicit local/target columns and ON DELETE/ON UPDATE for every FK |

If a name would exceed PostgreSQL's identifier limit, specify a deterministic shortened name and collision check in DATABASE.md; do not rely on silent truncation. SERIAL is not silently changed to BIGSERIAL or IDENTITY on existing tables. External opaque IDs remain separately typed integration fields, not local PK replacements.

Dynamic reference data and a closed enum are not interchangeable. If a source requires administrators to maintain statuses/types or an existing locked design uses a lookup FK, ask whether a reference catalog or fixed enum applies; do not invent an enum or discard the source rule. State how Java enum/JPA mapping, database values and API values agree.

## Implementation and query planning

Use Flyway for every schema change. No manual ad hoc DDL, Hibernate auto-DDL or database console changes outside tracked migrations. Keep Hibernate generation none and SQL initialization never. Every module accesses its own PostgreSQL database via Spring Data JPA; other modules' data arrives through their APIs.

Before writing each query:

1. Search for an existing repository method/query that already solves the requirement.
2. Inspect current indexes, relationship cardinality, FK paths and soft-delete/object-scope predicates.
3. Consider batching IN queries/bulk operations, parameter limits and affected-row checks rather than per-row SQL.
4. Specify page-size default/maximum, stable order and unique tie-breaker. Do not invent a missing business limit; ask and record it.
5. Specify query/statement/lock timeouts through existing project configuration; ask for missing required values rather than disabling bounds.
6. Choose projection, join fetch/eager loading or a bounded second query based on required data; prevent N+1. Eager loading is targeted, not blanket EAGER on every relationship. Do not collection-fetch-join a pageable query and silently paginate in memory.

Maintain indexes for actual commonly queried filter/join/order columns. Reuse an index with a suitable leading key instead of creating redundant indexes. Use partial/expression indexes when real predicates/plans support them; document exact SQL semantics and query matching.

Use JOIN, LATERAL, CTE or batch fetches as needed to avoid repeated queries, not as mandatory syntax for every query. Keep object authorization predicates in data/count queries. Group related writes in short service transactions; no remote calls or user wait inside held database locks.

Query caching is conditional, not automatic. First check the project's caching approach and read/write characteristics. If caching is appropriate, define key scope (including user/role/tenant where applicable), TTL, invalidation and consistency/security requirements. Do not cache privileged results across callers or add a cache dependency without approval. Record a reason when caching is unsuitable.

## Pagination and performance

Use cursor-based/keyset pagination for large result sets. Specify cursor encoding, stable composite order/tie-breaker, next/previous behavior, filter/sort binding and parameter limits before implementation. Maintain source/API compatibility: a frontend using getParams pageNo/pageSize and the training envelope cannot silently become cursor-only. If those contracts conflict, propose and obtain a specific API/UI revision or an explicitly accepted compatibility approach; do not invent page-to-cursor mapping or total counts.

Use EXPLAIN (ANALYZE, BUFFERS) to diagnose slow queries on an authorized representative test database. Record query/parameters, row counts/cardinality, timing/buffers and the before/after plan where optimizing. ANALYZE actually executes the statement; it is not a harmless dry run. Never run it on writes against production without explicit modification authorization. Even read queries need bounded cost/timeouts on production; prefer representative non-production data.

## Migration safety and rollback

- Never alter an applied migration, especially one deployed to production. Use a new versioned Flyway migration for schema changes and preserve checksums/history.
- Review prerequisites, enum evolution, backfills, constraints/index build impact, lock duration, application compatibility and rollback behavior before execution.
- Every migration has a tested rollback/recovery procedure with expected schema/data outcome. Test forward migration and rollback/recovery against representative non-production data, including populated/edge-case records, not just an empty database.
- Do not assume Flyway automatically generates or supports an undo command in the installed edition. Verify edition/version. Where available, use tested undo migrations; otherwise provide a separately tracked compensating migration or tested backup/restore procedure. Not all data changes are reversible: report the limitation and obtain a decision instead of fabricating a lossless down script.
- Rollback/recovery scripts are not automatically executable production permissions. Exact target/scripts/commands and authorization still apply.
- No DROP, TRUNCATE, destructive ALTER, data deletion or irreversible rewrite without explicit approval, confirmed backup and recovery verification. Do not execute a destructive down migration merely to satisfy a checklist. Prefer compatible expand/backfill/contract steps when appropriate.

## Production, transactions and locks

Production is read-only for AI agents unless the user explicitly authorizes identified mutations. Never modify/delete data silently; confirm the actual operation and scope. General permission to implement Phase 3 is not production-write permission. Never connect to an unidentified target, and never query another module's database.

Prefer transaction-scoped advisory locks for application coordination where all relevant writers participate. Specify namespace/key derivation, consistent acquisition order, bounded waits and release at transaction end. Advisory locks are cooperative and do not replace uniqueness/FK constraints, atomic conditional updates, optimistic versions or necessary row protection.

Avoid SELECT ... FOR UPDATE where safe atomic updates/constraints/advisory coordination suffice. It is a preference, not a ban: if correctness needs a row lock or a reviewed worker/queue protocol uses FOR UPDATE SKIP LOCKED, document why and preserve the established protocol until an explicit revision. Never remove required row locks mechanically. Test races/deadlocks/timeouts and retry behavior.

## Phase 3 evidence

For the selected submodule, list reused/new queries, pagination/caching/locking decisions, index-to-query mapping, migration checksums/targets, representative-data forward/rollback results and measured plans for investigated slow queries. Distinguish checks actually run from Not run/Blocked. Keep DATABASE.md, BACKEND.md, README and API contracts aligned.

Technical behavior references: [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html), [Flyway undo](https://documentation.red-gate.com/flyway/reference/commands/undo). These explain mechanics, not authorization to execute.
