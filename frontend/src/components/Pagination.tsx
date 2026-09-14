import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface PaginationProps {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export function Pagination({
  page,
  hasPrevious,
  hasNext,
  onPageChange,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center pt-1 sm:pt-1.5">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-2.5 py-1 shadow-xs backdrop-blur-md">
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <span className="px-2 text-xs font-semibold text-slate-600">
          Page {page} {totalPages ? `of ${totalPages}` : ""}
        </span>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80 disabled:pointer-events-none disabled:opacity-40"
        >
          <span>Next</span>
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

