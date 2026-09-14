# 0003. Custom User Model with Email Login

## Context

Django does not support replacing `AUTH_USER_MODEL` after the initial migration without high-friction data and foreign key migrations. The specification requires authentication via email rather than username, while public API responses display the event organizer by `username`.

## Decision

A custom user model, `User(AbstractUser)`, is introduced in the initial migration. It configures `USERNAME_FIELD = "email"` while retaining `username` as a required field (`REQUIRED_FIELDS = ["username"]`) for display purposes.

## Rationale

- Starting with Django's built-in `auth.User` with the plan of switching later was rejected: altering `AUTH_USER_MODEL` on an active database requires manual migration of foreign keys and data tables. Setting up a custom model on day one is standard Django best practice.
- Relying on `email` as the sole identity field without a separate `username` was rejected because public API contracts and UI designs display event organizers by username, which separates private login credentials from public identity.

## Consequences

- All foreign keys referencing users (`Event.organizer`, `EventRegistration.user`) explicitly reference `settings.AUTH_USER_MODEL`.
- Third-party packages must remain compatible with custom user models.
- Registration validation validates both identity fields (unique email for login, unique username for display) and yields independent validation error messages for each.
