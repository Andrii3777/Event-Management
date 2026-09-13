import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelRegistration,
  createEvent,
  deleteEvent,
  fetchEvent,
  fetchEvents,
  registerForEvent,
  updateEvent,
} from "./api";
import type { EventListParams, EventWritePayload } from "./types";

const eventsQueryKey = (params: EventListParams) => ["events", params] as const;
const eventQueryKey = (id: number | string) => ["events", "detail", id] as const;

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: eventsQueryKey(params),
    queryFn: () => fetchEvents(params),
    placeholderData: keepPreviousData,
  });
}

export function useEvent(id: number | string) {
  return useQuery({
    queryKey: eventQueryKey(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });
}

// Every mutation below changes either the list (registrations_count,
// is_registered) or a single event — invalidating the "events" prefix covers
// both list and detail queries at once (R122).
function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["events"] });
}

export function useCreateEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (payload: EventWritePayload) => createEvent(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateEvent(id: number | string) {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (payload: EventWritePayload) => updateEvent(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number | string) => deleteEvent(id),
    onSuccess: invalidate,
  });
}

export function useRegister() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number | string) => registerForEvent(id),
    onSuccess: invalidate,
  });
}

export function useCancelRegistration() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number | string) => cancelRegistration(id),
    onSuccess: invalidate,
  });
}
