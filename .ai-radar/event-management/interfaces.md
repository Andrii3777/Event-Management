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

Зависимости — в одну сторону: `registrations` → `events` → `users`. Обратных импортов нет.

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

*(заполняется по мере того, как таски возвращаются — Phase 5)*
