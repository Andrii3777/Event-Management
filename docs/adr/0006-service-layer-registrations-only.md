# 0006. Dedicated Service Layer for Registrations

## Context

Standard CRUD operations for events map cleanly to Django REST Framework viewsets and serializers. Conversely, event registration involves multi-step business logic: verifying the event is in the future, atomic database constraint handling, idempotent conflict translation, and scheduling background email notifications.

## Decision

A dedicated service layer (`apps/registrations/services.py`) encapsulates `join_event` and `leave_event` (and their backward-compatible aliases `register_user_for_event` / `cancel_registration`). The `events` application remains service-free, utilizing standard DRF `ModelViewSet` conventions for event CRUD.

## Rationale

- Introducing an artificial service layer for standard Event CRUD would create boilerplate pass-through abstractions with zero business logic.
- Placing registration business logic directly inside view methods would scatter transaction boundaries, `on_commit` hooks, and conflict handling across HTTP request handlers, making unit testing and reuse difficult.

## Consequences

- Architectural logic is intentionally balanced: simple CRUD relies on DRF ViewSets, while complex transactional workflows utilize dedicated service functions.
- Registration endpoints invoke the service layer and translate service-level domain exceptions (`AlreadyJoined`, `EventAlreadyPast`, `NotJoined`) into consistent HTTP responses.
