# 0009. Event Registration Sub-Resource Endpoints Design

## Context

The API needs to support user participation (joining and leaving events). There are two primary architectural routing approaches: dedicated registration collections (`/registrations/`) or event sub-resource actions (`/events/{id}/join/` and `/events/{id}/leave/`).

## Decision

Participation endpoints are structured as action endpoints on the event resource (`/api/v1/events/{id}/join/` and `/api/v1/events/{id}/leave/`, with backward-compatible aliases `/register/` and `/cancel/`), implemented in `apps.registrations` and routed cleanly without creating circular dependencies.

## Rationale

- Sub-resource routing is intuitive for client developers: the action is performed in the direct context of a specific event ID.
- Domain encapsulation is preserved by implementing the action views and business logic entirely within the `registrations` application, interacting only with public event identifiers.

## Consequences

- The URL schema remains consistent and client-friendly.
- The registration app handles registration business rules, while the event app remains focused on core event properties and metadata.
