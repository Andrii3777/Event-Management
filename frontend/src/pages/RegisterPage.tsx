import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useRegisterUser } from "../features/auth/hooks";
import { registerSchema, type RegisterFormValues } from "../features/auth/schemas";

const FIELDS = ["email", "username", "password"] as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegisterUser();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((values) => {
    registerUser.mutate(values, {
      onSuccess: () => navigate("/login", { replace: true }),
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data as Record<string, string[] | undefined>;
          for (const field of FIELDS) {
            const message = data[field]?.[0];
            if (message) {
              setError(field, { message });
            }
          }
        }
      },
    });
  });

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-semibold text-gray-900">Register</h1>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4" noValidate>
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="Username" error={errors.username?.message} {...register("username")} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
          Log in
        </Link>
      </p>
    </div>
  );
}
