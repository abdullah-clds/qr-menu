let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET" && csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const res = await fetch(`/api/${path}`, {
    method,
    credentials: "include",
    headers,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok || !payload?.success) {
    const error = new Error(payload?.error || "İstek başarısız oldu.");
    error.status = res.status;
    error.fields = payload?.fields ?? null;
    throw error;
  }

  return payload.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
  upload: (path, formData) => request(path, { method: "POST", body: formData, isForm: true }),
};
