import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LoadingState } from "../components/LoadingState";
import { useMe } from "../features/auth/hooks";

// Wraps protected routes: anonymous visitors are sent to /login and, after
// logging in, back to the page they came from (R126).
export function RequireAuth() {
  const location = useLocation();
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
