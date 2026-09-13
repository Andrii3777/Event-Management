import { Link } from "react-router-dom";

import type { User } from "../features/auth/types";
import { useCancelRegistration, useRegister } from "../features/events/hooks";
import type { Event } from "../features/events/types";
import { Button } from "./Button";

interface RegistrationButtonProps {
  event: Event;
  user: User | undefined;
}

// Shared by EventCard and EventDetailsPage so the register/cancel rules
// (hidden once the event is past, available to any authenticated user
// including the organizer) stay in one place instead of drifting between
// the list and the detail view.
export function RegistrationButton({ event, user }: RegistrationButtonProps) {
  const register = useRegister();
  const cancel = useCancelRegistration();
  const isPast = new Date(event.date) <= new Date();
  const pending = register.isPending || cancel.isPending;

  if (!user) {
    return (
      <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        Log in to register
      </Link>
    );
  }

  if (isPast) {
    return null;
  }

  return (
    <Button
      variant={event.is_registered ? "secondary" : "primary"}
      disabled={pending}
      onClick={() => (event.is_registered ? cancel.mutate(event.id) : register.mutate(event.id))}
    >
      {event.is_registered ? "Cancel registration" : "Register"}
    </Button>
  );
}
