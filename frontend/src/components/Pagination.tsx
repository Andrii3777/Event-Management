import { Button } from "./Button";

interface PaginationProps {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, hasPrevious, hasNext, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="secondary" disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-gray-600">Page {page}</span>
      <Button variant="secondary" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
