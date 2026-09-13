# Манифест требований

Источник: `2026-09-12-brief.md`. Строку из этого списка может снять **только пользователь**.

Бриф написан в форме уже готовой спецификации: почти каждая его строка — это решение,
а не пожелание. Поэтому требований много и большинство из них — точечные технические
обязательства, которые можно независимо проверить на готовом проекте.

## Функциональное ядро

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R01 | «Build a Django REST API for Event Management» | in-ticket | — | таски 01 |
| R02 | «create events» | in-ticket | — | таски 03 |
| R03 | «view events» | in-ticket | — | таски 03 |
| R04 | «update events» | in-ticket | — | таски 03 |
| R05 | «delete events» | in-ticket | — | таски 03 |
| R06 | «register users for events» | in-ticket | — | таски 04 |
| R07 | Event model: «title» | in-ticket | — | таски 03 |
| R08 | Event model: «description» | in-ticket | — | таски 03 |
| R09 | Event model: «date» | in-ticket | — | таски 03 |
| R10 | Event model: «location» | in-ticket | — | таски 03 |
| R11 | Event model: «organizer» | in-ticket | — | таски 03 |
| R12 | «basic user registration» | in-ticket | — | таски 02 |
| R13 | «authentication» | in-ticket | — | таски 02 |
| R14 | «API documentation» | in-ticket | — | таски 05 |
| R15 | «Docker» | in-ticket | — | таски 01 |
| R16 | «README» | in-ticket | — | таски 08 |
| R17 | Бонус: «event search/filtering» | in-ticket | — | таски 03 |
| R18 | Бонус: «email notifications after event registration» | in-ticket | — | таски 04 |
| R19 | «All mandatory requirements and both bonus requirements should be implemented.» | in-ticket | — | таски 08 |

## Фронтенд как часть задачи

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R20 | «also provide a small frontend: React» | in-ticket | — | таски 06 |
| R21 | «TypeScript» | in-ticket | — | таски 06 |
| R22 | «Responsive UI» | in-ticket | — | таски 07 |
| R23 | «Tailwind CSS» | in-ticket | — | таски 06 |
| R24 | «The frontend is secondary to the backend and should not cause unnecessary scope expansion.» | in-ticket | — | таски 06 |

## Стек

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R25 | «Python 3.12+» | in-ticket | — | таски 01 |
| R26 | «Django 5.x» | in-ticket | — | таски 01 |
| R27 | «Django REST Framework» | in-ticket | — | таски 01 |
| R28 | «PostgreSQL» / «Do not use SQLite for the final implementation.» | in-ticket | — | таски 01 |
| R29 | «djangorestframework-simplejwt» | in-ticket | — | таски 01 |
| R30 | «django-filter» | in-ticket | — | таски 01 |
| R31 | «drf-spectacular» | in-ticket | — | таски 01 |
| R32 | «Celery» | in-ticket | — | таски 01 |
| R33 | «Redis» | in-ticket | — | таски 01 |
| R34 | «pytest» / «pytest-django» | in-ticket | — | таски 01 |
| R35 | «ruff» | in-ticket | — | таски 01 |
| R36 | «pre-commit» | in-ticket | — | таски 01 |
| R37 | «Vite» | in-ticket | — | таски 06 |
| R38 | «React Router» | in-ticket | — | таски 06 |
| R39 | «TanStack Query» | in-ticket | — | таски 06 |
| R40 | «Axios» | in-ticket | — | таски 06 |
| R41 | «React Hook Form» | in-ticket | — | таски 06 |
| R42 | «Zod» | in-ticket | — | таски 06 |
| R43 | «Docker Compose» | in-ticket | — | таски 01 |
| R44 | «Use current stable, mutually compatible package versions rather than hardcoding patch versions» | in-ticket | — | таски 01 |

## Архитектурные ограничения

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R45 | «Good engineering practices without overengineering.» / «Every technology should have a concrete purpose.» | in-ticket | — | таски 01 |
| R46 | «Django apps should represent features: apps/users apps/events apps/registrations» | in-ticket | — | таски 01 |
| R47 | «Do not attempt to recreate NestJS's module/dto/entity structure in Django.» | in-ticket | — | таски 01 |
| R48 | «If a file is not needed, do not create it just to follow the tree literally.» | in-ticket | — | таски 01 |
| R49 | «A custom user model is preferred if it can be implemented cleanly from the beginning.» | in-ticket | — | таски 02 |
| R50 | «Passwords must use Django's password hashing.» | in-ticket | — | таски 02 |
| R51 | «Never expose passwords through API responses.» | in-ticket | — | таски 02 |
| R52 | «The organizer must be derived from the authenticated user.» / «Do not allow clients to create events on behalf of another user» | in-ticket | — | таски 03 |
| R53 | «EventRegistration — id, event → Event, user → User, created_at» | in-ticket | — | таски 04 |
| R54 | «Add a database-level uniqueness constraint: unique(user, event)» | in-ticket | — | таски 04 |
| R55 | «Do not introduce UUIDs unless there is a concrete reason.» | in-ticket | — | таски 01 |
| R56 | «Do not implement soft delete.» | in-ticket | — | таски 03 |
| R57 | «Use: /api/v1/» | in-ticket | — | таски 01 |

