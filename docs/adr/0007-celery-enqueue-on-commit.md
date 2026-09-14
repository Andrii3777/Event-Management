# 0007. Enqueue Celery Tasks Strictly via transaction.on_commit

## Context

Event registration creates a database record within an atomic database transaction (ADR-0006). An asynchronous confirmation email must be enqueued via Celery and Redis upon successful registration. However, Celery workers operate in a separate process and cannot observe uncommitted database state.

## Decision

The Celery email notification task (`send_join_confirmation_email.delay(user_id, event_id)`) is enqueued exclusively inside a `transaction.on_commit` callback within the registration service.

## Rationale

- Calling `.delay()` immediately after `registration.save()` within an active transaction exposes the system to race conditions: the worker may attempt to fetch the user or event from the database before the transaction has committed.
- Furthermore, if the transaction later rolls back (due to a database constraint violation or unexpected error), calling `.delay()` directly would cause notification emails to be sent for registrations that never occurred.
- `transaction.on_commit` guarantees the task is published to Redis only after the database transaction has successfully committed.

## Consequences

- Unit tests asserting task scheduling must execute within `django_capture_on_commit_callbacks` or call the underlying function with commit hooks activated.
- As a rule across all background workers, only primitive IDs (`user_id`, `event_id`) are passed as task parameters rather than pickled Django model instances.
