import { getUploadClient, uploadAttach } from "@2enapps/ui";

// Reference: V2T program/maklumat-dokumen.vue upload field.
// Add to the approved GeneratedFormData schema only when implementing uploads.
// Phase 2 stays offline: do not mount a live uploader or call these helpers.
export const documentUploadField = {
  name: "dirDokumen",
  label: "Document",
  type: "upload",
  upload: {
    type: "file",
    size: 5, // MiB in the shared upload input; example, not a domain policy.
    align: "center",
    // isTus: true,
    // tusEndPoint: "http://localhost:1080/files/",
    bucketname: process.env.VUE_APP_BUCKET_{{env}}
  },
  validate: {
    required: true
  }
};

// Explicit integration example; the host owns transport/authentication/storage.
// The shared form's uploader already calls uploadAttach: do not upload twice.
export async function uploadExampleAttachment(field, file) {
  if (!file) {
    throw new Error("An attachment file is required");
  }
  const bucketname = process.env.VUE_APP_BUCKET_{{env}};
  if (!bucketname) {
    throw new Error("VUE_APP_BUCKET_{{env}} is not configured");
  }
  return uploadAttach(field, file, bucketname);
}

// Adapted from V2T upload.js. The upload helper is not an HTTP client.
// Obtain an authorized artifact path from the backend before using client.get.
export function uploadReadClient() {
  const client = getUploadClient();
  if (!client) {
    throw new Error("The host has not provided an upload client");
  }
  return client;
}
