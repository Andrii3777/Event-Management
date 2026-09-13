<!-- ai-radar:start -->
# Event Management

REST API для управления событиями (Django + DRF, PostgreSQL, Celery/Redis) с React/TypeScript-клиентом на Vite; в проде frontend и backend отдаются с одного origin через nginx.

## Команды

| Команда | Что делает |
|---|---|
| `docker compose up -d --build` | Поднять весь стек: backend, postgres, redis, celery-worker, frontend |
| `docker compose exec backend pytest` | Тесты бэкенда (57 passed) |
| `docker compose exec backend ruff check .` | Линт (All checks passed) |
| `docker compose exec backend python manage.py migrate` | Применить миграции |
| `docker compose exec backend python manage.py seed_demo` | Демо-данные: 2 юзера, 15 событий; идемпотентна |
| `npm run type-check` (в `frontend/`) | Проверка типов, без Docker |
| `npm run build` (в `frontend/`) | Прод-сборка фронтенда |
| `npm install && npm run dev` (в `frontend/`) | Frontend dev-сервер, Vite на :5173, проксирует `/api` на `localhost:8000` |

## Структура

```
backend/apps/
  users/          User (email как логин), JWT в HttpOnly cookie, CSRF
  events/         Event, CRUD, фильтры/поиск/пагинация
  registrations/  EventRegistration, регистрация/отмена, письмо через Celery
  common/         apps/common/schema.py — общий сериализатор ошибок для OpenAPI-схемы
backend/config/    settings.py, urls.py, celery.py, exceptions.py, middleware.py
frontend/src/
  api/            client.ts — axios-инстанс с CSRF и refresh
  features/       auth/, events/, shared/ — хуки, типы, Zod-схемы по доменам
  components/     переиспользуемые UI-блоки (в т.ч. RegistrationButton, EventCard, EventForm)
  pages/, routes/ страницы и RequireAuth-гард
```

## Ключевые файлы

- `backend/apps/users/authentication.py::CookieJWTAuthentication` — читает access-токен из cookie `access_token`, CSRF проверяется уже после токена; подключена как `DEFAULT_AUTHENTICATION_CLASSES`
- `backend/apps/users/cookies.py::set_auth_cookies`/`clear_auth_cookies` — единственное место, где ставятся/чистятся auth-cookie
- `backend/apps/events/views.py::EventViewSet` — CRUD `/api/v1/events/`, плюс `@action` `register`/`cancel` (POST/DELETE `.../register/`), обратный импорт из `apps.registrations` — разрешённое исключение (D02)
- `backend/apps/events/filters.py::EventFilter` — `search`, `location`, `date_after`/`date_before`, `ordering`, `organizer`, `registered` (тоже обратный импорт из `apps.registrations`)
- `backend/apps/registrations/services.py::register_user_for_event`/`cancel_registration` — единственная точка входа для записи/отмены; ошибки — `apps/registrations/exceptions.py` (`AlreadyRegistered` 409, `EventAlreadyPast` 400, `NotRegistered` 404)
- `backend/apps/registrations/tasks.py::send_registration_email` — Celery-таска, принимает только `user_id`/`event_id` (примитивы, не модели), ставится в `transaction.on_commit`
- `backend/apps/common/schema.py::error_detail_serializer` — единственное место, где описывается форма `{"detail": str}` для drf-spectacular
- `backend/apps/events/tests/helpers.py::future(days=1)` — единственный хелпер дат в тестах, локальных копий быть не должно
- `backend/apps/events/management/commands/seed_demo.py` — демо-сидер, `get_or_create`
- `frontend/src/api/client.ts` — axios-инстанс `api`: `baseURL="/api/v1"`, `withCredentials`, XSRF, single-flight refresh на 401; `skipsRefresh()` — список путей без авто-refresh
- `frontend/src/features/shared/formErrors.ts::applyServerFieldErrors` — единственное место раскладки серверных 400 по полям формы (используется в `LoginPage`, `RegisterPage`, `EventForm`)
- `frontend/src/components/RegistrationButton.tsx` — единственная кнопка записи/отмены, используется в `EventCard` и `EventDetailsPage`; организатор видит и может нажать её на своё же событие (осознанно, без проверки `isOrganizer`)
- `frontend/src/routes/RequireAuth.tsx` + `frontend/src/router.tsx` — гард применён к `/events/create` и `/events/:id/edit`; новые маршруты добавлять только в `router.tsx`

## Архитектура

