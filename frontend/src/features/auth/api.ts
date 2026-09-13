import { api } from "../../api/client";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "./types";

export function login(payload: LoginRequest) {
  return api.post<LoginResponse>("/auth/token/", payload).then((res) => res.data);
}

export function registerUser(payload: RegisterRequest) {
  return api.post<RegisterResponse>("/auth/register/", payload).then((res) => res.data);
}

export function logout() {
  return api.post("/auth/logout/").then(() => undefined);
}

export function fetchMe() {
  return api.get<User>("/auth/me/").then((res) => res.data);
}
