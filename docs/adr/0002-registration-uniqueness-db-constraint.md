# 0002. Registration Uniqueness via Database Constraint

## Context

The domain requirements prohibit duplicate registrations of a user for the same event and mandate robustness against race conditions from concurrent requests, ensuring duplicates are prevented even if the service layer is bypassed.

## Decision

Uniqueness of the `(user, event)` tuple in `EventRegistration` is strictly guaranteed by a database-level `UniqueConstraint` on the table, in addition to an application-level `exists()` check in the registration service.

## Rationale

- Relying solely on an application-level `exists()` check was rejected because it does not prevent race conditions: two simultaneous requests could both pass the `exists()` query before either commits its row, resulting in duplicate database records.
- The service-level check is retained as a fast path that provides a clean 409 Conflict without triggering a database transaction rollback. The DB constraint serves as the definitive safeguard against race conditions or direct ORM operations.

## Consequences

- The registration service must catch `IntegrityError` resulting from a constraint violation and translate it into an HTTP 409 Conflict (`AlreadyRegistered` exception) so concurrent requests return a conflict response instead of an unexpected 500 internal server error.
- The database migration establishing this constraint is a critical part of the schema and must not be altered or omitted.
- An automated test verifying that duplicate registrations fail at the database level when bypassing the service layer is maintained in the test suite.
