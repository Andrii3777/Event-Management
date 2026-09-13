# Манифест требований

Источник: `2026-09-12-brief.md`. Строку из этого списка может снять **только пользователь**.

Бриф написан в форме уже готовой спецификации: почти каждая его строка — это решение,
а не пожелание. Поэтому требований много и большинство из них — точечные технические
обязательства, которые можно независимо проверить на готовом проекте.

## Функциональное ядро

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R01 | «Build a Django REST API for Event Management» | done | — | таск 01, коммит 6f072d1 |
| R02 | «create events» | done | — | таск 03, коммит ee56962 |
| R03 | «view events» | done | — | таск 03, коммит ee56962 |
| R04 | «update events» | done | — | таск 03, коммит ee56962 |
| R05 | «delete events» | done | — | таск 03, коммит ee56962 |
| R06 | «register users for events» | done | — | таск 04, коммит 5d46948 |
| R07 | Event model: «title» | done | — | таск 03, коммит ee56962 |
| R08 | Event model: «description» | done | — | таск 03, коммит ee56962 |
| R09 | Event model: «date» | done | — | таск 03, коммит ee56962 |
| R10 | Event model: «location» | done | — | таск 03, коммит ee56962 |
| R11 | Event model: «organizer» | done | — | таск 03, коммит ee56962 |
| R12 | «basic user registration» | done | — | таск 02, коммит 6aacae9 |
| R13 | «authentication» | done | — | таск 02, коммит 6aacae9 |
| R14 | «API documentation» | done | — | таск 05, коммит 1d9d6fd |
| R15 | «Docker» | done | — | таск 01, коммит 6f072d1 |
| R16 | «README» | done | — | таск 08, коммит 15f1097 |
| R17 | Бонус: «event search/filtering» | done | — | таск 03, коммит ee56962 |
| R18 | Бонус: «email notifications after event registration» | done | — | таск 04, коммит 5d46948 |
| R19 | «All mandatory requirements and both bonus requirements should be implemented.» | done | — | таск 08, коммит 15f1097 |

## Фронтенд как часть задачи

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R20 | «also provide a small frontend: React» | done | — | таск 06, коммит 6ed2cfa |
| R21 | «TypeScript» | done | — | таск 06, коммит 6ed2cfa |
| R22 | «Responsive UI» | done | — | таск 07, коммит 629ff53 |
| R23 | «Tailwind CSS» | done | — | таск 06, коммит 6ed2cfa |
| R24 | «The frontend is secondary to the backend and should not cause unnecessary scope expansion.» | done | — | таск 06, коммит 6ed2cfa |

## Стек

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R25 | «Python 3.12+» | done | — | таск 01, коммит 6f072d1 |
| R26 | «Django 5.x» | done | — | таск 01, коммит 6f072d1 |
| R27 | «Django REST Framework» | done | — | таск 01, коммит 6f072d1 |
| R28 | «PostgreSQL» / «Do not use SQLite for the final implementation.» | done | — | таск 01, коммит 6f072d1 |
| R29 | «djangorestframework-simplejwt» | done | — | таск 01, коммит 6f072d1 |
| R30 | «django-filter» | done | — | таск 01, коммит 6f072d1 |
| R31 | «drf-spectacular» | done | — | таск 01, коммит 6f072d1 |
| R32 | «Celery» | done | — | таск 01, коммит 6f072d1 |
| R33 | «Redis» | done | — | таск 01, коммит 6f072d1 |
| R34 | «pytest» / «pytest-django» | done | — | таск 01, коммит 6f072d1 |
| R35 | «ruff» | done | — | таск 01, коммит 6f072d1 |
| R36 | «pre-commit» | done | — | таск 01, коммит 6f072d1 |
| R37 | «Vite» | done | — | таск 06, коммит 6ed2cfa |
| R38 | «React Router» | done | — | таск 06, коммит 6ed2cfa |
| R39 | «TanStack Query» | done | — | таск 06, коммит 6ed2cfa |
| R40 | «Axios» | done | — | таск 06, коммит 6ed2cfa |
| R41 | «React Hook Form» | done | — | таск 06, коммит 6ed2cfa |
| R42 | «Zod» | done | — | таск 06, коммит 6ed2cfa |
| R43 | «Docker Compose» | done | — | таск 01, коммит 6f072d1 |
| R44 | «Use current stable, mutually compatible package versions rather than hardcoding patch versions» | done | — | таск 01, коммит 6f072d1 |

