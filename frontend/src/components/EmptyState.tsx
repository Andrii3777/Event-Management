import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 text-sm text-gray-500">
      <p>{message}</p>
      {action}
    </div>
  );
}
