import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, name, leftIcon, rightIcon, className = "", ...props },
  ref,
) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center min-w-0">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          name={name}
          ref={ref}
          className={`w-full min-h-[44px] rounded-xl border bg-white/70 backdrop-blur-xs px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150 focus:bg-white focus:outline-none focus:ring-4 ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-11" : ""} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100/60"
              : "border-slate-200/90 focus:border-blue-500 focus:ring-blue-100/70 shadow-2xs"
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-2.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-0.5 break-words" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
