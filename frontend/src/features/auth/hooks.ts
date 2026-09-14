import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMe, login, logout, signUpUser } from "./api";
import type { LoginRequest, SignUpRequest } from "./types";

export const meQueryKey = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(meQueryKey, data.user);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useSignUpUser() {
  return useMutation({
    mutationFn: (payload: SignUpRequest) => signUpUser(payload),
  });
}

export const useRegisterUser = useSignUpUser;

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey, null);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
