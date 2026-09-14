import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ErrorState } from "../components/ErrorState";
import { EventForm } from "../components/EventForm";
import { CalendarPlusIcon, CloseIcon, WaveGraphic } from "../components/icons";
import { LoadingState } from "../components/LoadingState";
import { Modal } from "../components/Modal";
import { useEvent, useUpdateEvent } from "../features/events/hooks";
import type { EventFormValues } from "../features/events/schemas";
import { toDatetimeLocalInput, toIsoFromDatetimeLocal } from "../features/events/utils";

export function EditEventPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const updateEvent = useUpdateEvent(id);

  const fallback = location.pathname.startsWith("/my-events")
    ? `/my-events/${id}`
    : `/events/${id}`;

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate({ pathname: fallback, search: location.search });
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <LoadingState type="spinner" label="Loading event..." />
      </Modal>
    );
  }

  if (isError || !event) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <div className="w-full max-w-lg rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 relative modal-content-animate">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-100/80 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <ErrorState message="Could not load this event." onRetry={() => refetch()} />
        </div>
      </Modal>
    );
  }

  const handleSubmit = (values: EventFormValues) =>
    updateEvent
      .mutateAsync({ ...values, date: toIsoFromDatetimeLocal(values.date) })
      .then(() => navigate({ pathname: fallback, search: location.search }, { replace: true }));

  return (
    <Modal isOpen={true} onClose={handleClose} ariaLabelledBy="edit-event-title">
      <div className="relative my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 modal-content-animate">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-100/80 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* Header Block with safe right padding */}
        <div className="relative z-10 mb-6 flex items-center gap-4 pr-12">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20 shadow-2xs">
            <CalendarPlusIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1
              id="edit-event-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words"
            >
              Edit event
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-words">
              Update event details and schedule
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="relative z-10">
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

        {/* Bottom Wave Graphic */}
        <WaveGraphic />
      </div>
    </Modal>
  );
}

