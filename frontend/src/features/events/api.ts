import { api } from "../../api/client";
import type { Event, EventListParams, EventWritePayload, PaginatedResponse } from "./types";

// Drop empty/undefined params instead of sending them as empty query strings.
function cleanParams(params: EventListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}

export function fetchEvents(params: EventListParams) {
  return api
    .get<PaginatedResponse<Event>>("/events/", { params: cleanParams(params) })
    .then((res) => res.data);
}

export function fetchEvent(id: number | string) {
  return api.get<Event>(`/events/${id}/`).then((res) => res.data);
}

export function createEvent(payload: EventWritePayload) {
  return api.post<Event>("/events/", payload).then((res) => res.data);
}

export function updateEvent(id: number | string, payload: EventWritePayload) {
  return api.patch<Event>(`/events/${id}/`, payload).then((res) => res.data);
}

export function deleteEvent(id: number | string) {
  return api.delete(`/events/${id}/`).then(() => undefined);
}

export function registerForEvent(id: number | string) {
  return api.post(`/events/${id}/register/`).then(() => undefined);
}

export function cancelRegistration(id: number | string) {
  return api.delete(`/events/${id}/register/`).then(() => undefined);
}
