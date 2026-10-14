# DATABASE — module-owned database specification template

Fill actual values from Phase 1 sources and decisions. This template is not a complete schema or executable DDL.

## Design and implementation standards

Read [DATABASE-PATTERNS.md](../DATABASE-PATTERNS.md) before finalizing the Phase 1 schema or creating Phase 3 migrations. Specify snake_case names, an id BIGINT GENERATED ALWAYS AS IDENTITY primary key (SERIAL only as an existing project-pattern alternative), NUMERIC, TIMESTAMPTZ, CREATE TYPE for closed enums, idx_/uniq_/fk_ names and explicit ON DELETE/UPDATE rules. Document index/query reuse, page-size limits/timeouts, keyset/cursor compatibility, batching/no-N+1/targeted eager loading, cache invalidation and appropriate advisory coordination.

Conflicting locked or source-defined UUID/catalog/pageNo/locking designs need a specific revision decision; never automatically convert or invent values. Each migration needs forward and rollback/recovery tests against representative data. Production is read-only unless a specific mutation is authorized; DROP/destructive changes require approval and a confirmed backup.

## Ownership

Use a separate PostgreSQL database for the module. Only its owning backend, workers and migrations access it. Other modules use APIs only; no cross-database foreign keys, joins or shared credentials.

## Tables and columns

For each table, specify actual columns, types, nullability, defaults, PK/FK/check/unique constraints, audit and soft-delete behavior. State referenced tables/columns, ON DELETE/UPDATE rules and relationship cardinality. Distinguish source fields from agreed extensions.

| Table / column | PostgreSQL type | NULL / default | Key / constraint / relation | Source / decision |
| --- | --- | --- | --- | --- |

## Indexes and transactions

| Index name | Table / columns / ordering | Unique / predicate | Related query |
| --- | --- | --- | --- |

Specify pagination/filter/sort queries, no-N+1 plans, concurrent writes, optimistic locking, duplicate constraints, numbering and transaction-owned cross-table validation required by actual functions. Do not invent business defaults or other modules’ tables.

## Migrations

Use Flyway, Hibernate generation none and SQL initialization never. Specify migration dependencies and actual deletion/retention rules. Never rewrite applied migrations. No separate human-review/APPROVED section is required. Designs are locked after Phase 1; exact targets/scripts and execution authorization are still required before database connections/startup.
