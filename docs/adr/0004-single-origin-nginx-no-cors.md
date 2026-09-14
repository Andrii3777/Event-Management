# 0004. Single-Origin Architecture via Nginx instead of CORS

## Context

Authentication relies on `HttpOnly` cookies (ADR-0001), whose delivery depends on browser `SameSite` policies. Cross-origin setups complicate cookie sharing in local and containerized environments.

## Decision

The frontend and backend are served from a single origin in production. Nginx in the frontend container serves static assets and reverse-proxies `/api/`, `/admin/`, and `/static/` to `backend:8000`. In local development without Docker, Vite's dev server proxy serves the identical purpose. `django-cors-headers` is omitted from production dependencies, eliminating CORS overhead.

## Rationale

- Enabling `django-cors-headers` and cross-origin cookies would require `SameSite=None`, which browsers only accept over HTTPS (`Secure=True`). This complicates local HTTP development and introduces cross-site cookie exposure.
- Serving frontend and backend on the same origin allows `SameSite=Lax` cookies, offering strong CSRF defense while ensuring frictionless local and Docker-based operation.

## Consequences

- Nginx reverse proxy configuration is an integral component of the Docker deployment architecture.
- If a future deployment requires hosting the frontend on an independent CDN domain, CORS and `SameSite=None` with TLS termination would need to be introduced.
