# 02 — Пользователи и аутентификация

**Требования:** R12, R13, R49, R50, R51, R58, R59, R60, R61, R62, R63, R64, R65, R66, R67, R68,
R69, R70, R71, R72, R128, R149i

**Blocked by:** 01
**Зона:** `backend/apps/users/`, `backend/config/settings.py` (доп. секции: SimpleJWT, CSRF,
AUTH_USER_MODEL), `backend/config/urls.py` (роуты `/api/v1/auth/`)
**Волна:** 2
**Status:** ready

## Что должно заработать

Пользователь регистрируется по email/username/паролю, входит по email и паролю, получает
access- и refresh-токены в HttpOnly-cookie (не в теле ответа), обновляет их через
`/auth/token/refresh/` без ручного вмешательства, выходит — и после выхода его refresh-токен
больше не работает. `/auth/me/` говорит клиенту, кто он. Отдельный `/auth/csrf/` выдаёт
CSRF-cookie до первого небезопасного запроса. Ни один ответ API не содержит пароль.

Это Phase 2 из §68 брифа: «user model; registration; JWT; HttpOnly cookies; refresh; blacklist;
logout; /me; CSRF configuration.»

## Из брифа, дословно

> «A custom user model is preferred if it can be implemented cleanly from the beginning.» (§8)

> «Passwords must use Django's password hashing. Never expose passwords through API responses.» (§8)

> «Access token → HttpOnly + Secure cookie. Refresh token → HttpOnly + Secure cookie... Do not use
> `localStorage` or `sessionStorage` for authentication tokens.» (§15)

> «Use SimpleJWT's blacklist/outstanding-token functionality... use it for refresh-token
> revocation.» (§16)

> «Logout should: receive/identify the refresh token; blacklist it through SimpleJWT; clear
> authentication cookies.» (§19)

> «Because authentication uses cookies, CSRF protection must be configured correctly. Do not
> disable CSRF to simplify development.» (§20)

## Решено в брифинге

Вход по email как `USERNAME_FIELD`, `username` остаётся отдельным полем для отображения
организатора (пользователь: «Email как логин»).

## Разделы спецификации

Истории 1–15, §3 (модель `User`), §4 (аутентификация целиком), §5 (CSRF).

## Критерии приёмки

- [ ] `User(AbstractUser)`: `email` уникален, `USERNAME_FIELD = "email"`,
      `REQUIRED_FIELDS = ["username"]`; миграция создана и закоммичена
- [ ] `POST /api/v1/auth/register/` → 201, тело без `password`; повторный email → 400 с понятной
      ошибкой; слабый пароль → 400 со списком нарушенных валидаторов Django
- [ ] `password` — `write_only` во всех сериализаторах; ни один GET-эндпоинт не может вернуть его
- [ ] `CookieJWTAuthentication` читает access-токен из cookie `access_token`, а не из заголовка
      `Authorization`; после успешной проверки токена выполняет CSRF-проверку
      (`rest_framework.authentication.CSRFCheck`)
- [ ] `POST /api/v1/auth/token/` → 200, тело `{"user": {...}}`, cookie `access_token` и
      `refresh_token` выставлены с `HttpOnly`, `SameSite=Lax`, `Secure=$COOKIE_SECURE`; неверная
      пара → 401 с одинаковым сообщением независимо от того, существует ли email
- [ ] `access_token` — `Path=/api/`; `refresh_token` — `Path=/api/v1/auth/`; время жизни — из
      `ACCESS_TOKEN_LIFETIME_MINUTES` / `REFRESH_TOKEN_LIFETIME_DAYS`
- [ ] `POST /api/v1/auth/token/refresh/` — читает refresh из cookie (не из тела), выдаёт новую
      пару; `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`; без cookie → 401
- [ ] `POST /api/v1/auth/logout/` → 204, refresh-токен уходит в blacklist, обе cookie удаляются;
      без refresh-cookie тоже 204 (выход идемпотентен); повторный refresh уже разлогиненным
      токеном → 401
- [ ] `GET /api/v1/auth/me/` → 200 с `{id, email, username}` для аутентифицированного, 401 для
      анонима
- [ ] `GET /api/v1/auth/csrf/` (`@ensure_csrf_cookie`) → 204, ставит cookie `csrftoken`
      (не HttpOnly, читается JS)
- [ ] `CsrfViewMiddleware` включён в `MIDDLEWARE`; `CSRF_COOKIE_HTTPONLY=False`,
      `CSRF_COOKIE_SAMESITE="Lax"`, `CSRF_COOKIE_SECURE=$COOKIE_SECURE`,
      `CSRF_TRUSTED_ORIGINS` из env; POST без заголовка `X-CSRFToken` → 403
- [ ] `rest_framework_simplejwt.token_blacklist` в `INSTALLED_APPS`, миграция применена
- [ ] Тесты (`apps/users/tests/`): регистрация успешна · занятый email → 400 · слабый пароль →
      400 · пароль отсутствует в ответах · вход верный → 200 + обе cookie · вход неверный → 401 ·
      refresh по cookie → 200 + новая пара · refresh без cookie → 401 · logout → 204 + blacklist +
      cookie очищены · logout без cookie → 204 · `/me/` аутентифицированному → 200, анониму → 401 ·
      запрос без `X-CSRFToken` → 403
