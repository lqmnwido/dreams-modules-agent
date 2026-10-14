# Frontend and backend formatting and linting

Formatting and linting are required for every frontend/backend code change. Use the project's approved configuration and existing scripts/plugins. Do not mark implementation complete when either check failed or was not run. If tooling is unavailable or unconfigured, report the specific blocker and propose exact tooling/configuration before adding dependencies. Never invent commands or claim an unrun check passed.

## Readable structure

- Use multiline method/function bodies. Put each declaration, condition, mutation and return on its own line with consistent indentation.
- Use braces around conditional bodies. Separate logical steps with blank lines. Never compress a method's declarations, branches and return into one line, even if it compiles.
- Expand nested objects/arrays and long argument lists according to the approved formatter. Do not use multiple semicolon-separated statements on one line.
- Java annotations go on separate lines above the declaration or annotated parameter. Wrap long signatures, generic types and chained calls according to project style. Separate HTTP mapping, method signature and implementation.
- Preserve public contracts, identifiers and behavior while formatting. Do not rename fields or add business conditions just to make an example look cleaner.
- Concise expression callbacks are acceptable when the project formatter permits them; they are not an excuse to collapse an entire workflow into one line.

## Frontend example

```javascript
actionsSchema() {
  const items = [["back", "Kembali", this.loading]];

  if (this.editable) {
    items.unshift([
      "save",
      "Simpan draf",
      this.loading || !this.draft.modulId,
    ]);
  }

  if (this.record.allowedActions?.includes("publish")) {
    items.push(["publish", "Terbit", this.loading]);
  }

  if (this.record.allowedActions?.includes("setStatus")) {
    items.push(["status", "Simpan status", this.loading]);
  }

  if (this.currentId) {
    items.push(["reload", "Muat semula", this.loading]);
  }

  return schema("Tindakan", [], items);
}
```

This is a formatting example, not a new screen contract. Original UI labels and identifiers are retained. Use ESLint for code rules and Prettier for supported frontend formatting under project configuration. Inspect both scripts and targets; run formatting fixes on authorized changed files, then run format-check and lint-check. Fix new errors and warnings; report existing unrelated warnings separately rather than suppressing them or disabling rules.

## Java example

```java
@PostMapping("/{id}/hantar")
public ResponseEntity<ApiResponse<Map<String, Object>>> submit(
        @PathVariable UUID id,
        @Valid @RequestBody PermohonanSubmitForm form,
        @RequestHeader(value = "If-Match", required = false) String version,
        @RequestHeader(value = "Idempotency-Key", required = false) String key) {
    return Responses.resource(
            service.submit(id, Responses.version(version), key),
            200,
            "/api/v1/permohonan-lawatan");
}
```

This illustrates the supplied signature's formatting only; it does not define an endpoint or key-type policy for new modules. Use an approved Java formatter (for example the project's Spotless configuration) and Java lint/style checks (for example Checkstyle). Follow existing formatter indentation/wrapping rather than imposing the illustrative spacing above. Do not use frontend Prettier as the Java formatter. There is no universal Spring Boot formatting command.

## Verification and reporting

1. Inspect the current formatter/linter versions, configuration, scripts and affected paths before editing.
2. Format changed files using approved tools. Do not reformat reference snapshots, generated build output, node_modules, unrelated files or locked documents.
3. Run format-check and lint-check independently; compilation or a whitespace check does not replace either one.
4. Fix findings and rerun the affected checks. Run the relevant build/tests after code fixes; formatting does not authorize database startup or migrations.
5. Report each formatter/linter command, scope and actual Pass/Fail/Blocked/Not run result. Do not hide unavailable tooling behind a generic claim that quality checks passed.