## Аутентификация

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R58 | «POST /api/v1/auth/register/» | in-ticket | — | таски 02 |
| R59 | «POST /api/v1/auth/token/» | in-ticket | — | таски 02 |
| R60 | «POST /api/v1/auth/token/refresh/» | in-ticket | — | таски 02 |
| R61 | «POST /api/v1/auth/logout/» | in-ticket | — | таски 02 |
| R62 | «GET /api/v1/auth/me/» | in-ticket | — | таски 02 |
| R63 | «Access token ... HttpOnly + Secure cookie» | in-ticket | — | таски 02 |
| R64 | «Refresh token ... HttpOnly + Secure cookie» | in-ticket | — | таски 02 |
| R65 | «Frontend JavaScript must not directly read the JWTs.» / «Do not use localStorage or sessionStorage for authentication tokens.» | in-ticket | — | таски 02 |
| R66 | «Use SimpleJWT's blacklist/outstanding-token functionality.» / «use it for refresh-token revocation» | in-ticket | — | таски 02 |
| R67 | «Access token → 5–15 minutes / Refresh token → several days» | in-ticket | — | таски 02 |
| R68 | «401 → POST /api/v1/auth/token/refresh/ → new access token → retry original request» / «The frontend should handle this transparently» | in-ticket | — | таски 02 |
| R69 | «Logout should: receive/identify the refresh token; blacklist it through SimpleJWT; clear authentication cookies.» | in-ticket | — | таски 02 |
| R70 | «Do not disable CSRF to simplify development.» / «Configure: Django CSRF middleware; trusted origins; frontend/backend origins; CSRF token handling for state-changing requests.» | in-ticket | — | таски 02 |
| R71 | «Production cookies should use: Secure=True» | in-ticket | — | таски 02 |
| R72 | «appropriate SameSite configuration» | in-ticket | — | таски 02 |

## API событий и регистраций

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R73 | «GET/POST /api/v1/events/, GET/PATCH/DELETE /api/v1/events/{id}/» | in-ticket | — | таски 03 |
| R74 | «POST /api/v1/events/{id}/register/» / «DELETE /api/v1/events/{id}/register/» | in-ticket | — | таски 04 |
| R75 | «Do not use URLs such as: /createEvent /deleteEvent /getEvents /registerUser» | in-ticket | — | таски 03 |
| R76 | «Event list/detail — Can be public.» | in-ticket | — | таски 03 |
| R77 | «Create — Authenticated users only.» | in-ticket | — | таски 03 |
| R78 | «Update — Only the event organizer.» / «Delete — Only the event organizer.» | in-ticket | — | таски 03 |
| R79 | «Register — Authenticated users only.» | in-ticket | — | таски 04 |
| R80 | «Cancel registration — Authenticated users only, and only their own registration.» | in-ticket | — | таски 04 |
| R81 | «Security must be enforced on the backend even if the frontend hides buttons.» | in-ticket | — | таски 03 |
| R82 | «Use DRF's standard mechanisms, preferably a ModelViewSet» / «Simple CRUD does not require a service layer.» | in-ticket | — | таски 03 |
| R83 | «Registration has enough business logic to justify a small service.» / «apps/registrations/services.py» / «register_user_for_event(user, event)» | in-ticket | — | таски 04 |
| R84 | «Application level — Detect an existing registration and return an appropriate API error.» | in-ticket | — | таски 04 |
| R85 | «Duplicate registration can reasonably use: 409 Conflict» | in-ticket | — | таски 04 |
| R86 | «For create/update, accept: title description date location» / «For read responses, expose: id title description date location organizer created_at updated_at» | in-ticket | — | таски 03 |
| R87 | «Use normal DRF responses.» / «Do not create a universal custom response envelope.» | in-ticket | — | таски 03 |
| R88 | «Do not build a complex registration administration API.» | in-ticket | — | таски 04 |