## Архитектурные ограничения

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R45 | «Good engineering practices without overengineering.» / «Every technology should have a concrete purpose.» | done | — | таск 01, коммит 6f072d1 |
| R46 | «Django apps should represent features: apps/users apps/events apps/registrations» | done | — | таск 01, коммит 6f072d1 |
| R47 | «Do not attempt to recreate NestJS's module/dto/entity structure in Django.» | done | — | таск 01, коммит 6f072d1 |
| R48 | «If a file is not needed, do not create it just to follow the tree literally.» | done | — | таск 01, коммит 6f072d1 |
| R49 | «A custom user model is preferred if it can be implemented cleanly from the beginning.» | done | — | таск 02, коммит 6aacae9 |
| R50 | «Passwords must use Django's password hashing.» | done | — | таск 02, коммит 6aacae9 |
| R51 | «Never expose passwords through API responses.» | done | — | таск 02, коммит 6aacae9 |
| R52 | «The organizer must be derived from the authenticated user.» / «Do not allow clients to create events on behalf of another user» | done | — | таск 03, коммит ee56962 |
| R53 | «EventRegistration — id, event → Event, user → User, created_at» | done | — | таск 04, коммит 5d46948 |
| R54 | «Add a database-level uniqueness constraint: unique(user, event)» | done | — | таск 04, коммит 5d46948 |
| R55 | «Do not introduce UUIDs unless there is a concrete reason.» | done | — | таск 01, коммит 6f072d1 |
| R56 | «Do not implement soft delete.» | done | — | таск 03, коммит ee56962 |
| R57 | «Use: /api/v1/» | done | — | таск 01, коммит 6f072d1 |

## Аутентификация

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R58 | «POST /api/v1/auth/register/» | done | — | таск 02, коммит 6aacae9 |
| R59 | «POST /api/v1/auth/token/» | done | — | таск 02, коммит 6aacae9 |
| R60 | «POST /api/v1/auth/token/refresh/» | done | — | таск 02, коммит 6aacae9 |
| R61 | «POST /api/v1/auth/logout/» | done | — | таск 02, коммит 6aacae9 |
| R62 | «GET /api/v1/auth/me/» | done | — | таск 02, коммит 6aacae9 |
| R63 | «Access token ... HttpOnly + Secure cookie» | done | — | таск 02, коммит 6aacae9 |
| R64 | «Refresh token ... HttpOnly + Secure cookie» | done | — | таск 02, коммит 6aacae9 |
| R65 | «Frontend JavaScript must not directly read the JWTs.» / «Do not use localStorage or sessionStorage for authentication tokens.» | done | — | таск 02, коммит 6aacae9 |
| R66 | «Use SimpleJWT's blacklist/outstanding-token functionality.» / «use it for refresh-token revocation» | done | — | таск 02, коммит 6aacae9 |
| R67 | «Access token → 5–15 minutes / Refresh token → several days» | done | — | таск 02, коммит 6aacae9 |
| R68 | «401 → POST /api/v1/auth/token/refresh/ → new access token → retry original request» / «The frontend should handle this transparently» | done | — | таск 02, коммит 6aacae9 |
| R69 | «Logout should: receive/identify the refresh token; blacklist it through SimpleJWT; clear authentication cookies.» | done | — | таск 02, коммит 6aacae9 |
| R70 | «Do not disable CSRF to simplify development.» / «Configure: Django CSRF middleware; trusted origins; frontend/backend origins; CSRF token handling for state-changing requests.» | done | — | таск 02, коммит 6aacae9 |
| R71 | «Production cookies should use: Secure=True» | done | — | таск 02, коммит 6aacae9 |
| R72 | «appropriate SameSite configuration» | done | — | таск 02, коммит 6aacae9 |

