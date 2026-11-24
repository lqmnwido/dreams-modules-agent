# Backend

AI-editable draft until completion and human acceptance; locked drafts are read-only. Follow AGENTS.md. {{module}}_be; Spring Boot {{boot}}; Java {{java}}; Maven; package {{package}}. PostgreSQL only.

Application class: `{{application}}.java`. New scaffolds include shared forms in `form/`, paging constants in `constant/`, helpers in `util/` and `specification/`, and central handling in `exception/`. See ../{{module}}_be/BACKEND-FOUNDATION.md; confirm these proposed technical contracts before domain implementation. `common/` remains available for other genuinely shared infrastructure. Infrastructure belongs to `config/`, token validation/role mapping to `security/`.

Separate controller/service/form packages by submodule; entity per table; repository for data access; service transactions. Match approved error envelope, validation, pagination, sorting and logging.


Use the kod-api-derived structural pattern without its naming, labels or business rules: thin HTTP controllers, concrete constructor-injected services, JPA repositories/entities and separate validated request/response forms. Use explicit allowed-field mapping, scoped JPA Specifications and the existing bounded paging envelope. Services own authorization, audit identity and transactions; avoid per-row queries/provider calls and prove fetch behavior on PostgreSQL. Do not copy unbounded paging, caller-trusted authId or blanket property copying. Existing approved contracts remain authoritative.

Record page/sort limits, mandatory scope/removal predicates, null-clearing behavior, relationship fetch/query budget, rollback/concurrency checks and the actual Java formatter/linter/test commands. Performance claims need representative measurements; none are provided by this template.

Repeat for each submodule:

| Submodule | IDs | Actors/roles | Preconditions | Postconditions | Status flow |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

| Method/path | Function/ID | Request/validation | Response | Role/object access | Errors |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

| Entity/table | Relations/audit/soft delete | Repository query/index/pagination | Service rule/transaction |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

Use approved error codes/messages for 400/401/403/404/409. No endpoints or `flagAktif` query are assumed merely because CRUD was illustrated in the original template.

Keycloak issuer/client/audience, role claim mapping, public endpoints and object access: TBD. All implemented endpoints require tokens unless explicitly approved public. Test expiry, issuer, audience, missing roles and unauthorized record access.

Environment variables: DB_URL (PostgreSQL JDBC), DB_USERNAME, DB_PASSWORD, KEYCLOAK_ISSUER_URI, SERVER_PORT. MinIO dependency/property names, bucket/prefix, size/MIME policy and secret-store bindings: TBD; configure after review.

Human README must cover purpose/IDs, packages, setup/run, environments, migrations, roles, MinIO/file policy, complete API list, build/lint/test/security commands and limitations. Scaffold commands: `mvn verify`, `mvn spring-boot:run`. Human review is required before changes, builds/tests and backend startup. Flyway is enabled; approve exact migration scripts/target database before startup. No build/runtime success is claimed by generation.

Authentication defaults on via `API_SECURITY_ENABLED=true`; issuer is configured by `KEYCLOAK_ISSUER_URI`. After startup/migration approval, use `mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments="--dreams.security.enabled=false"` for local Postman No Auth. Only the local profile and loopback binding permit bypass. It disables request/method authorization, provides no user identity, and is not an authorization test. All other modes require bearer tokens.

New-project installer default: Java 25 LTS and Spring Boot 4.1.1 stable. Boot 4 requires its modular MVC, OAuth2 resource-server and Flyway starters; verify actual test imports/dependencies for that major version. Existing approved projects keep their versions until an upgrade is explicitly authorized. See https://docs.spring.io/spring-boot/system-requirements.html for compatibility.
