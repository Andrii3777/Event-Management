import { api } from "../../api/client";
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse, User } from "./types";

export function login(payload: LoginRequest) {
  return api.post<LoginResponse>("/auth/token/", payload).then((res) => res.data);
}

export function signUpUser(payload: SignUpRequest) {
  return api.post<SignUpResponse>("/auth/signup/", payload).then((res) => res.data);
}

export const registerUser = signUpUser;

export function logout() {
  return api.post("/auth/logout/").then(() => undefined);
}

export function fetchMe() {
  return api.get<User>("/auth/me/").then((res) => res.data);
}