## API событий и регистраций

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R73 | «GET/POST /api/v1/events/, GET/PATCH/DELETE /api/v1/events/{id}/» | done | — | таск 03, коммит ee56962 |
| R74 | «POST /api/v1/events/{id}/register/» / «DELETE /api/v1/events/{id}/register/» | done | — | таск 04, коммит 5d46948 |
| R75 | «Do not use URLs such as: /createEvent /deleteEvent /getEvents /registerUser» | done | — | таск 03, коммит ee56962 |
| R76 | «Event list/detail — Can be public.» | done | — | таск 03, коммит ee56962 |
| R77 | «Create — Authenticated users only.» | done | — | таск 03, коммит ee56962 |
| R78 | «Update — Only the event organizer.» / «Delete — Only the event organizer.» | done | — | таск 03, коммит ee56962 |
| R79 | «Register — Authenticated users only.» | done | — | таск 04, коммит 5d46948 |
| R80 | «Cancel registration — Authenticated users only, and only their own registration.» | done | — | таск 04, коммит 5d46948 |
| R81 | «Security must be enforced on the backend even if the frontend hides buttons.» | done | — | таск 03, коммит ee56962 |
| R82 | «Use DRF's standard mechanisms, preferably a ModelViewSet» / «Simple CRUD does not require a service layer.» | done | — | таск 03, коммит ee56962 |
| R83 | «Registration has enough business logic to justify a small service.» / «apps/registrations/services.py» / «register_user_for_event(user, event)» | done | — | таск 04, коммит 5d46948 |
| R84 | «Application level — Detect an existing registration and return an appropriate API error.» | done | — | таск 04, коммит 5d46948 |
| R85 | «Duplicate registration can reasonably use: 409 Conflict» | done | — | таск 04, коммит 5d46948 |
| R86 | «For create/update, accept: title description date location» / «For read responses, expose: id title description date location organizer created_at updated_at» | done | — | таск 03, коммит ee56962 |
| R87 | «Use normal DRF responses.» / «Do not create a universal custom response envelope.» | done | — | таск 03, коммит ee56962 |
| R88 | «Do not build a complex registration administration API.» | done | — | таск 04, коммит 5d46948 |

## Поиск, фильтры, производительность

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R89 | «GET /api/v1/events/?location=Kyiv» | done | — | таск 03, коммит ee56962 |
| R90 | «?date_after=2026-09-01» / «?date_before=2026-10-01» | done | — | таск 03, коммит ee56962 |
| R91 | «GET /api/v1/events/?search=python» / «Search can cover: title; description; location.» | done | — | таск 03, коммит ee56962 |
| R92 | «?ordering=date» / «?ordering=-date» | done | — | таск 03, коммит ee56962 |
| R93 | «Do not introduce Elasticsearch or another search engine.» | done | — | таск 03, коммит ee56962 |
| R94 | «Event lists must be paginated.» / «Do not return unlimited collections.» | done | — | таск 03, коммит ee56962 |
| R95 | «Avoid N+1 queries.» / «select_related("organizer")» | done | — | таск 03, коммит ee56962 |
| R96 | «Add indexes based on actual query patterns.» / «Event.date Event.location» / «Do not index every field.» | done | — | таск 03, коммит ee56962 |

## Качество API

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R97 | «Use standard HTTP semantics.» — 200 / 201 / 204 / 400 / 401 / 403 / 404 / 409 | done | — | таск 03, коммит ee56962 |
| R98 | «Backend validation should cover: required fields; valid event dates; email; password requirements; duplicate registration; relevant business rules.» | done | — | таск 03, коммит ee56962 |
| R99 | «/api/schema/ → OpenAPI schema, /api/docs/ → Swagger UI, /api/redoc/ → ReDoc» / «Use OpenAPI 3.x.» | done | таск 01 закрепил стек; таск 05 подключил маршруты/схему | таски 01 коммит 6f072d1, 05 коммит 1d9d6fd |
| R100 | «Use @extend_schema and related annotations where automatic schema generation is insufficient.» | done | — | таск 05, коммит 1d9d6fd |
| R101 | «Implement a lightweight custom DRF exception handler.» / «log unexpected errors; avoid exposing internal implementation details» | done | — | таск 01, коммит 6f072d1 |
| R102 | «Use Python's standard logging» / «Do not use print() for application logging.» | done | — | таск 01, коммит 6f072d1 |
| R103 | «Implement lightweight request logging middleware.» — method, path, status code, request duration | done | — | таск 01, коммит 6f072d1 |

