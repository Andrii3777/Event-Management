import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import {
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  WaveGraphic,
} from "../components/icons";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { useSignUpUser } from "../features/auth/hooks";
import { signUpSchema, type SignUpFormValues } from "../features/auth/schemas";
import { applyServerFieldErrors } from "../features/shared/formErrors";

const FIELDS = ["email", "username", "password"] as const;

export function SignUpPage() {
  const navigate = useNavigate();
  const signUpUser = useSignUpUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });

  const handleClose = () => {
    navigate("/events");
  };

  const onSubmit = handleSubmit((values) => {
    signUpUser.mutate(values, {
      onSuccess: () => navigate("/login", { replace: true }),
      onError: (error) => {
        applyServerFieldErrors(error, setError, FIELDS);
      },
    });
  });

  return (
    <Modal isOpen={true} onClose={handleClose} ariaLabelledBy="signup-title">
      <div className="relative my-8 w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl modal-content-animate">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-100/80 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* Ambient Top Icon with Floating Orbs */}
        <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center">
          <div className="absolute -left-2 -top-1 h-5 w-5 rounded-full bg-blue-200/50 blur-xs" />
          <div className="absolute -right-1 bottom-1 h-6 w-6 rounded-full bg-sky-200/60 blur-xs" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50/90 text-blue-600 ring-1 ring-blue-500/20 shadow-2xs backdrop-blur-xs">
            <UserIcon className="h-7 w-7" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="relative z-10 text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign Up
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Join our community and start exploring great events!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<MailIcon className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Username"
            placeholder="Choose a username"
            leftIcon={<UserIcon className="h-4 w-4" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            leftIcon={<LockIcon className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 transition-colors focus:outline-none p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2 min-h-[44px]"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="relative z-10 mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Log in
          </Link>
        </p>

        {/* Bottom Wave Graphic */}
        <WaveGraphic />
      </div>
    </Modal>
  );
}

export const RegisterPage = SignUpPage;

