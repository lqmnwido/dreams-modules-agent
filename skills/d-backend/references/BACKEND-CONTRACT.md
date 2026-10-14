# BACKEND — submodule contracts and logic template

Fill actual definitions in Phase 1; this template is not an API implementation. Use Spring Boot, Java 25 and the module’s own PostgreSQL database. Access other modules through APIs.

## Project patterns and test stack

Follow existing module/submodule patterns before framework conventions. Do not install scaffolding tools that restructure the repository without approval. Stack: PostgreSQL + Spring Data JPA; JUnit 5 + Mockito + Spring Boot Test. See [backend patterns](BACKEND-PATTERNS.md) and [database patterns](DATABASE-PATTERNS.md).

Use @WebMvcTest for controllers, @DataJpaTest for repositories/PostgreSQL and @SpringBootTest for integration. Service unit tests use JUnit 5/Mockito. Run tests through the project’s actual Maven/Gradle build (mvn test or an existing wrapper); do not introduce another build system. Confirm the test profile/database before context/Flyway tests; never default to production or silently substitute H2 for PostgreSQL semantics.

## Controller — one submodule

Class: `{SubmoduleName}Controller`; fill the actual name.

| Method | Endpoint | Function | Request form | Response form | Role / object scope | Source ID |
| --- | --- | --- | --- | --- | --- | --- |

List source-supported functions only: GET list/detail, POST create/actions, PUT update and other operations where required. Specify fields/types/optionality, pagination/sort/filter, statuses/transitions and examples without secrets. Do not invent SRS IDs when only SDS/UC references exist.

## Entity — one entity per table

| Entity | Table | Relationships | Audit / soft delete | Notes |
| --- | --- | --- | --- | --- |

## Repository — data access only

| Method signature | Purpose | Pagination | Related index |
| --- | --- | --- | --- |

Use JpaRepository with actual entity/ID types. Use `findAllByFlagAktif` only if the field exists; large lists need bounded/paged queries. Specify the fetch plan and N+1 prevention.

## Service — one service per submodule

Use `{SubmoduleName}Service` and an implementation class if the project pattern requires it.

| Function | Input | Output | Business rules | Read-only / write transaction | Source ID |
| --- | --- | --- | --- | --- | --- |

Specify role/object checks, numbering/status validation, duplicate/concurrency behavior and remote API failures/timeouts. Services own transaction boundaries; controllers/repositories do not own business logic.

## Form

```text
form/{submodule}/
├── {SubmoduleName}RequestForm.java
└── {SubmoduleName}ResponseForm.java
```

| Form | Field / type | Validation | Mapping | Sensitive? |
| --- | --- | --- | --- | --- |

Add action-specific forms when actual contracts require them. Do not accept raw entities or caller-supplied audit/identity fields.

## Errors

| Condition | HTTP | Code | User message | Logging |
| --- | --- | --- | --- | --- |
| Validation failure | 400 | Specify actual code | Specify actual message | No secrets |
| Missing authentication | 401 | Specify actual code | Specify actual message | No tokens |
| Missing authorization | 403 | Specify actual code | Specify actual message | Preserve object scope |
| Record not found | 404 | Specify actual code | Specify actual message | No leaked PII |
| Conflict / duplicate | 409 | Specify actual code | Specify actual message | Correlation if configured |

Use one consistent response/error schema. Never return false success after a remote failure.

## Quality and README

For every endpoint, cover happy/negative cases, field boundaries, roles, object scope, missing records, duplicates, concurrency, paging, filtering, empty results and timeouts. Check SQL injection, mass assignment, IDOR, files and audit. Run actual Java lint/style/format, build/tests and dependency/security scans; report checks not run.

No dummy backend responses, hidden TODOs, unused code, swallowed exceptions or giant services mixing submodules. README must match actual code: purpose/scope, submodules, architecture/packages, prerequisites/setup/run, environment variables without secrets, migrations, Keycloak role/access matrix and API list.

| Submodule | Method | Endpoint | Function | Request | Response | Role | Source ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
