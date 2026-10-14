# Phase 3 — backend project and testing rules

These standards apply to the selected submodule, without creating a second architecture or restructuring the repository.

## Existing project patterns come first

1. Read existing implemented modules/submodules, package organization, naming, DTO/forms, error envelopes, security, repository queries and test/formatter setup before coding.
2. Follow the project's established pattern before a generic framework convention. Mimic a compatible existing module, adapting confirmed domain requirements rather than copying its business rules, roles or database access.
3. Do not add service interfaces, base classes, factories, directories, dependencies or alternative conventions merely because a framework tutorial uses them. If no suitable pattern exists or a change is needed, ask with one concrete proposal.
4. Never install or run framework scaffolding tools that restructure the repository without explicit approval. Existing scaffold files and locked designs are not rewritten as part of ordinary implementation.

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
