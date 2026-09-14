import { z } from "zod";

// `originalDate` lets an already-past event's untouched date pass through on
// edit (editing a past event without changing its date must succeed)
// while still rejecting anyone typing in a new past date.
export function createEventSchema(originalDate?: string) {
  return z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    date: z
      .string()
      .min(1, "Date is required")
      .refine(
        (value) => (originalDate !== undefined && value === originalDate) || new Date(value) > new Date(),
        "Event date must be in the future",
      ),
  });
}

export type EventFormValues = z.infer<ReturnType<typeof createEventSchema>>;
