# Checklist §70 брифа — итоговый прогон

Стек поднят с нуля (`docker compose down -v && docker compose up -d --build`), пункты
проверены на живых контейнерах.

| Пункт | Проверено чем | Статус |
|---|---|---|
| Python 3.12+ is used | `backend/Dockerfile` — `FROM python:3.12-slim`; `docker compose exec backend python --version` → 3.12.14 | Проверено |
| Django 5.x is used | `backend/requirements.txt` — `Django>=5.2,<5.3`; pytest header — `django: version: 5.2.17` | Проверено |
| Docker Compose starts successfully | `docker compose down -v && docker compose up -d --build` — все 5 сервисов Up | Проверено |
| PostgreSQL works | `postgres` healthcheck healthy; `migrate` применяет миграции к нему | Проверено |
| Redis works | `redis` healthcheck healthy; celery-worker лог — `Connected to redis://redis:6379/0` | Проверено |
| Celery worker works | `docker compose logs celery-worker` — `celery@... ready.`, задача `send_registration_email` зарегистрирована | Проверено |
| migrations work | `docker compose exec backend python manage.py migrate` на чистой базе — все миграции применены | Проверено |
| user registration works | Ручной путь через UI (`/register`) новым пользователем `checklist.tester@example.com`; `apps/users/tests/test_register.py` | Проверено |
| login works | Ручной путь через UI (`/login`); `apps/users/tests/test_login.py` | Проверено |
| access token works | `GET /api/v1/auth/me/` возвращает 200 после логина (сессия в браузере) | Проверено |
| refresh works | `apps/users/tests/test_refresh.py`; сетевой лог браузера показал `POST /auth/token/refresh/` в рамках single-flight | Проверено |
| logout blacklists refresh token | `apps/users/tests/test_logout.py` (повторный refresh после logout → 401) | Проверено |
| access token is stored in HttpOnly cookie | `apps/users/cookies.py::set_auth_cookies` — `httponly=True`; ручная проверка DevTools cookie `access_token` | Проверено |
| refresh token is stored in HttpOnly cookie | `apps/users/cookies.py::set_auth_cookies` — `httponly=True`, `path=/api/v1/auth/` | Проверено |
| production cookies use Secure | `apps/users/cookies.py` — `secure=settings.COOKIE_SECURE`, флаг из `.env` (`COOKIE_SECURE=True` в проде) | Проверено |
| SameSite is configured | `apps/users/cookies.py` — `samesite="Lax"` на обеих auth-cookie | Проверено |
| CSRF is correctly configured | `apps/users/authentication.py::CookieJWTAuthentication.enforce_csrf`; `apps/users/tests/test_csrf.py` (3 теста) | Проверено |
| Event model has all required fields | `apps/events/models.py::Event` — title, description, date, location, organizer, created_at, updated_at | Проверено |
| event CRUD works | `apps/events/tests/test_create.py`, `test_update.py`, `test_delete.py`, `test_retrieve.py`, `test_list.py`; ручной путь через UI (создание/редактирование/удаление) | Проверено |
| organizer is derived from authenticated user | `apps/events/views.py::EventViewSet.perform_create` — `serializer.save(organizer=self.request.user)` | Проверено |
| organizer permissions work | `apps/events/permissions.py::IsOrganizerOrReadOnly`; `apps/events/tests/test_update.py`, `test_delete.py` (403 на чужое) | Проверено |
| duplicate registration is prevented | `EventRegistration.Meta.UniqueConstraint`; `apps/registrations/tests/test_constraint.py` (прямой ORM-тест гонки) | Проверено |
| registration cancellation works | `apps/registrations/services.py::cancel_registration`; `apps/registrations/tests/test_cancel.py`; ручной путь через UI | Проверено |
| event search works | `EventViewSet.search_fields`; `apps/events/tests/test_filters.py` | Проверено |
| event filtering works | `apps/events/filters.py::EventFilter` (location/date_after/date_before/organizer/registered); `test_filters.py` — 10 тестов | Проверено |
| event ordering works | `EventViewSet.ordering_fields`; ручная проверка `?ordering=date` через UI-селектор | Проверено |
| pagination works | `apps/events/pagination.py::EventPagination` (page_size=10, max=100); `apps/events/tests/test_list.py`; UI показывает Page 1/Next | Проверено |
| registration email is asynchronous | `apps/registrations/tasks.py::send_registration_email` — Celery task, `.delay(...)`; `apps/registrations/tests/test_email_task.py` | Проверено |
| Celery receives IDs rather than model instances | `apps/registrations/services.py` — `send_registration_email.delay(user.id, event.id)`, сигнатура таска — `(user_id: int, event_id: int)` | Проверено |
| email task is scheduled after successful DB commit | `apps/registrations/services.py` — `transaction.on_commit(lambda: ...)` внутри `transaction.atomic()` | Проверено |
| OpenAPI schema works | `curl http://localhost:3000/api/schema/` → 200, реальная OpenAPI 3.1 схема | Проверено |
| Swagger UI works | Открыт в браузере `http://localhost:3000/api/docs/` — список реальных эндпоинтов | Проверено |
| ReDoc works | Открыт в браузере `http://localhost:3000/api/redoc/` — рендерится схема | Проверено |
| backend tests pass | `docker compose exec backend pytest` → 56 passed (после ребилда образа с финальным кодом) | Проверено |
| frontend works | Ручной путь через браузер: список, детали, создание/редактирование/удаление события, запись/отмена, логин/регистрация/логаут | Проверено |
| TypeScript types are used | `frontend/src/features/*/types.ts`; `npm run type-check` → без ошибок | Проверено |
| TanStack Query handles server state | `frontend/src/features/events/hooks.ts`, `frontend/src/features/auth/hooks.ts` — `useQuery`/`useMutation` | Проверено |
| React Hook Form + Zod handle forms | `EventForm.tsx`, `LoginPage.tsx`, `RegisterPage.tsx` — `useForm` + `zodResolver` | Проверено |
| Tailwind responsive UI works | `frontend/tailwind.config.*`, классы `flex`/`grid`/breakpoints в компонентах; визуально проверено в браузере | Проверено |
| loading states exist | `frontend/src/components/LoadingState.tsx`, используется в `EventDetailsPage`, списках | Проверено |
| error states exist | `frontend/src/components/ErrorState.tsx`, используется при ошибках загрузки | Проверено |
| empty states exist | `frontend/src/components/EmptyState.tsx` | Проверено |
| README is English-only | `README.md` — весь текст на английском | Проверено |
| code comments are minimal | Ручной просмотр всех `.py`/`.ts`/`.tsx` файлов — комментарии оставлены только на неочевидной логике (CSRF, on_commit, cookie Path, архитектурные решения) | Проверено |
| all code comments are English-only | `grep` по кириллице (`[а-яА-ЯіїєІЇЄ]`) в `backend/` и `frontend/src/` — 0 совпадений | Проверено |
| no secrets are committed | `.gitignore` исключает `.env`/`.env.*` (кроме `.env.example`); в `.env.example` только dev-заглушки | Проверено |
| no unnecessary dependencies exist | Просмотрены `backend/requirements*.txt` и `frontend/package.json` — каждый пакет используется и входит в согласованный стек (interfaces.md) | Проверено |
| no unnecessary architecture exists | Просмотрен код: нет repository pattern, DDD, лишних сервисных слоёв; сервисный слой есть только там, где есть настоящая бизнес-логика (registrations) | Проверено |