## Асинхронная почта

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R104 | «Celery handles asynchronous task execution. Redis acts as the broker.» | done | — | таск 04, коммит 5d46948 |
| R105 | «The HTTP request should not wait for the email to be sent.» | done | — | таск 04, коммит 5d46948 |
| R106 | «The email should contain useful information such as: event title; date; location; registration confirmation.» | done | — | таск 04, коммит 5d46948 |
| R107 | «send_registration_email.delay(user_id, event_id)» / «Do not pass Django model instances to Celery.» | done | — | таск 04, коммит 5d46948 |
| R108 | «Prefer transaction hooks such as transaction.on_commit()» / «DB commit ↓ enqueue email task» | done | — | таск 04, коммит 5d46948 |
| R109 | «Do not use Celery Beat.» | done | — | таск 04, коммит 5d46948 |
| R110 | «Do not add Redis caching just because Redis is available.» | done | — | таск 04, коммит 5d46948 |

## Конфигурация и секреты

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R111 | «Use environment variables.» — DEBUG, SECRET_KEY, DATABASE_URL, POSTGRES_*, REDIS_URL, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, CSRF_TRUSTED_ORIGINS, EMAIL_* | done | — | таск 01, коммит 6f072d1 |
| R112 | «Provide: .env.example» | done | — | таск 01, коммит 6f072d1 |
| R113 | «Never commit real secrets.» | done | — | таск 01, коммит 6f072d1 |
| R114 | «Django settings.py should remain the main configuration point.» | done | — | таск 01, коммит 6f072d1 |

## Фронтенд — объём и устройство

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R115 | Маршруты: «/login /register /events /events/:id /events/create /events/:id/edit» | done | таск 06 сделал /login,/register,/events; таск 07 добавил /events/:id,/create,/:id/edit | таски 06 коммит 6ed2cfa, 07 коммит 629ff53 |
| R116 | «Optional: /my-events» | done | пользователь: «Делаем» — две вкладки: куда записан / что организую. Фронтенд — таск 07, бэкенд-фильтры — D03, таск 09 | таски 07 коммит 629ff53, 09 коммит 867572f |
| R117 | Функции: «login; user registration; event list; event search; event filtering; pagination; event details; event registration; registration cancellation; event creation; event editing; event deletion» | done | — | таск 07, коммит 629ff53 |
| R118 | «loading states; error states; empty states» | done | — | таск 06, коммит 6ed2cfa |
| R119 | «responsive layout» / «The application should work well on both desktop and mobile.» | done | — | таск 06, коммит 6ed2cfa |
| R120 | «Do not add a large UI framework such as: Material UI; Bootstrap.» / «Do not introduce shadcn/ui or another component library» | done | — | таск 06, коммит 6ed2cfa |
| R121 | «Create reusable components where there is real repetition.» — Navbar, Button, Input, EventCard, EventForm, Pagination, Loading/Error/EmptyState | done | — | таск 06, коммит 6ed2cfa |
| R122 | «Use TanStack Query for server state.» / «Do not store server responses in Redux, Zustand, or a global Context.» | done | — | таск 06, коммит 6ed2cfa |
| R123 | «Use Axios with a centralized client: frontend/src/api/client.ts» — base URL, credentials/cookies, refresh flow, retry | done | — | таск 06, коммит 6ed2cfa |
| R124 | «Define TypeScript types for API entities and responses.» / «Do not duplicate the same type definitions across many components.» | done | — | таск 06, коммит 6ed2cfa |
| R125 | «Use the Zod resolver for form validation.» — login, registration, event creation, event editing | done | таск 06 сделал формы входа/регистрации; таск 07 — формы событий | таски 06 коммит 6ed2cfa, 07 коммит 629ff53 |
| R126 | «Protect authenticated routes where necessary.» | done | — | таск 06, коммит 6ed2cfa |
| R127 | «Keep API communication separated from UI components.» / «Pages/components should not contain large amounts of raw Axios request logic.» | done | — | таск 06, коммит 6ed2cfa |

