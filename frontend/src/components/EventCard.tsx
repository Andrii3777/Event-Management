import { Link } from "react-router-dom";

import { useMe } from "../features/auth/hooks";
import type { Event } from "../features/events/types";
import { RegistrationButton } from "./RegistrationButton";

interface EventCardProps {
  event: Event;
}

// Shows registrations_count/is_registered straight from the event payload —
// no per-card request (R95/history 36). Register/cancel are mutations, not
// fetches, so this holds even with the button wired up.
export function EventCard({ event }: EventCardProps) {
  const { data: user } = useMe();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <Link to={`/events/${event.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-700">
          {event.title}
        </Link>
        <p className="mt-1 text-sm text-gray-600">
          {new Date(event.date).toLocaleString()} · {event.location}
        </p>
      </div>
      <p className="line-clamp-3 text-sm text-gray-600">{event.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-sm text-gray-500">{event.registrations_count} registered</span>
        <RegistrationButton event={event} user={user} />
      </div>
    </div>
  );
}
