import { QueryClient } from "@tanstack/react-query";

// Server state lives only here (R122) — no Redux/Zustand/Context duplicate.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Auth-sensitive queries (useMe) shouldn't retry through the 401/refresh
      // dance more than the interceptor itself already does.
      retry: false,
    },
  },
});
