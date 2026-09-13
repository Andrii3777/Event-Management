import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { useMe } from "../features/auth/hooks";
import { useCancelRegistration, useDeleteEvent, useEvent, useRegister } from "../features/events/hooks";

export function EventDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const { data: user } = useMe();
  const register = useRegister();
  const cancel = useCancelRegistration();
  const deleteEvent = useDeleteEvent();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return <LoadingState label="Loading event..." />;
  }

  if (isError || !event) {
    return <ErrorState message="Could not load this event." onRetry={() => refetch()} />;
  }

  const isOrganizer = user?.id === event.organizer.id;
  const isPast = new Date(event.date) <= new Date();
  const registrationPending = register.isPending || cancel.isPending;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
      <p className="mt-1 text-sm text-gray-600">
        {new Date(event.date).toLocaleString()} · {event.location}
      </p>
      <p className="mt-1 text-sm text-gray-500">Organized by {event.organizer.username}</p>
      <p className="mt-4 whitespace-pre-wrap text-gray-800">{event.description}</p>
      <p className="mt-4 text-sm text-gray-600">{event.registrations_count} people registered</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {user ? (
          !isOrganizer &&
          !isPast && (
            <Button
              variant={event.is_registered ? "secondary" : "primary"}
              disabled={registrationPending}
              onClick={() => (event.is_registered ? cancel.mutate(event.id) : register.mutate(event.id))}
            >
              {event.is_registered ? "Cancel registration" : "Register"}
            </Button>
          )
        ) : (
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Log in to register
          </Link>
        )}
        {isOrganizer && (
          <>
            <Link to={`/events/${event.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete event"
        message="This will permanently delete the event and all its registrations. This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteEvent.mutate(event.id, {
            onSuccess: () => navigate("/events", { replace: true }),
          });
        }}
      />
    </div>
  );
}
