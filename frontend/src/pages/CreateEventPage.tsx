import { useNavigate } from "react-router-dom";

import { EventForm } from "../components/EventForm";
import { useCreateEvent } from "../features/events/hooks";
import type { EventFormValues } from "../features/events/schemas";
import { toIsoFromDatetimeLocal } from "../features/events/utils";

export function CreateEventPage() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();

  const handleSubmit = (values: EventFormValues) =>
    createEvent
      .mutateAsync({ ...values, date: toIsoFromDatetimeLocal(values.date) })
      .then((event) => navigate(`/events/${event.id}`, { replace: true }));

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold text-gray-900">Create event</h1>
      <div className="mt-4">
        <EventForm submitLabel="Create event" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
