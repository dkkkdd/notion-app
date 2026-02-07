const BASE_URL = import.meta.env.VITE_API_URL;

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, ...customConfig } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...customConfig,
    headers: { ...headers, ...customConfig.headers },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...config,
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: "GET" }),
  post: <T>(url: string, body: unknown) =>
    apiRequest<T>(url, { method: "POST", body }),
  patch: <T>(url: string, body: unknown) =>
    apiRequest<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string) => apiRequest<T>(url, { method: "DELETE" }),
};
