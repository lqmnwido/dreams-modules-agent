import {
  useHostAdapter,
  useSupportUserStore,
  useTenantStore
} from "@2enapps/ui";

/**
 * Training transport layer.
 *
 * Copied from `v2t/src/services/v2t/http.js`, which is the established precedent
 * in this codebase: the original `dreams-mfe` obtained its HTTP clients from
 * `src/helpers/http/http-service-factory.js`, a module shared by every
 * application module that pulls in the host's Keycloak instance, API clients and
 * router at load time. A module federation remote has none of those, so each
 * remote that owns API calls carries its own transport rather than resolving the
 * factory. V2T's header said this for V2T; this file is the same decision for
 * Training, plus the two clients Training needs (`pentadbiran`, `kuarters`) and
 * the tenant-aware base-URL rule.
 *
 * Two behaviors of the original factory are reproduced deliberately because
 * the backend depends on them:
 *
 *   1. `/public/` is prefixed onto the path unless the request carries an
 *      `authId` header (`buildUrl`, `http-client.js:50`).
 *   2. `authId` is mirrored into the query string, unconditionally for the ASR,
 *      VTT, KOD and kuarters clients (`alwaysIncludeAuthId: true`).
 *
 * Credentials still come from the host through `getAuthHeaders()`, so no token
 * or identity handling lives in Training.
 */

const IP_LOOKUP_URL = "https://ipinfo.io/ip";

export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(url = "") {
  return url.replace(/\/{2,}/g, "/");
}

function appendQueryParams(url, params = {}) {
  let finalUrl = url || "";

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value === undefined || value === null || value === "") {
      return;
    }

    finalUrl += `${finalUrl.includes("?") ? "&" : "?"}${encodeURIComponent(
      key
    )}=${encodeURIComponent(value)}`;
  });

  return finalUrl;
}

function buildUrl(baseURL, url, header = {}, options = {}) {
  const {
    usePublicPrefix = true,
    appendAuthId = true,
    alwaysIncludeAuthId = false,
    onlyAppendAuthIdWhenHeaderExists = false,
    extraQueryParams = {}
  } = options;

  let finalUrl = url || "";
  const hasHeaderObject = !!header && typeof header === "object";

  if (
    appendAuthId &&
    ((onlyAppendAuthIdWhenHeaderExists && hasHeaderObject) ||
      (!onlyAppendAuthIdWhenHeaderExists &&
        (alwaysIncludeAuthId || !!header?.authId)))
  ) {
    finalUrl += `${finalUrl.includes("?") ? "&" : "?"}authId=${encodeURIComponent(
      header?.authId || ""
    )}`;
  }

  finalUrl = appendQueryParams(finalUrl, extraQueryParams);

  if (usePublicPrefix) {
    finalUrl = (header?.authId ? "" : "/public/") + finalUrl;
  }

  finalUrl = normalizeUrl(finalUrl);

  return `${String(baseURL || "").replace(/\/$/, "")}${finalUrl}`;
}