## Тесты, инфраструктура, документация

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R128 | Тесты аутентификации: «user registration; successful login; invalid credentials; token refresh; logout; protected endpoints» | done | — | таск 02, коммит 6aacae9 |
| R129 | Тесты событий: «create; list; retrieve; update; delete; unauthorized update/delete; search; filtering; ordering; pagination» | done | — | таск 03, коммит ee56962 |
| R130 | Тесты регистраций: «successful registration; duplicate registration; cancellation; unauthorized registration; email task triggering» | done | — | таск 04, коммит 5d46948 |
| R131 | «Verify that only organizers can update/delete their events.» | done | — | таск 03, коммит ee56962 |
| R132 | «Verify that duplicate registrations cannot be created.» | done | — | таск 04, коммит 5d46948 |
| R133 | «Focus on important behavior rather than arbitrary 100% coverage.» | done | — | таск 01, коммит 6f072d1 |
| R134 | Сервисы compose: «backend postgres redis celery-worker frontend» | done | — | таск 01, коммит 6f072d1 |
| R135 | «docker compose up --build» поднимает весь стек | done | — | таск 01, коммит 6f072d1 |
| R136 | «The backend service should be named consistently as: backend» / «Do not use web in some places and backend in others.» | done | — | таск 01, коммит 6f072d1 |
| R137 | Команды: «docker compose exec backend pytest», «... manage.py migrate», «... ruff check .», «... ruff format .», «... makemigrations» | done | — | таск 01, коммит 6f072d1 |
| R138 | «README.md must be written entirely in English.» + предложенная структура разделов | done | — | таск 08, коммит 15f1097 |
| R139 | «The README should explain how another developer can run and evaluate the project from scratch.» / «Keep it factual and concise.» | done | — | таск 08, коммит 15f1097 |
| R140 | «Use the minimum possible number of comments in the code.» / «All comments must be written in English only.» / «No Russian or Ukrainian comments in source code.» | done | — | таск 01, коммит 6f072d1 |
| R141 | «Follow standard Python conventions: snake_case PascalCase UPPER_CASE constants» / «Use type hints where they improve clarity» | done | — | таск 01, коммит 6f072d1 |
| R142 | «Keep dependencies minimal.» / «Remove unused dependencies and unnecessary abstractions before finalizing the project.» | done | — | таск 01, коммит 6f072d1 |
| R143 | «Use normal Django migrations.» / «no need to implement: zero-downtime migration strategies; large-table migration optimization; complicated data backfills» | done | — | таск 01, коммит 6f072d1 |
| R144 | Запрет-лист §66: microservices, CQRS, event sourcing, repository pattern, GraphQL, response envelopes, Kubernetes, Kafka, RabbitMQ, Prometheus, soft delete, password reset, email verification, OAuth, 2FA, WebSockets, RBAC, Redux, Zustand, Next.js/SSR, MUI, Bootstrap | done | — | таск 01, коммит 6f072d1 |
| R145 | «Before declaring the project complete» — финальный чеклист §70 | done | — | таск 08, коммит 15f1097 |
| R146 | «Implement in the following order.» — Phase 1…Phase 10 (§68) | done | — | таск 01, коммит 6f072d1 |
| R147 | «The final project should be small enough to understand quickly, but polished enough to look like a serious production-oriented implementation.» | done | — | таск 08, коммит 15f1097 |