## Поиск, фильтры, производительность

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R89 | «GET /api/v1/events/?location=Kyiv» | in-ticket | — | таски 03 |
| R90 | «?date_after=2026-09-01» / «?date_before=2026-10-01» | in-ticket | — | таски 03 |
| R91 | «GET /api/v1/events/?search=python» / «Search can cover: title; description; location.» | in-ticket | — | таски 03 |
| R92 | «?ordering=date» / «?ordering=-date» | in-ticket | — | таски 03 |
| R93 | «Do not introduce Elasticsearch or another search engine.» | in-ticket | — | таски 03 |
| R94 | «Event lists must be paginated.» / «Do not return unlimited collections.» | in-ticket | — | таски 03 |
| R95 | «Avoid N+1 queries.» / «select_related("organizer")» | in-ticket | — | таски 03 |
| R96 | «Add indexes based on actual query patterns.» / «Event.date Event.location» / «Do not index every field.» | in-ticket | — | таски 03 |

## Качество API

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R97 | «Use standard HTTP semantics.» — 200 / 201 / 204 / 400 / 401 / 403 / 404 / 409 | in-ticket | — | таски 03 |
| R98 | «Backend validation should cover: required fields; valid event dates; email; password requirements; duplicate registration; relevant business rules.» | in-ticket | — | таски 03, 04 |
| R99 | «/api/schema/ → OpenAPI schema, /api/docs/ → Swagger UI, /api/redoc/ → ReDoc» / «Use OpenAPI 3.x.» | in-ticket | — | таски 01, 05 |
| R100 | «Use @extend_schema and related annotations where automatic schema generation is insufficient.» | in-ticket | — | таски 05 |
| R101 | «Implement a lightweight custom DRF exception handler.» / «log unexpected errors; avoid exposing internal implementation details» | in-ticket | — | таски 01 |
| R102 | «Use Python's standard logging» / «Do not use print() for application logging.» | in-ticket | — | таски 01 |
| R103 | «Implement lightweight request logging middleware.» — method, path, status code, request duration | in-ticket | — | таски 01 |

## Асинхронная почта

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R104 | «Celery handles asynchronous task execution. Redis acts as the broker.» | in-ticket | — | таски 04 |
| R105 | «The HTTP request should not wait for the email to be sent.» | in-ticket | — | таски 04 |
| R106 | «The email should contain useful information such as: event title; date; location; registration confirmation.» | in-ticket | — | таски 04 |
| R107 | «send_registration_email.delay(user_id, event_id)» / «Do not pass Django model instances to Celery.» | in-ticket | — | таски 04 |
| R108 | «Prefer transaction hooks such as transaction.on_commit()» / «DB commit ↓ enqueue email task» | in-ticket | — | таски 04 |
| R109 | «Do not use Celery Beat.» | in-ticket | — | таски 04 |
| R110 | «Do not add Redis caching just because Redis is available.» | in-ticket | — | таски 04 |

## Конфигурация и секреты

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R111 | «Use environment variables.» — DEBUG, SECRET_KEY, DATABASE_URL, POSTGRES_*, REDIS_URL, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, CSRF_TRUSTED_ORIGINS, EMAIL_* | in-ticket | — | таски 01 |
| R112 | «Provide: .env.example» | in-ticket | — | таски 01 |
| R113 | «Never commit real secrets.» | in-ticket | — | таски 01 |
| R114 | «Django settings.py should remain the main configuration point.» | in-ticket | — | таски 01 |

## Фронтенд — объём и устройство

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R115 | Маршруты: «/login /register /events /events/:id /events/create /events/:id/edit» | in-ticket | — | таски 06 |
| R116 | «Optional: /my-events» | in-ticket | пользователь: «Делаем» — две вкладки: куда записан / что организую | таски 07 |
| R117 | Функции: «login; user registration; event list; event search; event filtering; pagination; event details; event registration; registration cancellation; event creation; event editing; event deletion» | in-ticket | — | таски 07 |
| R118 | «loading states; error states; empty states» | in-ticket | — | таски 06 |
| R119 | «responsive layout» / «The application should work well on both desktop and mobile.» | in-ticket | — | таски 06 |
| R120 | «Do not add a large UI framework such as: Material UI; Bootstrap.» / «Do not introduce shadcn/ui or another component library» | in-ticket | — | таски 06 |
| R121 | «Create reusable components where there is real repetition.» — Navbar, Button, Input, EventCard, EventForm, Pagination, Loading/Error/EmptyState | in-ticket | — | таски 06 |
| R122 | «Use TanStack Query for server state.» / «Do not store server responses in Redux, Zustand, or a global Context.» | in-ticket | — | таски 06 |
| R123 | «Use Axios with a centralized client: frontend/src/api/client.ts» — base URL, credentials/cookies, refresh flow, retry | in-ticket | — | таски 06 |
| R124 | «Define TypeScript types for API entities and responses.» / «Do not duplicate the same type definitions across many components.» | in-ticket | — | таски 06 |
| R125 | «Use the Zod resolver for form validation.» — login, registration, event creation, event editing | in-ticket | — | таски 06, 07 |
| R126 | «Protect authenticated routes where necessary.» | in-ticket | — | таски 06 |
| R127 | «Keep API communication separated from UI components.» / «Pages/components should not contain large amounts of raw Axios request logic.» | in-ticket | — | таски 06 |