function buildRequestPayload(data, headers = {}) {
  const requestHeaders = { ...headers };
  let body;

  if (data instanceof FormData) {
    body = data;
    delete requestHeaders["Content-Type"];
    delete requestHeaders["content-type"];
  } else if (data !== undefined && data !== null) {
    body = JSON.stringify(data);

    if (!requestHeaders["Content-Type"] && !requestHeaders["content-type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  return { body, requestHeaders };
}

async function parseResponse(response, metadata = {}, responseType) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  try {
    if (responseType === "blob") {
      data = await response.blob();
    } else if (responseType === "arrayBuffer") {
      data = await response.arrayBuffer();
    } else if (contentType.includes("application/json")) {
      data = await response.json();
    } else if (
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/pdf")
    ) {
      data = await response.blob();
    } else {
      data = await response.text();
    }
  } catch (error) {
    data = null;
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config: metadata.config,
    metadata,
    ok: response.ok
  };
}

/**
 * Mirrors `createHttpService` from the original factory, returning the
 * axios-shaped `{ data, status, config }` object the migrated service
 * functions destructure.
 */
export function createTrainingClient({
  baseURL,
  getExtraQueryParams,
  usePublicPrefix = true,
  appendAuthId = true,
  alwaysIncludeAuthId = false,
  onlyAppendAuthIdWhenHeaderExists = false
}) {
  async function request(url, options = {}) {
    const adapter = useHostAdapter();
    const authHeaders =
      typeof adapter.getAuthHeaders === "function"
        ? await adapter.getAuthHeaders()
        : {};

    const extraQueryParams =
      typeof getExtraQueryParams === "function"
        ? getExtraQueryParams({ header: authHeaders, url, options }) || {}
        : {};

    const fullUrl = buildUrl(baseURL, url, authHeaders, {
      usePublicPrefix,
      appendAuthId,
      alwaysIncludeAuthId,
      onlyAppendAuthIdWhenHeaderExists,
      extraQueryParams
    });

    const { method = "GET", data, headers = {}, responseType, ...rest } = options;
    const mergedHeaders = { ...authHeaders, ...headers };
    const { body, requestHeaders } = buildRequestPayload(data, mergedHeaders);

    const config = { method, headers: requestHeaders, ...rest };
    if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") {
      delete config.body;
    } else {
      config.body = body;
    }

    const metadata = {
      config: {
        baseURL,
        url: fullUrl,
        method,
        headers: requestHeaders,
        data,
        responseType,
        preKandunganJson: ""
      }
    };

    const response = await fetch(fullUrl, config);
    const parsed = await parseResponse(response, metadata, responseType);

    if (!response.ok) {
      const message =
        parsed.data &&
        (parsed.data.message ||
          parsed.data.error_description ||
          parsed.data.error);
      const error = new Error(
        message || `${method} ${fullUrl} failed with status ${response.status}`
      );
      error.response = parsed;
      error.status = response.status;
      throw error;
    }

    return parsed;
  }

  return {
    get: (url, options = {}) => request(url, { ...options, method: "GET" }),
    post: (url, data, options = {}) =>
      request(url, { ...options, method: "POST", data }),
    put: (url, data, options = {}) =>
      request(url, { ...options, method: "PUT", data }),
    delete: (url, options = {}) => request(url, { ...options, method: "DELETE" })
  };
}

/**
 * Tenant-aware base URL.
 *
 * Ported from `getApiBaseByTenant` in `dreams-mfe/src/components/functions/general.js`.
 * The tenant segment is only injected for the kod / kuarters / kewangan /
 * lookups modules; `pentadbiran` is not in that list and is returned unchanged.
 * The tenant comes from the Pinia store that `ui` owns and exports, matching the
 * original `getCurrentTenantByUrl()`.
 */
function getApiBaseByTenant(baseUrl, modul) {
  if (
    modul !== "kod" &&
    modul !== "kuarters" &&
    modul !== "kewangan" &&
    modul !== "lookups"
  ) {
    return baseUrl;
  }

  const tenant = useTenantStore().selectedTenant;
  // "arkib" is this deployment's own tenant, and its API paths are served
  // unprefixed, so it is the "leave the base URL alone" sentinel here. It has
  // to stay spelled the same as the store default.
  return tenant && tenant !== "arkib"
    ? String(baseUrl).replaceAll("/api/", `/${tenant}/api/`)
    : baseUrl;
}

function readIdPejabatTadbir() {
  // Original read this via `retrieveAndDecryptLS`, which returns the raw
  // localStorage value unless VUE_APP_ENCRYPT_LS is "1". The encrypted branch
  // needs a key that lives in the host and cannot be reproduced here, so the
  // plain read is used; the field is only an extra query parameter.
  try {
    const value = localStorage.getItem("idPejabatTadbir");
    return value === "undefined" ? null : value;
  } catch (error) {
    return null;
  }
}

/* The endpoints the original Training program service talked to. */

export const pentadbiran = createTrainingClient({
  baseURL: getApiBaseByTenant(process.env.VUE_API_URL_PENTADBIR || "", "pentadbiran"),
  usePublicPrefix: true,
  appendAuthId: true,
  alwaysIncludeAuthId: false,
  onlyAppendAuthIdWhenHeaderExists: false
});

export const kuarters = createTrainingClient({
  baseURL: getApiBaseByTenant(process.env.VUE_API_URL_KUARTERS || "", "kuarters"),
  usePublicPrefix: false,
  appendAuthId: true,
  alwaysIncludeAuthId: true,
  getExtraQueryParams: () => ({
    authIdPpt: readIdPejabatTadbir() || undefined
  })
});

/* ------------------------------------------------------------------ */
/* Audit trail                                                         */
/* ------------------------------------------------------------------ */

function checkModulByUrl(url = "") {
  const modules = [
    [process.env.VUE_API_URL_PENTADBIR, "PENTADBIRAN"],
    [process.env.VUE_API_URL_KOD, "PENGURUSAN KOD"],
    [process.env.VUE_API_URL_INTEGRATION, "INTERGRASI"],
    [process.env.VUE_API_URL_KEWANGAN, "KEWANGAN"],
    [process.env.VUE_API_URL_VTT, "VTT"],
    [process.env.VUE_API_URL_AI, "AI"],
    [process.env.VUE_API_URL_ASR, "ASR"],
    [process.env.VUE_API_URL_PEROLEHAN, "PEROLEHAN"],
    [process.env.VUE_API_URL_UPLOAD, "UPLOAD"]
  ];

  const match = modules.find(([base]) => base && url.includes(base));

  return match ? match[1] : "";
}

async function getIpAddress() {
  try {
    const response = await fetch(IP_LOOKUP_URL);

    if (!response.ok) {
      return "";
    }

    return ((await response.text()) || "").trim();
  } catch (error) {
    console.error("getIPAddress Error fetching IP address:", error);
    return "";
  }
}

function readLocalUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
}

