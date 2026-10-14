# Frontend screen names and service helpers

Resolve screen names from the selected submodule and the source-screen mapping in FRONTEND.md before implementation. A submodule can contain several screens; do not treat its initial interface.vue scaffold as the permanent filename for all of them.

## Screen files

Use PascalCase Vue filenames derived from the actual screen title. For example, the source screen **Senarai Permohonan Lawatan** maps to:

```text
src/views/permohonan-lawatan/SenaraiPermohonanLawatan.vue
```

Document each source screen, concrete Vue path, service entry, supporting helper directory and federation expose/import mapping in FRONTEND.md. Use actual source-defined titles; do not invent additional screens or translate identifiers merely to make filenames English. Keep the same submodule directory identifier used by the accepted scope. Existing training examples keep their upstream names.

interface.vue is only an initial scaffold placeholder before source screens are known. During authorized implementation, replace it with the named screen and update imports, tests and the authorized exposes.js/Shell route mapping together. Do not leave a duplicate implementation or add an empty forwarding wrapper solely to retain the generic name. If an existing public expose key must remain compatible, map that key directly to the named file under the reviewed federation contract. Do not silently break Shell imports. Locked documents and scaffold/Shell configuration still require their existing reopening/file-specific authorization.

## Services and supporting modules

```text
src/
├── views/
│   └── permohonan-lawatan/
│       └── SenaraiPermohonanLawatan.vue
└── services/
    └── memorial/
        ├── https.js
        ├── hardcode-data.js
        ├── upload.js
        ├── permohonan-lawatan.service.js
        └── permohonan-lawatan/
            ├── schemas.mjs
            ├── demo.mjs
            └── files.mjs
```

The flat `{submodule}.service.js` entry remains responsible for business functions, endpoint paths, payload mapping and explicitly approved fixture selection. The optional `services/{module}/{submodule}/` directory holds extracted schemas, dummy-data helpers, file-related logic and other submodule service support. Create only needed modules; do not create empty helper files or duplicate the central hardcode-data.js fixtures unnecessarily.

Keep standalone JavaScript modules (`.mjs` or `.js` helpers) out of business `views/{submodule}/`. Vue files own rendering and screen-local event wiring; extracted supporting logic belongs under services/{module}/{submodule}/. Preserve existing project extension conventions rather than converting .mjs to .js without a reason. Do not move shared ui-element reference snapshots.

Views import the flat service from `@/services/{module}/{submodule}.service` and supporting modules from `@/services/{module}/{submodule}/...`. The flat service imports transport through `./https`; nested modules use `../https` only when they actually require transport. Do not duplicate fetch/auth/URL/parsing/audit/error plumbing outside https.js. Frontend validation and fixture logic do not replace backend authorization or server validation.

## Verification

After an authorized rename/move, update every import, test, expose target and relevant navigation mapping. Check case-sensitive paths, cycles, lint/format/build and selected screen/service tests. Confirm standalone fixture behavior without real upload/API calls in Phase 2. Record exact changed paths and actual results. Updating these repository instructions does not rename or move files in an existing module workspace.
