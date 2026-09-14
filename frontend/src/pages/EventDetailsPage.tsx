import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ErrorState } from "../components/ErrorState";
import {
  CalendarIcon,
  CloseIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  WaveGraphic,
} from "../components/icons";
import { LoadingState } from "../components/LoadingState";
import { Modal } from "../components/Modal";
import { RegistrationButton } from "../components/RegistrationButton";
import { useMe } from "../features/auth/hooks";
import { useDeleteEvent, useEvent } from "../features/events/hooks";

export function EventDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const { data: user } = useMe();
  const deleteEvent = useDeleteEvent();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fallback = location.pathname.startsWith("/my-events") ? "/my-events" : "/events";
  const basePath = fallback;

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
        <LoadingState type="spinner" label="Loading event details..." />
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

  const isOrganizer = user?.id === event.organizer.id;
  const count = event.participants_count ?? event.registrations_count ?? 0;

  const dateObj = new Date(event.date);
  const isValidDate = !isNaN(dateObj.getTime());
  const month = isValidDate
    ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase()
    : "EVT";
  const day = isValidDate ? String(dateObj.getDate()).padStart(2, "0") : "--";
  const year = isValidDate ? dateObj.getFullYear() : "";
  const formattedDateTime = isValidDate ? dateObj.toLocaleString() : event.date;

  return (
    <Modal isOpen={true} onClose={handleClose} ariaLabelledBy="event-details-title">
      <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 modal-content-animate">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-100/80 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          aria-label="Close modal"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {/* Header Block */}
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start min-w-0 pr-12 sm:pr-0">
          {/* Date Badge */}
          <div className="flex min-w-[78px] sm:min-w-[85px] shrink-0 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/90 p-3 sm:p-4 text-center text-blue-600 shadow-2xs">
            <span className="text-xs font-extrabold tracking-wider">{month}</span>
            <span className="my-0.5 text-2xl sm:text-3xl font-black leading-none">{day}</span>
            <span className="text-[11px] font-semibold opacity-75">{year}</span>
          </div>

          {/* Title and Quick Info */}
          <div className="min-w-0 flex-1">
            <h1
              id="event-details-title"
              className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 break-words"
            >
              {event.title}
            </h1>

            <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-start gap-2 min-w-0">
                <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                <span className="font-medium text-slate-700 break-words">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{formattedDateTime}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">
                  Organized by{" "}
                  <strong className="font-semibold text-slate-700">
                    {event.organizer.username}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="flex flex-col items-start gap-2.5 sm:items-end shrink-0 pt-1 sm:pt-9 sm:pr-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <UsersIcon className="h-4 w-4 text-slate-400" />
              <span>{count} people joined</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <RegistrationButton event={event} user={user} size="md" className="w-full sm:w-auto" />

              {isOrganizer && (
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <Link
                    to={{ pathname: `${basePath}/${event.id}/edit`, search: location.search }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto min-h-[38px]">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 sm:flex-initial min-h-[38px]"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="relative z-10 mt-6 border-t border-slate-100 pt-5 min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
            {event.description || "No description provided for this event."}
          </p>
        </div>

        {/* Quick Facts 3-Column Panel */}
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-blue-100/70 bg-blue-50/50 p-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
              <MapPinIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-medium text-slate-400 block">Location</span>
              <span className="text-xs font-semibold text-slate-800 break-words block" title={event.location}>
                {event.location}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-medium text-slate-400 block">Date and time</span>
              <span className="text-xs font-semibold text-slate-800 break-words block" title={formattedDateTime}>
                {formattedDateTime}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-medium text-slate-400 block">Organizer</span>
              <span className="text-xs font-semibold text-slate-800 truncate block" title={event.organizer.username}>
                {event.organizer.username}
              </span>
            </div>
          </div>
        </div>

        {/* Organic Wave Graphic at Bottom */}
        <WaveGraphic />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete event"
        message="This will permanently delete the event and cancel all registrations. This action cannot be undone."
        confirmLabel="Delete event"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteEvent.mutate(event.id, {
            onSuccess: () =>
              navigate({ pathname: fallback, search: location.search }, { replace: true }),
          });
        }}
      />
    </Modal>
  );
}

