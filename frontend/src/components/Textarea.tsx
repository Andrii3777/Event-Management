import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, name, className = "", ...props },
  ref,
) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        id={inputId}
        name={name}
        ref={ref}
        className={`w-full rounded-xl border bg-white/70 backdrop-blur-xs p-3.5 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-150 focus:bg-white focus:outline-none focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100/60"
            : "border-slate-200/90 focus:border-blue-500 focus:ring-blue-100/70 shadow-2xs"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 mt-0.5 break-words" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
