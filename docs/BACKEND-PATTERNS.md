# Phase 3 — backend project and testing rules

These standards apply to the selected submodule, without creating a second architecture or restructuring the repository.

## Existing project patterns come first

1. Read existing implemented modules/submodules, package organization, naming, DTO/forms, error envelopes, security, repository queries and test/formatter setup before coding.
2. Follow the project's established pattern before a generic framework convention. Mimic a compatible existing module, adapting confirmed domain requirements rather than copying its business rules, roles or database access.
3. Do not add service interfaces, base classes, factories, directories, dependencies or alternative conventions merely because a framework tutorial uses them. If no suitable pattern exists or a change is needed, ask with one concrete proposal.
4. Never install or run framework scaffolding tools that restructure the repository without explicit approval. Existing scaffold files and locked designs are not rewritten as part of ordinary implementation.

## Default implementation pattern — adapted from kod-api

Use the structural pattern below for new submodule implementation. This adopts the inspected kod-api controller/service/repository/forms approach, not its naming, labels, business fields, version choices or implementation weaknesses. Existing compatible project patterns and locked contracts remain authoritative. The installed skill is self-contained; access to a separate kod-api checkout is not required.

```text
HTTP request
  → Controller: bind and validate the request; delegate; return the agreed HTTP contract
  → Service: authorize actor/record; apply business rules; own the transaction
  → Repository: execute scoped queries and persistence operations
  → Entity: map the approved table and relationships

Repository results → Service mapping → Response form → Controller response
```

### Layer responsibilities

| Layer | Required behavior | Keep out |
| --- | --- | --- |
| Controller | HTTP mappings, typed request/query forms, @Valid, path/header binding and agreed status/headers | Repository calls, business decisions, entity mutation and transaction orchestration |
| Service | Constructor-injected final dependencies; concrete @Service by default; rules, scope checks, mapping and transaction boundaries | HTTP response construction, raw request objects and another module's database |
| Repository | JpaRepository with approved entity/key types; JpaSpecificationExecutor when composable filtering is needed; explicit bounded queries/fetch plans | Response forms, business transitions and external provider calls |
| Entity | One mapped class per approved table, reviewed relationships and constraints | HTTP contracts and serialized API responses |
| Forms | Separate request and response models; action-specific inputs where needed; real validation constraints | Writable audit identity, arbitrary persistence fields and automatic exposure of entity graphs |
| Shared infrastructure | Existing common paging/error contracts, security and genuinely reusable query helpers | A generic CRUD framework or a shared mega-service combining submodules |

Do not add Service/ServiceImpl pairs, base services or mapper dependencies without an existing need/pattern. Small private mapping/filter helpers inside a concrete service are sufficient initially. Extract focused collaborators when complexity warrants it; do not force every operation into one oversized service. Constructor injection makes required dependencies explicit and supports isolated tests. Use existing approved Lombok conventions only; do not add Lombok just to reproduce the reference.

### Read and write flows

For a list: validate query inputs → resolve authorized scope → build allowed predicates → execute one bounded page/projection → map results → return the existing page envelope. Use typed search/query forms for the selected resource. Convert legacy query maps at one boundary; do not grow a global SearchForm with unrelated module fields.

For detail: query by both identifier and authorized scope, including the applicable removal predicate → apply the agreed not-found/forbidden policy → map only permitted response fields. Apply the same visibility policy to related-record routes, imports/exports and list/detail access. Do not hide removed rows only in lists while permitting direct detail or update access.

For writes: obtain the trusted authenticated actor → validate request and record scope → load the aggregate/authorized relationships → check transition/version/duplicates → assign allowed fields explicitly → update audit values → persist and map. Creation, update, removal and physical deletion exist only when approved source behavior requires them. Existing controlled local bypass supplies no real identity and must not fabricate an audit actor.

