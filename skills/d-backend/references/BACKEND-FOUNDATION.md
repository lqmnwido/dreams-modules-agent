# Generated backend foundation

New workspaces include tested technical helpers inspired by kod-api's layering. No domain entity, endpoint, status, permission or migration is generated. These defaults are proposed contracts for new APIs; Phase 1 must confirm their use. Existing locked APIs and workspaces are not rewritten.

## Files and responsibilities

| Package / class | Responsibility |
| --- | --- |
| constant/PagingConstants | Technical defaults: pageNo 1, pageSize 20, maximum pageSize 1000, ascending order |
| form/SearchForm | Paging/sorting fields with Jakarta validation; extend per resource with its approved filters |
| util/PagingUtil | Rechecks boundaries for direct callers; application-defined sort alias allowlist and stable tie-breaker; converts one-based API pages once |
| form/PageResponseForm | Immutable data/pageNo/totalItems/totalPages response; maps the entire JPA page without exposing entities |
| form/ListResponseForm | Immutable data-only envelope for explicitly bounded unpaged results; not a fetch-all query mechanism |
| specification/SpecificationsBuilder | Typed Criteria equality and case-insensitive literal-contains predicates; escapes LIKE wildcards |
| exception/ApiException | Application-authored safe status/code/message; do not pass arbitrary provider or SQL messages |
| exception/InvalidRequestException | Invalid paging/sorting or other approved request failures |
| exception/ResourceNotFoundException | Generic not-found response without record details |
| exception/ResourceConflictException | Generic domain conflict response |
| exception/ErrorDetails | timestamp/status/code/message/fieldErrors; field errors expose field and constraint code, never rejected values |
| exception/GlobalExceptionHandler | Domain, MVC validation and unexpected error translation; preserves HTTP statuses/headers for MVC errors |

The generated exception handler covers MVC controllers. It does not replace Spring Security filter-chain authentication/authorization responses or prove issuer/audience/role mapping. A new API must specify the full response contract, including security errors, in Phase 1. Unexpected exceptions return a generic message; default logs record the exception class only. Add approved safe diagnostics/correlation where needed, without logging raw secrets, SQL or unrelated personal data. Translate known persistence conflicts deliberately; do not turn every database error into a misleading 409.

## Service usage

A resource query form extends SearchForm and adds only actual resource filters. In its service, call `query.toPageable(allowedSorts, defaultAlias, stableAlias)` with a map defined by application code, for example aliases pointing to approved entity properties. Both default/stable aliases must exist. Callers cannot supply that map. Apply a resource-specific lower page-size ceiling when required; 1000 is a technical upper bound, not a source requirement or export ceiling. Page zero, negative sizes, unsupported sort fields and invalid direction are rejected rather than triggering an unbounded query.

Combine Specifications with mandatory actor/location/removal predicates in the service, then use the repository's bounded query. Builder paths are application-defined, never taken directly from query parameters. LIKE `%` and `_` in filter input are treated literally. These helpers do not implement authorization, joins/fetch plans, indexes or batch loading automatically. Validate filter lengths and business rules in the resource form/service. Map each returned entity to the permitted response fields and use PageResponseForm.from(page, mappedRows); count metadata belongs to the authorized query. Use ListResponseForm only after enforcing an approved bound.

Request mapping remains explicit and service-owned. Do not copy persistence/audit fields from inputs. Resolve omitted-versus-null updates and concurrency against the locked design. Keep business services focused and constructor-injected. No UUID utility, business constants or global search form with unrelated fields is supplied.

## Java quality commands

The generated Maven build pins Spotless 2.44.5, google-java-format 1.27.0 (AOSP) and Maven Checkstyle Plugin 3.6.0. Checkstyle enforces braces, one statement per line, no wildcard imports and no empty statements in main and test Java. Spotless supplies formatting and unused-import cleanup. These checks run during validate, so test and verify also enforce them.

```bash
mvn spotless:apply
mvn spotless:check
mvn checkstyle:check
mvn test
```

`spotless:apply` modifies Java source; use it only on authorized files. It is not permission to reformat another project or locked code. Existing workspaces retain their approved formatter/linter until an explicit update. Quality tooling does not replace testing, dependency scanning, security review or performance measurement.

Generated unit/isolated MVC tests cover page limits/sorting, response copies/metadata, predicate construction/wildcard escaping, sanitized exceptions/validation and the existing bearer/local-only guard. They do not run SpringBootTest, start services, connect to a database, prove live SSO or measure SQL performance. Submodule implementation must add controller, service and authorized PostgreSQL tests for its actual rules, constraints, query counts and transactions. Database-dependent tests and startup need the identified execution plan; Flyway stays enabled, ddl-auto stays none and SQL initialization stays never.
