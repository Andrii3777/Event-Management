interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-sm text-gray-500">
      {label}
    </div>
  );
}