## Подразумеваемое (в брифе не сказано)

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R148i | *(подразумевается)* чем отправляется письмо локально | done | решено мной (craft): EMAIL_BACKEND из env, по умолчанию console в воркере; SMTP при заданном EMAIL_HOST. Лишнего сервиса в compose нет | таск 04, коммит 5d46948 |
| R149i | *(подразумевается)* вход по email или по username | done | пользователь: «Email как логин» — USERNAME_FIELD=email, username остаётся для отображения организатора | таск 02, коммит 6aacae9 |
| R150i | *(подразумевается)* «valid event dates» | done | пользователь: «Создание — только будущее»; правка прошедшего события разрешена, запись на прошедшее — 400 | таск 03, коммит ee56962 |
| R151i | *(подразумевается)* как фронтенд собран в Docker | done | решено мной (craft): multi-stage build → nginx, он же проксирует /api на backend. Один origin → cookie и CSRF работают без CORS-костылей | таск 01, коммит 6f072d1 |
| R152i | *(подразумевается)* видит ли организатор список записавшихся | deferred | решено мной: вне объёма — §58 «Do not build a complex registration administration API». Уйдёт в Out of Scope, попадёт в отчёт | spec: «Вне рамок» |
| R153i | *(подразумевается)* демо-данные | done | пользователь: «Да, management command» — seed_demo, пара пользователей и ~15 событий; пустая база остаётся дефолтом | таск 05, коммит 1d9d6fd |
| R154i | *(подразумевается)* число записавшихся и факт моей записи | done | решено мной: нужно для §45 (кнопка «записаться/отменить») — в сериализатор события идут registrations_count и is_registered. См. D01 — аннотации перенесены с таска 03 на 04 | таск 04, коммит 5d46948 |

## Решено пользователем в ходе сборки (вне брифинга)

| ID | Вопрос | Ответ пользователя | Требование | Где |
|----|--------|---------------------|------------|-----|
| G05 | Ревью таска 08 нашло: `EventDetailsPage` (таск 07) прятала кнопку «записаться» от организатора его же события, `EventCard` в списке — нет; таск 08 при вынесении общего `RegistrationButton` тихо унифицировал на «скрыть везде», не спросив. Вопрос задан явно: может ли организатор записаться на своё событие? | «Разрешить везде» — кнопка видна и работает для организатора и в карточке, и на странице деталей | R154i | таск 08, коммит 15f1097 |

## Обнаруженное сборкой (D##)

| ID | Что доказал код | Требование | Статус | Где |
|----|------------------|------------|--------|-----|
| D01 | `Event.objects.annotate(registrations_count=Count("registrations"), is_registered=Exists(...))` не резолвится, пока модель `EventRegistration` (с `related_name="registrations"`) не существует — обратная связь Django не регистрируется заранее. Таск 03 корректно вернул `BLOCKED` вместо самодельной модели-заглушки. Порядок из плана (03 → 04) для этих двух полей не мог сработать буквально: аннотации в `EventSerializer` физически пишутся после появления модели, то есть в 04, а не в 03 | R154i | done | таск 04, коммит 5d46948, spec §6 |
| D02 | Спецификация (§6, §8) требует `register`/`cancel` как `@action` на `EventViewSet` и фильтр `registered` на `EventFilter` — обе вещи физически обязаны импортировать из `apps.registrations` (`register_user_for_event`/`cancel_registration` в `views.py`, `EventRegistration` в `filters.py`). Разворот направления зависимости, которое `interfaces.md` до этого называло однонаправленным. Не решение исполнителей тасков 04/09 — прямое следствие решений спецификации; правило в `interfaces.md` расширено на оба файла, новых мест не добавлять | R74, R79, R80, R116 | done | таски 04 (коммит 5d46948), 09 (коммит 867572f), interfaces.md (обновлено) |
| D03 | Ошибка нарезки, не сборки: спецификация (§8, добавлено на гейте G2) описывает `EventFilter.organizer`/`registered` для наполнения `/my-events`, но ни таск 03, ни таск 04 не получили это в свои критерии приёмки — недосмотр при резке тасков в Phase 4. Обнаружено таском 07: он корректно построил фронтенд под документированные параметры, но бэкенд их не принимал, и обе вкладки `/my-events` показывали весь список вместо отфильтрованного. Оркестратор дополнительно ошибочно заявил таску 07, что фильтры уже реализованы — ложная информация от оркестратора, не от исполнителя | R116 | done | таск 09, коммит 867572f |
