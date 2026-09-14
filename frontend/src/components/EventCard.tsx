import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import type { Event } from "../features/events/types";
import { ChevronRightIcon, MapPinIcon, UsersIcon } from "./icons";

interface EventCardProps {
  event: Event;
  action?: ReactNode;
}

export function EventCard({ event, action }: EventCardProps) {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/my-events") ? "/my-events" : "/events";
  const count = event.participants_count ?? event.registrations_count ?? 0;

  const dateObj = new Date(event.date);
  const isValidDate = !isNaN(dateObj.getTime());
  const month = isValidDate
    ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase()
    : "EVT";
  const day = isValidDate ? String(dateObj.getDate()).padStart(2, "0") : "--";
  const year = isValidDate ? dateObj.getFullYear() : "";

  const eventTarget = {
    pathname: `${basePath}/${event.id}`,
    search: location.search,
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/80 bg-white/75 p-2.5 sm:p-3 shadow-xs backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/95 hover:border-blue-200/60 hover:shadow-md hover:shadow-slate-900/5 min-w-0">
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        {/* Date badge - compact, elegant anchor */}
        <div className="flex min-w-[50px] sm:min-w-[54px] shrink-0 flex-col items-center justify-center rounded-xl border border-blue-100/80 bg-blue-50/85 px-2 py-1.5 text-center text-blue-600 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50">
          <span className="text-[10px] font-extrabold tracking-wider">{month}</span>
          <span className="my-0.5 text-lg sm:text-xl font-black leading-none">{day}</span>
          <span className="text-[9px] font-semibold opacity-75">{year}</span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Link
            to={eventTarget}
            className="block text-xs sm:text-sm font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-1 break-words"
            title={event.title}
          >
            {event.title}
          </Link>

          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 min-w-0">
            <MapPinIcon className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{event.location || "Location TBA"}</span>
          </div>

          <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1 leading-snug break-words">
            {event.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Footer / Meta */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100/80 pt-1.5 gap-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 shrink-0">
          <UsersIcon className="h-3 w-3 text-slate-400" />
          <span>{count} joined</span>
        </div>

        {action ? (
          <div className="shrink-0">{action}</div>
        ) : (
          <Link
            to={eventTarget}
            className="flex h-6.5 w-6.5 min-h-[26px] min-w-[26px] shrink-0 items-center justify-center rounded-full bg-blue-50/80 text-blue-600 transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:translate-x-0.5 hover:!bg-blue-600 hover:!text-white"
            aria-label={`View details for ${event.title}`}
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

