import type { ReactNode } from "react";
import { CalendarIcon } from "./icons";

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[150px] sm:min-h-[170px] max-w-sm mx-auto flex-col items-center justify-center gap-2.5 rounded-2xl border border-white/80 bg-white/70 p-5 text-center shadow-xs backdrop-blur-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 shadow-2xs">
        <CalendarIcon className="h-5.5 w-5.5" />
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-slate-800">No events found</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

