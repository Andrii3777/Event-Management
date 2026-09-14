# 0008. Computed Event Fields via Queryset Annotations

## Context

Each event presentation requires dynamic metadata: the total participant count (`participants_count`) and whether the requesting user has registered for the event (`is_joined`).

## Decision

Both fields are annotated directly onto the `Event` QuerySet using Django ORM aggregation expressions (`Count("registrations")` and `Exists(EventRegistration.objects.filter(...))`), and mapped in `EventSerializer` via `IntegerField` and `BooleanField`.

## Rationale

- Using `SerializerMethodField` was rejected because it causes severe N+1 query performance degradation (executing two database queries per event item on every page).
- Calculating these fields in memory by loading all registration rows was rejected to keep memory usage minimal.
- Database-level annotations execute in the single primary SELECT query, maintaining optimal performance regardless of page size.

## Consequences

- Endpoints returning event representations must ensure the queryset includes the required annotations. For freshly created events before database refetch, serializer context or instance attributes supply the initial default values (0 and False).
- Testing confirms that event list endpoints run with a constant query count regardless of the number of events returned.
