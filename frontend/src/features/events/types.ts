import type { User } from "../auth/types";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: Pick<User, "id" | "username">;
  registrations_count: number;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface EventListParams {
  search?: string;
  location?: string;
  date_after?: string;
  date_before?: string;
  ordering?: string;
  page?: string;
  organizer?: string;
  registered?: string;
}

export interface EventWritePayload {
  title: string;
  description: string;
  date: string;
  location: string;
}
