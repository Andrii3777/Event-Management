import { useLocation, useNavigate } from "react-router-dom";

import { EventForm } from "../components/EventForm";
import { CalendarPlusIcon, CloseIcon, WaveGraphic } from "../components/icons";
import { Modal } from "../components/Modal";
import { useCreateEvent } from "../features/events/hooks";
import type { EventFormValues } from "../features/events/schemas";
import { toIsoFromDatetimeLocal } from "../features/events/utils";

export function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const createEvent = useCreateEvent();

  const fallback = location.pathname.startsWith("/my-events") ? "/my-events" : "/events";

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  const handleSubmit = (values: EventFormValues) =>
    createEvent
      .mutateAsync({ ...values, date: toIsoFromDatetimeLocal(values.date) })
      .then((event) => navigate(`/events/${event.id}`, { replace: true }));

  return (
    <Modal isOpen={true} onClose={handleClose} ariaLabelledBy="create-event-title">
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

        {/* Header Block with safe right padding so text never touches close button */}
        <div className="relative z-10 mb-6 flex items-center gap-4 pr-12">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20 shadow-2xs">
            <CalendarPlusIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1
              id="create-event-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words"
            >
              Create event
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-words">
              Share your event with the community
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="relative z-10">
          <EventForm submitLabel="Create event" onSubmit={handleSubmit} />
        </div>

        {/* Bottom Wave Graphic */}
        <WaveGraphic />
      </div>
    </Modal>
  );
}

