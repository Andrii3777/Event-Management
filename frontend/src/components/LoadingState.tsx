interface LoadingStateProps {
  label?: string;
  type?: "cards" | "spinner" | "detail";
  count?: number;
}

export function LoadingState({
  label = "Loading...",
  type = "cards",
  count = 9,
}: LoadingStateProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/60 p-2.5 sm:p-3 shadow-xs backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              {/* Skeleton date badge */}
              <div className="h-12 w-14 shrink-0 rounded-xl bg-blue-100/60 animate-shimmer" />

              {/* Skeleton lines */}
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="h-3.5 w-3/4 rounded-md bg-slate-200/80 animate-shimmer" />
                <div className="h-2.5 w-1/2 rounded-md bg-slate-200/60 animate-shimmer" />
                <div className="h-2.5 w-5/6 rounded-md bg-slate-200/50 animate-shimmer" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100/70 pt-2">
              <div className="h-2.5 w-14 rounded-md bg-slate-200/60 animate-shimmer" />
              <div className="h-6 w-6 rounded-full bg-slate-200/60 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/50 p-8 backdrop-blur-md">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}

