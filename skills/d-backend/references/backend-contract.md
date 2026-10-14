# BACKEND — templat kontrak dan logic submodul

Isi definisi sebenar pada Fasa 1; templat bukan API implementation. Spring Boot, Java 25 dan PostgreSQL sendiri; panggil modul lain melalui API.

## Corak projek dan stack ujian

Ikut corak modul/submodul sedia ada sebelum convention framework. Jangan install scaffolding tool yang menyusun semula repo tanpa kelulusan. Stack: PostgreSQL + Spring Data JPA; JUnit 5 + Mockito + Spring Boot Test. Rujuk [backend patterns](BACKEND-PATTERNS.md) dan [database patterns](DATABASE-PATTERNS.md).

Gunakan @WebMvcTest bagi controller, @DataJpaTest bagi repository/PostgreSQL dan @SpringBootTest bagi integration. Unit service menggunakan JUnit 5/Mockito. Jalankan suite melalui Maven/Gradle projek sebenar (mvn test atau wrapper sedia ada); jangan cipta build system baharu. Sahkan test profile/database sebelum tests yang memulakan konteks/Flyway; tiada production default atau H2 senyap menggantikan semantics PostgreSQL.

## Controller — satu submodul

Class `{SubmoduleName}Controller`; isi nama sebenar.

| Method | Endpoint | Function | Request form | Response form | Role / object scope | Source ID |
| --- | --- | --- | --- | --- | --- | --- |

Senaraikan hanya fungsi sumber: GET list/detail, POST create/actions, PUT update dan operasi lain jika diperlukan. Tetapkan fields/types/optional, pagination/sort/filter, status/transitions dan examples tanpa secrets. Jangan cipta SRS IDs apabila hanya SDS/UC tersedia.

## Entity — satu entity setiap table

| Entity | Table | Relationships | Audit / soft delete | Notes |
| --- | --- | --- | --- | --- |

## Repository — data access sahaja

| Method signature | Purpose | Pagination | Related index |
| --- | --- | --- | --- |

Gunakan JpaRepository dengan entity/ID type sebenar. `findAllByFlagAktif` hanya jika field itu benar-benar wujud; list besar perlu query bounded/paged. Nyatakan fetch plan/no-N+1.

## Service — satu service/submodul

`{SubmoduleName}Service` dan implementation jika corak projek memerlukannya.

| Function | Input | Output | Business rules | Read-only / write transaction | Source ID |
| --- | --- | --- | --- | --- | --- |

Nyatakan roles/object checks, numbering/status validation, duplicate/concurrency dan remote API failure/timeouts. Transaction boundaries di service, bukan controller/repository logic.

## Form

```text
form/{submodule}/
├── {SubmoduleName}RequestForm.java
└── {SubmoduleName}ResponseForm.java
```

| Form | Field / type | Validation | Mapping | Sensitive? |
| --- | --- | --- | --- | --- |

Forms khusus tindakan boleh ditambah jika kontrak sebenar memerlukannya; jangan terima entity mentah atau caller-owned audit/identity fields.

## Errors

| Condition | HTTP | Code | User message | Logging |
| --- | --- | --- | --- | --- |
| Validation failure | 400 | Isi kod sebenar | Isi mesej sebenar | Tanpa secrets |
| Missing authentication | 401 | Isi kod sebenar | Isi mesej sebenar | Tanpa token |
| Missing authorization | 403 | Isi kod sebenar | Isi mesej sebenar | Object scope dijaga |
| Record not found | 404 | Isi kod sebenar | Isi mesej sebenar | Tiada PII bocor |
| Conflict / duplicate | 409 | Isi kod sebenar | Isi mesej sebenar | Correlation jika ditetapkan |

Satu consistent response/error schema. Jangan pulangkan kejayaan palsu selepas remote failure.

## Quality dan README

Per endpoint: happy/negative/field-boundary/roles/object/missing/duplicate/concurrency/paging/filter/empty/timeouts. Semak SQL injection, mass assignment, IDOR, files dan audit. Java lint/style/formatter, build/tests dan dependency/security scans sebenar; report unrun checks.

Tiada dummy backend responses, hidden TODOs, unused code, swallowed exceptions atau giant mixed-submodule service. README mesti sepadan kod: purpose/scope, submodul, architecture/packages, prerequisites/setup/run, env tanpa secrets, migration, Keycloak role/access matrix dan API list.

| Submodule | Method | Endpoint | Function | Request | Response | Role | Source ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