Use service-level @Transactional for related writes and @Transactional(readOnly = true) for database reads where appropriate. A repository save's transaction alone is not an aggregate transaction. Define propagation and checked-exception rollback behavior when relevant; do not assume every exception rolls back. Keep provider calls, rendering and file transfers outside long-held database locks; use the reviewed staging/outbox/compensation protocol when required, not an invented distributed transaction.

Prefer explicit field mapping. BeanUtils may be retained only with a verified allowlist/exclusion policy and mass-assignment tests. Never copy caller-provided IDs, owner/audit/removal/version fields automatically. Specify omitted-versus-null behavior for updates; ignoring every null prevents clearing nullable fields. Resolve relationships against the module's own authorized reference data, not a new entity with an unchecked ID. Do not introduce optimistic version columns or lock protocols that conflict with a locked schema; resolve missing concurrency design before implementation.

### Filtering, paging and response compatibility

Compose JPA Specifications for actual dynamic filters using reusable comparison/path helpers, with fields/operators selected by application code. Mandatory ownership/removal predicates are always ANDed outside user-controlled OR groups. Avoid constructing SQL fragments or exposing arbitrary entity paths from request input.

Preserve approved pageNo/pageSize semantics and the frontend response envelope. Where the existing contract is the training/kod-api style, use one-based pageNo at the API boundary and convert once to zero-based PageRequest; retain data, pageNo, totalItems and totalPages and the existing frontend list/total aliases. Do not impose this envelope on a project with a different locked contract. Declare the approved page-size ceiling, filter lengths, sort allowlist and a stable tie-breaker. Invalid values return the established validation error. Never use Integer.MAX_VALUE or pageNo=0 as an unrestricted fetch-all shortcut. Exports have their own authorized bounded contract; cursor/keyset pagination requires an accepted compatible API design.

### Performance implementation and evidence

- Inspect similar existing queries, indexes, relationships and cardinality before adding queries. Select only required fields and columns; use count queries with the same authorization/filter predicates when totals are part of the contract.
- Choose a DTO projection, targeted fetch join, entity graph or batch loading for each relationship-heavy response. Do not default every association to EAGER. Avoid collection fetch joins with paginated parents unless the actual query strategy is proven correct; page parent IDs and batch-load children when appropriate.
- No repository or provider call per result row. Batch related reads and reference resolution with bounded input sizes. Do not load the entire table to filter, sort or calculate totals in Java.
- Check generated SQL and query counts on representative PostgreSQL data. Record repeated-query/N+1 checks, rows and payload volume, query count, duration and plans for investigated slow queries. Use authorized EXPLAIN (ANALYZE, BUFFERS) only under the database execution rules. Do not invent timing thresholds or claim improvement without before/after measurements; missing measurements are Not run/Blocked.
- Keep transactions short. Use the approved atomic update/version/lock strategy and database constraints for races; test duplicate and concurrent requests. Indexes support reviewed predicates/sorting/relationships; do not add an index for every field blindly.
- Cache only when a demonstrated use case permits it. Specify scope-aware keys, bounded size, TTL/invalidation and transaction consistency. A Hibernate cache annotation is not evidence that caching works. Do not cache permission-sensitive results across actors/tenants accidentally.
- Provider clients have explicit timeouts and documented failure behavior. Forward credentials only to approved destinations; never log tokens or convert a failed remote call into fake success.

### Security, errors and readable code

@Valid must be backed by real field/boundary constraints and service-level cross-field/business validation. Preserve bearer authentication and implement actual role/record checks. Derive audit identity from the authenticated server context rather than accepting authId as proof of identity. Do not copy anonymous public routes, generic hard-delete endpoints or source-specific flags from kod-api.

Reuse one central exception handler and the accepted error envelope. Preserve exception causes in internal diagnostics; return sanitized messages/codes. Translate specific expected domain/persistence conflicts instead of catching every exception and throwing a new generic exception containing its raw message. Map validation, authentication, authorization, missing records, duplicates and concurrency to the approved HTTP statuses. Never swallow failures or expose SQL, credentials or unrelated personal data.

