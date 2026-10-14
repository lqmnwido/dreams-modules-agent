// Synthetic Phase 2 examples only, adapted from V2T hardcode-data.js.
// Replace with the selected submodule's fixtures; never use as an API fallback.
export const demoDocuments = Object.freeze([
  Object.freeze({
    id: "demo-document-001",
    namaDokumen: "Example document A",
    idJenisDokumen: "demo-type-001",
    keteranganJenisDokumen: "Example document type",
    dirDokumen: null
  }),
  Object.freeze({
    id: "demo-document-002",
    namaDokumen: "Example document B",
    idJenisDokumen: "demo-type-001",
    keteranganJenisDokumen: "Example document type",
    dirDokumen: null
  })
]);

// Each prototype gets independent mutable rows; no fake storage objects/URLs.
export function createDemoDocuments() {
  return demoDocuments.map((document) => ({ ...document }));
}
