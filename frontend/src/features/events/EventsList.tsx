import type { ReactNode } from "react";

import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { EventCard } from "../../components/EventCard";
import { LoadingState } from "../../components/LoadingState";
import { Pagination } from "../../components/Pagination";
import { useEvents } from "./hooks";
import type { Event, EventListParams } from "./types";

interface EventsListProps {
  params: EventListParams;
  page: number;
  onPageChange: (page: number) => void;
  emptyMessage: string;
  onResetFilters?: () => void;
  renderCardAction?: (event: Event) => ReactNode;
}

const PAGE_SIZE = 12;

export function EventsList({
  params,
  page,
  onPageChange,
  emptyMessage,
  onResetFilters,
  renderCardAction,
}: EventsListProps) {
  const { data, isLoading, isError, refetch } = useEvents({
    page_size: String(PAGE_SIZE),
    ...params,
    page: String(page),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <LoadingState count={12} />
        <div className="mt-auto pt-1 sm:pt-1.5 shrink-0 invisible pointer-events-none">
          <Pagination
            page={1}
            totalPages={1}
            hasPrevious={false}
            hasNext={false}
            onPageChange={() => {}}
          />
        </div>
      </div>
    );
  }

  if (isError || !data || !Array.isArray(data?.results)) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-0">
        <ErrorState message="Could not load events." onRetry={() => refetch()} />
      </div>
    );
  }

  if (data.results.length === 0) {
    const resetAction: ReactNode = onResetFilters ? (
      <Button variant="secondary" size="sm" onClick={onResetFilters}>
        Reset filters
      </Button>
    ) : undefined;
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-0">
        <EmptyState message={emptyMessage} action={resetAction} />
      </div>
    );
  }

  const totalPages = Math.ceil((data.count || 0) / PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0">
      <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {data.results.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action={renderCardAction ? renderCardAction(event) : undefined}
          />
        ))}
      </div>
      <div className="mt-auto pt-1 sm:pt-1.5 shrink-0">
        <Pagination
          page={page}
          totalPages={totalPages}
          hasPrevious={!!data.previous}
          hasNext={!!data.next}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

