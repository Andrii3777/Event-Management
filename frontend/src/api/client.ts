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

// Any endpoint under /auth/ (login, signup, refresh, me, csrf, logout) must never
// trigger a refresh attempt: 401s from these endpoints are either expected
// (anonymous on /auth/me/) or terminal (bad credentials on /auth/token/).
function skipsRefresh(url: string | undefined) {
  if (!url) return true;
  return url.includes("/auth/");
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
      // Mark session as expired without destroying cached business data or triggering refetch storms
      queryClient.setQueryData(["me"], null);

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.assign("/login");
      }
      throw error;
    }

    return api(config);
  },
);
