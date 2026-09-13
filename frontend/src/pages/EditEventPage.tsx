import { useNavigate, useParams } from "react-router-dom";

import { ErrorState } from "../components/ErrorState";
import { EventForm } from "../components/EventForm";
import { LoadingState } from "../components/LoadingState";
import { useEvent, useUpdateEvent } from "../features/events/hooks";
import type { EventFormValues } from "../features/events/schemas";
import { toDatetimeLocalInput, toIsoFromDatetimeLocal } from "../features/events/utils";

export function EditEventPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const updateEvent = useUpdateEvent(id);

  if (isLoading) {
    return <LoadingState label="Loading event..." />;
  }

  if (isError || !event) {
    return <ErrorState message="Could not load this event." onRetry={() => refetch()} />;
  }

  const handleSubmit = (values: EventFormValues) =>
    updateEvent
      .mutateAsync({ ...values, date: toIsoFromDatetimeLocal(values.date) })
      .then(() => navigate(`/events/${event.id}`, { replace: true }));

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold text-gray-900">Edit event</h1>
      <div className="mt-4">
        <EventForm
          submitLabel="Save changes"
          defaultValues={{
            title: event.title,
            description: event.description,
            date: toDatetimeLocalInput(event.date),
            location: event.location,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
