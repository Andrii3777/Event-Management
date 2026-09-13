import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { createEventSchema, type EventFormValues } from "../features/events/schemas";
import { applyServerFieldErrors } from "../features/shared/formErrors";
import { Button } from "./Button";
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
      <Input label="Title" error={errors.title?.message} {...register("title")} />
      <Textarea label="Description" rows={4} error={errors.description?.message} {...register("description")} />
      <Input
        label="Date and time"
        type="datetime-local"
        error={errors.date?.message}
        {...register("date")}
      />
      <Input label="Location" error={errors.location?.message} {...register("location")} />
      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