Follow [code style](CODE-STYLE.md): multiline bodies, one statement per line, braced conditions, separate annotations and wrapped signatures/calls. Keep mapping/query/rule steps readable. Run the approved Java formatter and lint/style checks separately, then compile and test. Do not install new formatter/linter dependencies without the required tooling approval, disable rules or claim whitespace checks are linting.

### Pattern-specific acceptance checks

Alongside the test scopes below, verify null-clearing versus omitted-field updates, mass assignment, trusted audit actor, soft-delete consistency across routes, required scope predicates under OR filters, allowed sorting/page limits, deterministic ordering, duplicate/concurrent writes, transaction rollback on partial failure and lazy mapping after the intended transaction boundary. PostgreSQL integration tests must check actual constraints and fetch/query behavior; mocks cannot prove either. Record formatter, linter, unit/controller/repository/integration tests, dependency scan and measured performance results independently.

## Stack

| Area | Standard |
| --- | --- |
| Backend | Existing Spring Boot project, Java 25 |
| Database | PostgreSQL with Spring Data JPA; module's own database only |
| Schema changes | Flyway migrations; see [database patterns](DATABASE-PATTERNS.md) |
| Tests | JUnit 5, Mockito and Spring Boot Test |
| Format/lint | Existing approved Java formatter/style setup; inspect actual configuration |

## Choose the right test scope

- Service/business-unit tests: JUnit 5 with Mockito for isolated collaborators; assert domain behavior and edge cases, not implementation line-by-line. A mocked repository is not a database integration test.
- Controller tests: @WebMvcTest with project security/error/validation configuration and appropriately mocked service collaborators. Cover status, payload/error schema, validation, role/record scope as applicable. Security-disabled tests do not prove actual bearer authentication.
- Repository tests: @DataJpaTest against representative PostgreSQL behavior. Do not silently substitute H2 when SQL/enums/identity/index/locking semantics depend on PostgreSQL. Use the project's existing approved test database or PostgreSQL Testcontainers setup; propose a missing dependency/runtime before installing it.
- Integration tests: @SpringBootTest for real Spring wiring and the selected API/service/database integration. Use an explicit isolated test profile/database, deterministic cleanup and migrations through the test plan. Never point tests at production or a developer's live database by default.
- Foreign provider mocks and test JWT decoders are labeled test doubles; successful tests do not prove live provider connectivity or token signatures.

@BeforeEach cleanup, rollback transactions and fixtures follow existing tests. Do not assume a test-level transaction rolls back writes committed by another HTTP/server thread; verify isolation and cleanup for the actual test style. No production fixture writes.

## Run the suite using the actual build system

Use an existing wrapper where present and configured: ./mvnw test for Maven or ./gradlew test for Gradle. Otherwise use mvn test for a Maven project with installed Maven. On Windows use the corresponding wrapper command. Do not add Gradle to a Maven project or invent a missing wrapper.

Respect existing integration-test profiles/plugins. For example, if Maven Failsafe owns integration tests, document/run its configured verify/profile command rather than claiming mvn test alone ran every integration test. Verify discovered test counts and actual reports. Test classes annotated @SpringBootTest/@DataJpaTest may start a database or run Flyway; inspect the target first and use the authorized test/execution plan. Compiling tests is not running them.

## Quality report

Report per submodule: patterns reused and any approved deviation; unit/controller/repository/integration tests discovered/executed; commands, profile, database target, actual Pass/Fail/Blocked/Not run and report paths. Include lint/format/build/security/dependency scan results. No tests are passed by declaration; do not hide warnings, change accepted API behavior for a test, or disable checks to make the suite green.

## Mandatory readability checks

Use multiline methods, one statement per line, separate annotation/declaration lines and readable wrapped signatures/calls. Formatting and linting are separate required checks for every change; missing tools or failed/unrun checks block completion. See [code style](CODE-STYLE.md).
