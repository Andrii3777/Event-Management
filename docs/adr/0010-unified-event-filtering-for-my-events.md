# 0010. Unified Event Filtering for Public and User Views

## Context

The application needs to support both public event browsing and personal event views ("My Events", encompassing events created by the user and events joined by the user).

## Decision

A single, unified `/api/v1/events/` endpoint powers both the public directory and user-specific views via declarative `EventFilter` parameters (`organizer=<id>` and `joined=true`).

## Rationale

- Creating dedicated separate endpoints (e.g., `/my-events/organized/` and `/my-events/joined/`) would duplicate pagination, ordering, full-text search, and serialization logic.
- A declarative filter set with django-filter allows composable queries (e.g., searching within events the user joined, or filtering organized events by date range) with zero duplicated endpoint code.

## Consequences

- The frontend "My Events" page consumes the same battle-tested event query hooks and data contracts as the main events catalog.
- The filter implementation validates query parameters and ensures anonymous requests to `joined=true` gracefully return an empty set or appropriate validation message.
