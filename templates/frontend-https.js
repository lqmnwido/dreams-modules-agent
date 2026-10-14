import { useHostAdapter } from "@2enapps/ui";

// Module https.js follows the bundled services/training/http.js structure.
// Request helpers -> client factory -> response wrappers.
// Training-specific providers, IP lookup and audit side effects are not module defaults.
// Caller supplies approved baseURL and explicit routing/authId policies.
// Credentials are obtained from the Shell host adapter per request.
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
    usePublicPrefix = false,
    appendAuthId = false,
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
export function createModuleClient({
  baseURL,
  getExtraQueryParams,
  usePublicPrefix = false,
  appendAuthId = false,
  alwaysIncludeAuthId = false,
  onlyAppendAuthIdWhenHeaderExists = false
}) {
  async function request(url, options = {}) {
    if (!baseURL) {
      throw new Error("Module API baseURL requires a confirmed environment configuration.");
    }
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


// Training-compatible response helpers: retain the original response envelope.
export async function returnResponseList(extendUrl, response) {
  response.list = response.data && response.data.data
    ? response.data.data
    : response.data || [];
  response.total = response.data && response.data.data
    ? response.data.totalItems
    : 0;

  return response;
}

export async function returnResponseDetails(extendUrl, response) {
  return response;
}
