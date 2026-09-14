import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createEvent,
  deleteEvent,
  fetchEvent,
  fetchEvents,
  joinEvent,
  leaveEvent,
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

// Every mutation below changes either the list (participants_count,
// is_joined) or a single event — invalidating the "events" prefix covers
// both list and detail queries at once.
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

export function useJoinEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number | string) => joinEvent(id),
    onSuccess: invalidate,
  });
}

export function useLeaveEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number | string) => leaveEvent(id),
    onSuccess: invalidate,
  });
}

export const useRegister = useJoinEvent;
export const useCancelRegistration = useLeaveEvent;