## Тесты, инфраструктура, документация

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R128 | Тесты аутентификации: «user registration; successful login; invalid credentials; token refresh; logout; protected endpoints» | in-ticket | — | таски 02 |
| R129 | Тесты событий: «create; list; retrieve; update; delete; unauthorized update/delete; search; filtering; ordering; pagination» | in-ticket | — | таски 03 |
| R130 | Тесты регистраций: «successful registration; duplicate registration; cancellation; unauthorized registration; email task triggering» | in-ticket | — | таски 04 |
| R131 | «Verify that only organizers can update/delete their events.» | in-ticket | — | таски 03 |
| R132 | «Verify that duplicate registrations cannot be created.» | in-ticket | — | таски 04 |
| R133 | «Focus on important behavior rather than arbitrary 100% coverage.» | in-ticket | — | таски 01 |
| R134 | Сервисы compose: «backend postgres redis celery-worker frontend» | in-ticket | — | таски 01 |
| R135 | «docker compose up --build» поднимает весь стек | in-ticket | — | таски 01 |
| R136 | «The backend service should be named consistently as: backend» / «Do not use web in some places and backend in others.» | in-ticket | — | таски 01 |
| R137 | Команды: «docker compose exec backend pytest», «... manage.py migrate», «... ruff check .», «... ruff format .», «... makemigrations» | in-ticket | — | таски 01 |
| R138 | «README.md must be written entirely in English.» + предложенная структура разделов | in-ticket | — | таски 08 |
| R139 | «The README should explain how another developer can run and evaluate the project from scratch.» / «Keep it factual and concise.» | in-ticket | — | таски 08 |
| R140 | «Use the minimum possible number of comments in the code.» / «All comments must be written in English only.» / «No Russian or Ukrainian comments in source code.» | in-ticket | — | таски 01, 08 |
| R141 | «Follow standard Python conventions: snake_case PascalCase UPPER_CASE constants» / «Use type hints where they improve clarity» | in-ticket | — | таски 01, 08 |
| R142 | «Keep dependencies minimal.» / «Remove unused dependencies and unnecessary abstractions before finalizing the project.» | in-ticket | — | таски 01, 08 |
| R143 | «Use normal Django migrations.» / «no need to implement: zero-downtime migration strategies; large-table migration optimization; complicated data backfills» | in-ticket | — | таски 01 |
| R144 | Запрет-лист §66: microservices, CQRS, event sourcing, repository pattern, GraphQL, response envelopes, Kubernetes, Kafka, RabbitMQ, Prometheus, soft delete, password reset, email verification, OAuth, 2FA, WebSockets, RBAC, Redux, Zustand, Next.js/SSR, MUI, Bootstrap | in-ticket | — | таски 01, 08 |
| R145 | «Before declaring the project complete» — финальный чеклист §70 | in-ticket | — | таски 08 |
| R146 | «Implement in the following order.» — Phase 1…Phase 10 (§68) | in-ticket | — | таски 01 |
| R147 | «The final project should be small enough to understand quickly, but polished enough to look like a serious production-oriented implementation.» | in-ticket | — | таски 08 |

## Подразумеваемое (в брифе не сказано)

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R148i | *(подразумевается)* чем отправляется письмо локально | in-ticket | решено мной (craft): EMAIL_BACKEND из env, по умолчанию console в воркере; SMTP при заданном EMAIL_HOST. Лишнего сервиса в compose нет | таски 04 |
| R149i | *(подразумевается)* вход по email или по username | in-ticket | пользователь: «Email как логин» — USERNAME_FIELD=email, username остаётся для отображения организатора | таски 02 |
| R150i | *(подразумевается)* «valid event dates» | in-ticket | пользователь: «Создание — только будущее»; правка прошедшего события разрешена, запись на прошедшее — 400 | таски 03 |
| R151i | *(подразумевается)* как фронтенд собран в Docker | in-ticket | решено мной (craft): multi-stage build → nginx, он же проксирует /api на backend. Один origin → cookie и CSRF работают без CORS-костылей | таски 01 |
| R152i | *(подразумевается)* видит ли организатор список записавшихся | deferred | решено мной: вне объёма — §58 «Do not build a complex registration administration API». Уйдёт в Out of Scope, попадёт в отчёт | spec: «Вне рамок» |
| R153i | *(подразумевается)* демо-данные | in-ticket | пользователь: «Да, management command» — seed_demo, пара пользователей и ~15 событий; пустая база остаётся дефолтом | таски 05 |
| R154i | *(подразумевается)* число записавшихся и факт моей записи | in-ticket | решено мной: нужно для §45 (кнопка «записаться/отменить») — в сериализатор события идут registrations_count и is_registered | таски 03, 07 |