- Зависимости модулей бэкенда — в одну сторону: `registrations` → `events` → `users`, с двумя названными исключениями (D02): `apps/events/views.py` импортирует `register_user_for_event`/`cancel_registration`/`EventRegistrationSerializer`, `apps/events/filters.py` импортирует `EventRegistration` — оба из `apps.registrations`. Новых обратных импортов не добавлять.
- Единственный шов для тестов — HTTP API через `rest_framework.test.APIClient`. Исключения: тест гонки и `on_commit` в `apps.registrations.services`, и прямой ORM-тест ограничения уникальности в базе.
- `EventSerializer` (чтение) содержит `registrations_count`/`is_registered`; `EventWriteSerializer` — без `organizer` (подставляется из `request.user`), без `registrations_count`. `PUT` не поддерживается нигде, только `PATCH`.
- `frontend/src/features/*` владеет своим куском API и типами; ключи кэша TanStack Query и инвалидация — внутри соответствующего `features/*`, не размазаны по компонентам.
- `apps.users` прячет имена/флаги cookie и порядок CSRF-проверки; `config` прячет формат лога и генерацию `request_id` (`RequestLogMiddleware`, читает/пишет `X-Request-ID`).

## Соглашения кода

- Версии зависимостей — по минорной, не по патчу (`Django>=5.2,<5.3`, не `==5.2.4`).
- `USERNAME_FIELD = "email"` на `User` — не менять без явного слова пользователя.
- Ответы DRF — без конверта (`{"success": true, ...}` запрещено).
- `unique(user, event)` — ограничение на уровне базы (`UniqueConstraint`), не только в сериализаторе.
- Переменные окружения читаются только через `config.env(name, default=None, cast=str)`, не напрямую через `os.environ`; новые — сразу в `.env.example`.
- Soft delete, UUID вместо PK, Celery Beat, Redis-кэш, `django-cors-headers` — не вводить (не нужны при одном origin через nginx).
- Комментарии в коде — только на английском, минимум, только там, где не очевидно.
- Ruff: `line-length = 100`, `select = ["E","F","I","W","UP","B","DJ"]`, миграции исключены из линта.

## Окружение

Переменные читаются из `.env` (см. `.env.example`): `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`,
`DATABASE_URL` (имя зарезервировано брифом, не используется — конфиг через `POSTGRES_*`),
`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`,
`REDIS_URL`, `CORS_ALLOWED_ORIGINS` (имя зарезервировано, не используется — один origin),
`CSRF_TRUSTED_ORIGINS`, `COOKIE_SECURE`, `ACCESS_TOKEN_LIFETIME_MINUTES`,
`REFRESH_TOKEN_LIFETIME_DAYS`, `EMAIL_HOST` (пусто → письма печатаются в лог celery-worker),
`EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DJANGO_LOG_LEVEL`, `DEMO_USER_PASSWORD`.

## Тесты

- `docker compose exec backend pytest` — 57 тестов, разложены по `apps/<app>/tests/test_*.py`
  (events: 8 файлов, registrations: 4, users: 6). Один файл — `pytest apps/events/tests/test_create.py`.
- Паттерн — через `APIClient`, не через внутренности; новые тесты пишутся так же.
- Автотестов фронтенда нет — проверка: `npm run type-check` и `npm run build`.

## Подводные камни

- `backend` и `celery-worker` собираются как образы без bind-mount кода (только `static_volume`
  в `docker-compose.yml`) — после правки backend-кода нужен `docker compose build`
  (или `up --build`), иначе тесты и воркер видят старую версию.
- Порт 8000 на Windows-хосте может быть занят другим процессом. Если бэкенд недоступен напрямую
  на `localhost:8000`, ходить через `http://localhost:3000/api/...` — nginx фронтенда
  проксирует `/api`, `/admin`, `/static` на backend внутри сети compose.
- `entrypoint.sh` гоняет `migrate` и `collectstatic` при каждом старте backend-контейнера — не нужно вызывать их вручную после `up`.
- CSRF: перед любым небезопасным запросом (`POST`/`PATCH`/`DELETE`, включая логин) фронтенду
  нужен `GET /api/v1/auth/csrf/`, иначе `X-CSRFToken` взять неоткуда.

## Как здесь работает ai-radar

Сборка ведётся навыком `/ai-radar`. Требования, спецификация и таски — в `.ai-radar/event-management/`.
Прогресс — в радаре, общем экране всех сборок на этой машине; он читает
`.ai-radar/event-management/state.js`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи радар»: состояние поднимется
из `.ai-radar/event-management/state.js`, переспрашивать ничего не нужно.
<!-- ai-radar:end -->
