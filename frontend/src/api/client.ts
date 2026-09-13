import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { queryClient } from "./queryClient";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Call once on app start so the csrftoken cookie exists before the first
// unsafe (POST/PATCH/DELETE) request.
export function primeCsrf() {
  return api.get("/auth/csrf/");
}

function isUrl(url: string | undefined, suffix: string) {
  return !!url && url.includes(suffix);
}

// Requests whose own 401 is a normal, expected response — not a sign the
// session died mid-use — and must never trigger a refresh attempt: login
// and register report bad credentials/validation via their own 401/400,
// and refresh must never try to refresh itself.
function skipsRefresh(url: string | undefined) {
  return isUrl(url, "/auth/token/refresh/") || isUrl(url, "/auth/token/") || isUrl(url, "/auth/register/");
}

// Single-flight refresh: concurrent 401s share one in-flight request instead
// of each firing their own refresh.
let refreshPromise: Promise<unknown> | null = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api.post("/auth/token/refresh/").finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (!config || status !== 401 || skipsRefresh(config.url) || config._retried) {
      throw error;
    }
    config._retried = true;

    try {
      await refreshSession();
    } catch {
      queryClient.clear();
      // A 401 on /auth/me/ just means "not logged in" (anonymous is a valid
      // state on public pages) — only a mid-session failure elsewhere should
      // force a hard redirect.
      if (!isUrl(config.url, "/auth/me/")) {
        window.location.assign("/login");
      }
      throw error;
    }

    return api(config);
  },
);