/**
 * Builds the audit entry using the original naming rules from
 * `postAuditTrails` / `setAuditTrails` in `dreams-mfe`'s `general.js`, then
 * hands the finished record to the host. The naming is business behavior and
 * stays in V2T; persisting it needs the host's audit endpoint and credentials.
 */
export async function setAuditTrails(
  jenisTransaksi,
  extendUrl,
  responseObj,
  payload,
  namaProses,
  isAudit
) {
  if (!isAudit) {
    return;
  }

  const adapter = useHostAdapter();
  if (typeof adapter.recordAudit !== "function") {
    return;
  }

  const ipAddress = await getIpAddress();

  try {
    if (responseObj && responseObj.status === 200) {
      const config = (responseObj && responseObj.config) || {};
      const fullUrl = config.url || "";
      const supportUser = useSupportUserStore().selectedSupportUser;
      const user = readLocalUser();

      let process = namaProses;
      let transaction = jenisTransaksi;

      if (!process && config.url) {
        process = config.url
          .replace("/", "")
          .replace(/\//g, " | ")
          .replace(/-/g, " ")
          .trim()
          .toUpperCase()
          .split("?")[0];

        if (extendUrl === "/authenticate") {
          process = "LOG MASUK PENGGUNA";
          transaction = "LOGIN";
        } else if (transaction === "INSERT") {
          process = "TAMBAH MAKLUMAT " + process;
        } else if (transaction === "UPDATE") {
          process = "KEMASKINI MAKLUMAT " + process;
        } else if (transaction === "DELETE") {
          process = "HAPUS MAKLUMAT " + process;
        }

        if (transaction === "UPLOAD") {
          transaction = "LAMPIRAN / DOKUMEN";
        }
      }

      const jsonPayload =
        extendUrl !== "/authenticate" && !fullUrl.includes("format-cetakan")
          ? JSON.stringify(responseObj.data ? responseObj.data : payload)
          : "{}";

      await adapter.recordAudit({
        namaModul: checkModulByUrl(fullUrl),
        namaProses: process,
        urlApi: fullUrl,
        kandunganJson: jsonPayload,
        preKandunganJson: config.preKandunganJson || "",
        idPengguna: supportUser ? supportUser.idPengguna : user?.username || "",
        namaPengguna: supportUser ? supportUser.namaPengguna : user?.name || "",
        alamatIp: ipAddress,
        jenisTransaksi: transaction
      });
    }
  } catch (error) {
    console.error("setAuditTrails error:", error);
  }
}

/* ------------------------------------------------------------------ */
/* Response shaping                                                    */
/* ------------------------------------------------------------------ */

function removeUrlsUploadAfterSave(data) {
  const urls = [];

  if (data && typeof data === "object") {
    Object.values(data).forEach((value) => {
      if (typeof value === "string" && value.startsWith("http")) {
        urls.push(value);
      }
    });
  }

  if (!urls.length) {
    return;
  }

  const adapter = useHostAdapter();
  if (typeof adapter.removeUploadUrls === "function") {
    adapter.removeUploadUrls(urls);
  }
}

export async function returnResponseList(extendUrl, res) {
  res.list = res.data && res.data.data ? res.data.data : res.data ? res.data : [];
  res.total = res.data && res.data.data ? res.data.totalItems : 0;

  return res;
}

export async function returnResponseDetails(extendUrl, res) {
  return res;
}

export async function returnResponsePut(
  extendUrl,
  res,
  data,
  namaProses = "",
  isAudit = true
) {
  await setAuditTrails("UPDATE", extendUrl, res, data, namaProses, isAudit);
  removeUrlsUploadAfterSave(data);

  return res.data;
}

export async function returnResponsePost(
  extendUrl,
  res,
  data,
  namaProses = "",
  isAudit = true
) {
  await setAuditTrails("INSERT", extendUrl, res, data, namaProses, isAudit);
  removeUrlsUploadAfterSave(data);

  return res.data;
}

export async function returnResponseDelete(
  extendUrl,
  res,
  namaProses = "",
  isAudit = true
) {
  await setAuditTrails("DELETE", extendUrl, res, {}, namaProses, isAudit);

  return res.data;
}
