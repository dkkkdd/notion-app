// const BASE_URL = "http://localhost:3001/api";
const BASE_URL = "http://192.168.0.105:5173/api";

async function apiRequest<T>(endpoint: string, options: any = {}): Promise<T> {
  const { body, ...customConfig } = options;

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
    localStorage.removeItem("token");
    throw new Error("Incorrect password or email");
  }
  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
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
