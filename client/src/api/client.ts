const BASE_URL = "http://localhost:3001/api";

async function apiRequest<T>(endpoint: string, options: any = {}): Promise<T> {
  const { body, ...customConfig } = options;

  // Достаем токен
  const token = localStorage.getItem("token");

  const headers: any = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: { ...headers, ...customConfig.headers },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Если токен протух — выкидываем на логин
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: "GET" }),
  post: <T>(url: string, body: any) =>
    apiRequest<T>(url, { method: "POST", body }),
  patch: <T>(url: string, body: any) =>
    apiRequest<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string) => apiRequest<T>(url, { method: "DELETE" }),
};
