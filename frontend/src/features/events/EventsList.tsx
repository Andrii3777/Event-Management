import type { ReactNode } from "react";

import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { EventCard } from "../../components/EventCard";
import { LoadingState } from "../../components/LoadingState";
import { Pagination } from "../../components/Pagination";
import { useEvents } from "./hooks";
import type { EventListParams } from "./types";

interface EventsListProps {
  params: EventListParams;
  page: number;
  onPageChange: (page: number) => void;
  emptyMessage: string;
  onResetFilters?: () => void;
}

// The single place list rendering (loading/error/empty/grid/pagination) lives
// — EventsPage and MyEventsPage both render this with a different `params`,
// rather than duplicating the list (history 61/§8).
export function EventsList({ params, page, onPageChange, emptyMessage, onResetFilters }: EventsListProps) {
  const { data, isLoading, isError, refetch } = useEvents({ ...params, page: String(page) });

  if (isLoading) {
    return <LoadingState label="Loading events..." />;
  }

  if (isError) {
    return <ErrorState message="Could not load events." onRetry={() => refetch()} />;
  }

  if (!data || data.results.length === 0) {
    const resetAction: ReactNode = onResetFilters ? (
      <Button variant="secondary" onClick={onResetFilters}>
        Reset filters
      </Button>
    ) : undefined;
    return <EmptyState message={emptyMessage} action={resetAction} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.results.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <Pagination page={page} hasPrevious={!!data.previous} hasNext={!!data.next} onPageChange={onPageChange} />
    </div>
  );
}
