import { Link } from "react-router-dom";

import type { User } from "../features/auth/types";
import { useJoinEvent, useLeaveEvent } from "../features/events/hooks";
import type { Event } from "../features/events/types";
import { Button } from "./Button";
import { LogOutIcon } from "./icons";

interface RegistrationButtonProps {
  event: Event;
  user: User | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RegistrationButton({
  event,
  user,
  size = "md",
  className = "",
}: RegistrationButtonProps) {
  const join = useJoinEvent();
  const leave = useLeaveEvent();
  const isPast = new Date(event.date) <= new Date();
  const pending = join.isPending || leave.isPending;
  const isJoined = event.is_joined ?? event.is_registered;

  if (!user) {
    return (
      <Link to="/login" className={className}>
        <Button variant="primary" size={size}>
          Log in to join
        </Button>
      </Link>
    );
  }

  if (isPast) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-slate-400">
        Past event
      </span>
    );
  }

  return (
    <Button
      variant={isJoined ? "secondary" : "primary"}
      size={size}
      disabled={pending}
      onClick={() => (isJoined ? leave.mutate(event.id) : join.mutate(event.id))}
      className={className}
    >
      {isJoined ? (
        <span className="inline-flex items-center gap-1.5">
          <LogOutIcon className="h-3.5 w-3.5" />
          <span>Leave event</span>
        </span>
      ) : (
        "Join event"
      )}
    </Button>
  );
}

export const JoinButton = RegistrationButton;

