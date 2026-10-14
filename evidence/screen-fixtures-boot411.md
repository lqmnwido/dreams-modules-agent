# Screen layout, fixtures and Boot 4.1.1 verification

Date: 2026-10-14. Scope: dreams-modules-agent generator and authored instructions. Existing module workspaces, installed harness skills and protected module designs were not changed.

## Changes

- New-project interactive defaults: Java 25 LTS and Spring Boot 4.1.1 stable. Existing saved Boot 3 selections remain supported; no automatic upgrade is performed.
- Boot 4 generation selects spring-boot-starter-webmvc, spring-boot-starter-security-oauth2-resource-server and spring-boot-starter-flyway. Flyway remains enabled, Hibernate DDL generation disabled, SQL initialization disabled and bearer authentication enabled by default.
- Generated synthetic fixture files now live per submodule at src/services/{module}/{submodule}/hardcode-data.js. API entry files remain flat {submodule}.service.js; transport stays https.js.
- Instructions require an inventory and one named Vue file for each source screen, immediate exposes.js/local route registration, one Carian Terperinci card/title, and status_new DOM IDs with an explicit mapping to approved API status fields.
- README, guide, English/Malay prompts, hosted prompt data and portable skill references are aligned. The initial interface.vue remains a source-independent scaffold placeholder, not a claim that a multi-screen submodule is implemented.

## Verification

- npm run check: PASS (JavaScript syntax checks).
- npm test: PASS, 43 tests, zero failures. Sandbox subprocess restrictions required running the suite outside the sandbox; no existing module lock records were changed. Lock tests use temporary fixtures only.
- npm run sync:prompts: PASS, 18 prompts per language.
- Fresh temporary probe_be generation with Java 25 / Boot 4.1.1; mvn -B -Dtest=SecurityConfigTest test: BUILD SUCCESS; 5 tests, zero failures/errors/skips. Maven 3.8.7, OpenJDK 25.0.4.1. Maven emitted its existing Guava sun.misc.Unsafe deprecation warning.
- Security tests use an isolated MVC context and stub JWT decoder. They verify bearer enforcement, method permissions and local-only bypass guards; they do not start the application, connect to a database or prove live SSO/provider behavior.
- git diff --check: PASS.
- Formatter/linter: NOT CONFIGURED in this generator repository. Syntax/tests/whitespace checks are not claimed as formatter or linter results. No application frontend or Java implementation was edited; module implementation instructions continue to require their configured formatter and linter checks.
- No database commands, migrations, backend startup, deployment or push were performed.

## Official compatibility references

- https://docs.spring.io/spring-boot/system-requirements.html lists Spring Boot 4.1.1 as stable and compatible with Java 17 through 26, including Java 25; Maven 3.6.3 or later is supported.
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide documents Boot 4 modular starters and renamed MVC/OAuth2 resource-server dependencies, including the Flyway starter.

Java 25 carries the LTS designation. The instructions do not claim Spring Boot 4.1.1 itself is an LTS release.
