import { z } from "zod";

const emailSchema = z.string().min(1, "Email is required").email("Enter a valid email");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  email: emailSchema,
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const registerSchema = signUpSchema;
export type RegisterFormValues = SignUpFormValues;
