# interfaces.md — границы и правила проекта

Копия §«Границы и швы» из `spec.md`, плюс то, что подагент не выведет сам. Обновляется по мере
того, как таски возвращаются (Phase 5) — секция «Границы, решённые в спецификации» не переписывается,
новые записи добавляются под «Что построено».

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `apps.users` | моделью `User`, регистрацией, входом, выходом, `/me`, всей cookie-механикой JWT | `User`, `UserSerializer`, `CookieJWTAuthentication`, `set_auth_cookies(response, access, refresh)`, `clear_auth_cookies(response)` | имена и флаги cookie, blacklist, порядок CSRF-проверки |
| `apps.events` | моделью `Event`, CRUD-API, фильтрами, правами на событие | `Event`, `EventSerializer`, `EventWriteSerializer`, `IsOrganizerOrReadOnly`, `EventFilter`, `Event.objects.with_stats(user)` | аннотации, устройство queryset, детали фильтров |
| `apps.registrations` | моделью `EventRegistration`, правилами записи и отмены, письмом | `EventRegistration`, `register_user_for_event(user, event) -> EventRegistration`, `cancel_registration(user, event) -> None`, `send_registration_email(user_id, event_id)` | обработку дубля, `transaction.on_commit`, содержимое письма, политику ретраев |
| `config` | настройками, корневым роутингом, сквозным поведением | `custom_exception_handler`, `RequestLogMiddleware`, `celery_app` | формат лога, генерацию `request_id` |
| `frontend/src/api` | транспортом к API | `api` (axios-инстанс) | интерсепторы, очередь refresh, XSRF |
| `frontend/src/features/*` | доступом к своему куску API и типами | `useEvents`, `useEvent`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`, `useRegister`, `useCancelRegistration`, `useMe`, `useLogin`, `useRegisterUser`, `useLogout` | ключи кэша, инвалидацию, формы URL |

Зависимости — в одну сторону: `registrations` → `events` → `users`, **с названными
исключениями (D02, обнаружено в тасках 04 и 09):** `apps/events/views.py` импортирует
`register_user_for_event`/`cancel_registration`/`EventRegistrationSerializer`, а
`apps/events/filters.py` импортирует `EventRegistration` — оба раза из `apps.registrations`,
потому что спецификация (§6, §8) требует `register`/`cancel` как `@action` на `EventViewSet` и
фильтр `registered` на `EventFilter`, а не отдельные модули. Это два разрешённых обратных
импорта, оба уже перечислены здесь — новых мест сверх этих двух не добавляй.

**Шов для тестов — один: HTTP API через `rest_framework.test.APIClient`.** Два исключения:
`apps.registrations.services` (тест гонки, тест `on_commit`) и прямой ORM-тест ограничения
уникальности в базе.

## Правила проекта, которые нельзя вывести из кода

**Стек и версии** — закреплять по минорной версии, никогда по патчу (`Django>=5.2,<5.3`,
не `==5.2.4`). Backend: Python 3.12+, Django 5.x, DRF, PostgreSQL 16, djangorestframework-simplejwt
(+ token_blacklist), django-filter, drf-spectacular, Celery, Redis, gunicorn, whitenoise, pytest,
pytest-django, ruff. Frontend: React 18+, TypeScript, Vite, React Router, TanStack Query, Axios,
React Hook Form, Zod, Tailwind CSS.

**Команды**

| Что | Команда |
|---|---|
| Поднять весь стек | `docker compose up --build` |
| Тесты бэкенда | `docker compose exec backend pytest` |
| Миграции (применить) | `docker compose exec backend python manage.py migrate` |
| Миграции (сгенерировать) | `docker compose exec backend python manage.py makemigrations` |
| Линт/формат | `docker compose exec backend ruff check .` / `ruff format .` |
| Демо-данные | `docker compose exec backend python manage.py seed_demo` |
| Фронтенд типы | `npm run type-check` (в `frontend/`) |
| Фронтенд сборка | `npm run build` (в `frontend/`) |

**Что не трогать**

- `USERNAME_FIELD = "email"` на `User` — решение брифинга (G01), менять только по слову пользователя.
- Формат ответа DRF — без конверта (`{"success": true, ...}` запрещено, R87).
- `unique(user, event)` — ограничение на уровне базы, не только в сериализаторе (R54).
- `send_registration_email.delay(user_id, event_id)` — только примитивы, не модели (R107).
- Постановка задачи письма — строго внутри `transaction.on_commit` (R108).
- Soft delete, UUID, Celery Beat, Redis-кэш, CORS-пакет — не вводить нигде (R56, R55, R109, R110,
  §12 спецификации).
- Комментарии в коде — только на английском, минимум, только там, где не очевидно (R140).

**Правило блокировки.** Если для таска не хватает зависимости, которую не поставить локально
(внешний сервис, платный API, недостающий пакет вне уже согласованного стека) — таск возвращается
`BLOCKED` с точным именем недостающего, а не устанавливается самовольно и не заменяется заглушкой
без пометки.

## Что построено

### Из таска 09 — фильтры organizer/registered (D03)

- `EventFilter.organizer` (`NumberFilter`, `field_name="organizer_id"`) и `EventFilter.registered`
  (`BooleanFilter`, метод `filter_registered`) — используй их, не изобретай второй способ
  фильтровать по организатору/своим записям
- Аноним с `?registered=true` получает пустой список (200), не 401/500 — так и оставь, это
  осознанное поведение, не баг

### Из таска 08 — приёмка и доводка (финал)

- `apps/common/schema.py::error_detail_serializer(name)` — единственное место, где строится
  форма `{"detail": str}` для схемы; используется в `apps/events/views.py` и
  `apps/users/views.py`
- `apps/events/tests/helpers.py::future(days=1)` — единственный хелпер дат в тестах; все файлы
  тестов (`events` и `registrations`) импортируют его, локальных копий больше нет
- `frontend/src/features/shared/formErrors.ts::applyServerFieldErrors` — единственное место
  раскладки серверных 400-ошибок по полям формы; используется в `LoginPage`, `RegisterPage`,
  `EventForm`
- `frontend/src/components/RegistrationButton.tsx` — единственная кнопка записи/отмены,
  используется в `EventCard` и `EventDetailsPage`. **Организатор видит и может нажать её на своё
  же событие** (G05, ответ пользователя «Разрешить везде») — без проверки `isOrganizer`
- `backend/entrypoint.sh` теперь вызывает `collectstatic` перед gunicorn — известная
  незавершённость из таска 01 закрыта, `/admin/` и `/static/` работают
- Полный список пунктов чеклиста §70 брифа с тем, чем каждый проверен — `checklist-70.md`

### Из таска 05 — документация API и демо-данные

- `/api/schema/`, `/api/docs/`, `/api/redoc/` — все три `AllowAny`, 200. Схема описывает
  реальную форму ответов (`create`/`update`/`partial_update` события — полный `EventSerializer`,
  не `EventWriteSerializer`)
- `python manage.py seed_demo` — идемпотентна (`get_or_create`), 2 пользователя
  (`alice`/`bob@demo.local`, пароль из `DEMO_USER_PASSWORD`), 15 событий, часть с записями.
  НЕ вызывается автоматически


### Из таска 01 — скелет проекта

- `config.env(name, default=None, cast=str)` — единственный способ читать переменные окружения;
  новые переменные добавляются в `.env.example`, не читаются напрямую через `os.environ`
- `config.exceptions.custom_exception_handler` — уже подключён в `REST_FRAMEWORK.EXCEPTION_HANDLER`
- `config.middleware.RequestLogMiddleware` — уже в `MIDDLEWARE`, ставит/читает `X-Request-ID`
- `config.celery_app` (`config/celery.py`, реэкспортирован из `config/__init__.py`) — брокер
  Redis из `REDIS_URL`; задачи объявляются через `@celery_app.task`, автообнаружение по
  `INSTALLED_APPS`
- `apps.users`, `apps.events`, `apps.registrations` зарегистрированы в `INSTALLED_APPS`, пусты
  (ни моделей, ни `AUTH_USER_MODEL` — это таск 02)
- `django.middleware.csrf.CsrfViewMiddleware` уже в `MIDDLEWARE` (штатный Django), но флаги
  cookie (`CSRF_COOKIE_HTTPONLY`, `SameSite`, `Secure`) и `CSRF_TRUSTED_ORIGINS` настраивает
  таск 02
- Тесты: `docker compose exec backend pytest`; один файл — `pytest apps/<app>/tests/test_x.py`
- **Известная незавершённость (не блокирует, см. `concerns` в `state.js`):** `Dockerfile`/
  `entrypoint.sh` не вызывают `collectstatic` — `ManifestStaticFilesStorage` (whitenoise) упадёт
  при обращении к `/admin/` до тех пор, пока это не будет исправлено. Событийный API статику не
  использует, поэтому тасков 02–07 это не блокирует.

### Из таска 02 — пользователи и аутентификация

- `apps.users.models.User(AbstractUser)` — `USERNAME_FIELD = "email"`, `REQUIRED_FIELDS =
  ["username"]`, `email` уникален
- `apps.users.serializers.UserSerializer` — `{id, email, username}`, без пароля
- `apps.users.authentication.CookieJWTAuthentication` — читает access-токен из cookie
  `access_token`, выполняет CSRF-проверку после успешной проверки токена; уже подключена как
  `DEFAULT_AUTHENTICATION_CLASSES`
- `apps.users.cookies.set_auth_cookies(response, access, refresh)` /
  `clear_auth_cookies(response)` — единственный способ ставить/чистить auth-cookie; не пиши
  cookie руками в других тасках
- Роуты: `POST /api/v1/auth/register/`, `POST /api/v1/auth/token/` (тело ответа `{"user": {...}}`,
  без токенов в теле), `POST /api/v1/auth/token/refresh/`, `POST /api/v1/auth/logout/`,
  `GET /api/v1/auth/me/`, `GET /api/v1/auth/csrf/`
- `CSRF_COOKIE_HTTPONLY=False`, `CSRF_TRUSTED_ORIGINS` из env — уже настроено; для
  небезопасных запросов (`POST`/`PATCH`/`DELETE`) фронтенду нужен заголовок `X-CSRFToken` из
  cookie `csrftoken`
- Тесты: `apps/users/tests/` — 6 файлов, 14 тестов, паттерн для новых тестов аутентификации/прав
  такой же (через `APIClient`, не через внутренности)

### Из таска 03 — события

- `apps.events.models.Event` — `title, description, date (индекс), location (индекс),
  organizer (FK User, CASCADE), created_at, updated_at`, `Meta.ordering = ["date", "id"]`
- `EventViewSet` на `/api/v1/events/` — `list`/`retrieve` `AllowAny`, `create`
  `IsAuthenticated`, `update`/`destroy` `IsAuthenticated` + `IsOrganizerOrReadOnly` (403 на
  чужое, не 404); `http_method_names` без `put`
- `EventSerializer` (чтение): `id, title, description, date, location, organizer{id,username},
  created_at, updated_at` — **без** `registrations_count`/`is_registered`, их добавляет таск 04
  (D01, см. `manifest.md`)
- `EventWriteSerializer`: `title, description, date, location`, без поля `organizer`;
  `perform_create` подставляет `request.user`; дата в прошлом при создании → 400
- `EventFilter`: `location` (`icontains`), `date_after`/`date_before` (`gte`/`lte`); `search` по
  `title,description,location`; `ordering` — `date,created_at,title`, по умолчанию `date`;
  `EventPagination` — `page_size=10`, максимум 100
- Queryset списка — `select_related("organizer")`, число запросов константно
- Тесты: `apps/events/tests/` — 7 файлов, 24 теста, тот же паттерн (через `APIClient`)
- **Известная незавершённость:** локальные хелперы `future()`/`future(days)` продублированы в
  трёх файлах тестов с разными сигнатурами — не блокирует, в `concerns`

### Из таска 06 — фронтенд: каркас, вход, регистрация

- `frontend/src/api/client.ts` — `api` (axios-инстанс): `baseURL="/api/v1"`,
  `withCredentials`, XSRF-заголовки, single-flight refresh на 401. `skipsRefresh()` — список
  путей, которые НЕ должны запускать refresh/редирект: `/auth/token/refresh/`, `/auth/token/`
  (логин), `/auth/register/`, `/auth/me/`. Новый путь с ожидаемым 401/400 добавляй в этот
  список, а не изобретай свою обработку рядом
- `features/auth/hooks.ts` — `useMe`, `useLogin`, `useRegisterUser`, `useLogout`;
  `features/auth/types.ts` — `User`, `LoginRequest/Response`, `RegisterRequest`
- `routes/RequireAuth.tsx` — готов, но пока не применён ни к одному маршруту (кроме заглушки
  `/events`, которая теперь ПУБЛИЧНАЯ — R76). Таск 07 применяет его к `/events/create` и
  `/events/:id/edit`
- `router.tsx` — экспортирует `router` (`createBrowserRouter`); маршруты `/login`, `/register`,
  `/events` (заглушка), `*`. Добавляй новые маршруты сюда же, не создавай второй роутер
- Компоненты в `frontend/src/components/`: `Navbar`, `Button`, `Input`, `Textarea`,
  `LoadingState`, `ErrorState`, `EmptyState`, `ConfirmDialog` — переиспользуй, не создавай вторые
  версии
- Автотестов фронтенда нет (не в объёме) — проверка: `npm run type-check`, `npm run build`
- **Известная незавершённость:** `LoginPage`/`RegisterPage` дублируют один и тот же цикл
  раскладки серверных 400-ошибок по полям формы; `loginSchema`/`registerSchema` дублируют
  правило валидации email — не блокирует, в `concerns`

### Из таска 04 — записи на события и асинхронная почта

- `apps.registrations.models.EventRegistration(event FK CASCADE, user FK CASCADE, created_at)`,
  `UniqueConstraint(["user","event"], name="uniq_user_event")`
- `apps.registrations.services.register_user_for_event(user, event) -> EventRegistration`,
  `cancel_registration(user, event) -> None` — единственная точка входа для этой логики
- `apps.registrations.exceptions`: `AlreadyRegistered` (409), `EventAlreadyPast` (400),
  `NotRegistered` (404)
- `apps.registrations.tasks.send_registration_email(user_id: int, event_id: int)` —
  `task_ignore_result=True`, `autoretry_for=(SMTPException, ConnectionError)`
- `POST/DELETE /api/v1/events/{id}/register/` — `@action` на `EventViewSet` (не отдельный
  ViewSet, см. D02 в `manifest.md`)
- `EventSerializer` теперь включает `registrations_count`, `is_registered` (D01 закрыт)
- Тесты: `apps/registrations/tests/` — 4 файла; регрессионный тест на аннотации — в
  `apps/events/tests/test_registration_stats.py`
- **D02 (см. manifest.md):** `apps/events/views.py` импортирует из `apps.registrations` — это
  единственное разрешённое обратное направление зависимости, новых не добавляй

### Из таска 07 — фронтенд: события и записи

- `features/events/hooks.ts`: `useEvents`, `useEvent`, `useCreateEvent`, `useUpdateEvent`,
  `useDeleteEvent`, `useRegister`, `useCancelRegistration` — используй их, не пиши свои
- `features/events/EventsList.tsx` — общий компонент списка, используется и `/events`, и
  `/my-events` с разными query-параметрами; не создавай второй список
- `/my-events` шлёт `?organizer=<id>` и `?registered=true` — бэкенд-фильтры под них добавляет
  таск 09 (D03)
- **Известная незавершённость (не блокирует):** `EventCard`/`EventDetailsPage` дублируют логику
  кнопки записи/отмены (`isPast`, `pending`, сам `<Button>`); `EventForm` дублирует цикл
  раскладки серверных 400-ошибок (та же дублировка, что уже отмечена у `LoginPage`/
  `RegisterPage` в таске 06) — общий хелпер убрал бы обе; в `concerns`
- **Пограничная находка (не блокирует, ни манифест ни спека этого не требуют):**
  `EventDetailsPage` прячет кнопку «записаться» от организатора его же события, а `EventCard` в
  списке — нет: организатор может записаться на своё событие через карточку в списке. Если это
  окажется важным — решение через `AskUserQuestion` пользователю, а не самовольная правка.
