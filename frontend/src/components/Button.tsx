import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm shadow-blue-500/25 border border-blue-500/30 disabled:from-blue-300 disabled:to-blue-300 disabled:border-transparent disabled:shadow-none",
  secondary:
    "bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm backdrop-blur-sm disabled:bg-slate-100/60 disabled:text-slate-400",
  danger:
    "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 shadow-sm disabled:bg-rose-50/40 disabled:text-rose-300",
  ghost:
    "bg-transparent hover:bg-blue-50/70 text-blue-600 hover:text-blue-700 disabled:text-slate-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
});
