# 0001. JWT in HttpOnly Cookies instead of localStorage

## Context

Security requirements dictate that access and refresh tokens must be stored in `HttpOnly` cookies so that client-side JavaScript cannot access them directly, preventing token theft via Cross-Site Scripting (XSS). By default, `djangorestframework-simplejwt` expects tokens in the `Authorization` request header rather than HTTP cookies.

## Decision

Access and refresh tokens are issued and validated exclusively via `HttpOnly` cookies (`access_token` and `refresh_token` with distinct `Path` attributes), rather than in response bodies or `localStorage`/`sessionStorage`. A custom authentication backend, `CookieJWTAuthentication`, wraps SimpleJWT's `JWTAuthentication` to extract the JWT from incoming cookies.

## Rationale

- Storing tokens in the response body for storage in `localStorage` was rejected because it exposes credentials to any malicious script executed in the browser (XSS).
- Using `SameSite=None` for cookies was rejected because it mandates `Secure=True` even on localhost HTTP and exposes cookies to cross-site requests. Instead, a single-origin architecture via Nginx (see ADR-0004) with `SameSite=Lax` was chosen.
- Django's built-in `SessionAuthentication` was rejected because the architecture specifically targets stateless JWT with token rotation and blacklisting rather than server-side session tables.

## Consequences

- Every unsafe state-changing request (POST, PUT, PATCH, DELETE) requires explicit CSRF validation on top of cookie authentication (`csrftoken` cookie with `X-CSRFToken` header).
- Access and refresh cookies use different paths (`/` vs `/api/v1/auth/`) and lifetimes, requiring synchronized handling during login, refresh, and logout.
- Testing the API manually via Postman or cURL requires capturing cookies and supplying the `X-CSRFToken` header.
- The frontend client must implement a single-flight refresh mechanism with a queue for pending requests to prevent concurrent 401 responses from triggering multiple simultaneous refresh requests.
