import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { createEventSchema, type EventFormValues } from "../features/events/schemas";
import { applyServerFieldErrors } from "../features/shared/formErrors";
import { Button } from "./Button";
import { CalendarIcon, MapPinIcon, SparklesIcon } from "./icons";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

const FIELDS = ["title", "description", "date", "location"] as const;

interface EventFormProps {
  defaultValues?: EventFormValues;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<unknown>;
}

export function EventForm({ defaultValues, submitLabel, onSubmit }: EventFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const schema = useMemo(() => createEventSchema(defaultValues?.date), [defaultValues?.date]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({ resolver: zodResolver(schema), defaultValues });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      const handled = applyServerFieldErrors(error, setError, FIELDS);
      if (!handled) {
        setFormError("Something went wrong. Please try again.");
      }
    }
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Title"
        placeholder="Event title"
        rightIcon={<SparklesIcon className="h-4 w-4 text-blue-400/80" />}
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        placeholder="Event description"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <Input
        label="Date and time"
        type="datetime-local"
        leftIcon={<CalendarIcon className="h-4 w-4" />}
        error={errors.date?.message}
        {...register("date")}
      />

      <Input
        label="Location"
        placeholder="City"
        leftIcon={<MapPinIcon className="h-4 w-4" />}
        error={errors.location?.message}
        {...register("location")}
      />

      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600" role="alert">
          {formError}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full mt-2"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

