# 0005. Standard Integer Primary Keys and Cascade Deletion (No Soft Delete, No UUIDs)

## Context

The requirements favor simplicity and discourage introducing premature complexity like soft-deletion or UUIDs without concrete domain requirements. When an `Event` is deleted, its associated `EventRegistration` records must be handled cleanly.

## Decision

`Event` and `EventRegistration` models utilize standard auto-incrementing integer primary keys. Deletion of an event cascades to its registrations (`on_delete=models.CASCADE`). Neither `is_deleted` flags nor soft-deletion tables are introduced.

## Rationale

- Soft-delete patterns (e.g., `is_deleted` flags with custom QuerySet managers) introduce pervasive complexity into queryset filtering and can inadvertently expose logically deleted records through unmanaged queries.
- UUID primary keys increase index sizes and database overhead, with no requirement in this project for client-generated IDs or distributed ID generation. Standard sequential IDs are clean, performant, and fit the domain.

## Consequences

- Event deletion is permanent and immediately cascades to related registrations.
- Sequential IDs are human-readable and standard in URL paths (`/api/v1/events/1/`).
