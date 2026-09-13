import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMe, login, logout, registerUser } from "./api";
import type { LoginRequest, RegisterRequest } from "./types";

export const meQueryKey = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(meQueryKey, data.user);
    },
  });
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerUser(payload),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
