import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useLogin } from "../features/auth/hooks";
import { loginSchema, type LoginFormValues } from "../features/auth/schemas";
import { applyServerFieldErrors } from "../features/shared/formErrors";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/events";

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
      onError: (error) => {
        const handled = applyServerFieldErrors(error, setError, ["email", "password"] as const);
        if (!handled) {
          // DRF replies 401 with the same message regardless of which part
          // of the credentials was wrong (R13.1) — surface it on the form.
          setError("password", { message: "Incorrect email or password." });
        }
      },
    });
  });

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-semibold text-gray-900">Log in</h1>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4" noValidate>
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        No account?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
          Register
        </Link>
      </p>
    </div>
  );
}
