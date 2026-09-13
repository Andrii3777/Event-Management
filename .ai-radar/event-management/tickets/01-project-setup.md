# 01 — Скелет проекта: Django, Docker, конфигурация

**Требования:** R01, R15, R25, R26, R27, R28, R29, R30, R31, R32, R33, R34, R35, R36, R43, R44,
R45, R46, R47, R48, R55, R57, R99(частично — версия схемы), R101, R102, R103, R111, R112, R113,
R114, R133, R134, R135, R136, R137, R140, R141, R142, R143, R144, R146, R151i

**Blocked by:** —
**Зона:** `backend/config/`, `backend/manage.py`, `backend/requirements.txt`,
`backend/requirements-dev.txt`, `backend/pyproject.toml`, `docker-compose.yml`, `Dockerfile*`,
`.env.example`, `.pre-commit-config.yaml`, `frontend/` (только скелет: `package.json`,
`vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `index.html`, `src/main.tsx`,
`Dockerfile`, `nginx.conf` — без функциональности приложений)
**Волна:** 1
**Status:** ready

## Что должно заработать

`docker compose up --build` поднимает пять сервисов (backend, postgres, redis, celery-worker,
frontend), применяет миграции и отвечает на `GET /api/v1/` каким-то ответом (404 — это тоже
ответ, приложений ещё нет). Фронтенд-контейнер отдаёт страницу-заглушку через nginx на порту
3000. Ни одного приложения (`users`, `events`, `registrations`) в этом таске не создаётся — они
регистрируются пустыми в `INSTALLED_APPS`, чтобы следующие таски начинали с рабочего каркаса, а
не с пустого репозитория.

Это Phase 1 из §68 брифа: «Django; DRF; PostgreSQL; environment configuration; Docker.»

## Из брифа, дословно

> «Docker Compose should run the complete stack. Expected services: backend, postgres, redis,
> celery-worker, frontend.» (§61)

> «The backend service should be named consistently as: backend. Do not use `web` in some places
> and `backend` in others.» (§61)

> «Migrations should normally be generated explicitly when model changes are made... Then:
> `python manage.py migrate`» (§62)

> «Implement lightweight request logging middleware. Useful fields: HTTP method, path, status
> code, request duration.» (§41)

> «Implement a lightweight custom DRF exception handler.» (§42)

> «Keep dependencies minimal. Remove unused dependencies and unnecessary abstractions before
> finalizing the project.» (§65)

## Разделы спецификации

§1 (стек и версии), §2 (структура репозитория), §10 (логирование и обработка исключений),
§11 (конфигурация), §12 (Docker и запуск), §13 (тестовая инфраструктура — установка и конфиг
pytest, без самих тестов), §15 (ruff/pre-commit), §16 (порядок сборки), §18 (nginx, gunicorn,
whitenoise, healthcheck'и, migrate-в-entrypoint — с обоснованием родителей).

## Критерии приёмки

- [ ] `docker compose up --build` поднимает все пять сервисов без ошибок; `postgres` и `redis`
      имеют healthcheck, `backend` стартует после того, как оба здоровы
- [ ] Entrypoint `backend` выполняет `migrate` (не `makemigrations`) и запускает gunicorn на 8000
- [ ] `celery-worker` — тот же образ backend, команда `celery -A config worker -l info`, стартует
      без ошибок (даже без задач — просто соединяется с Redis)
- [ ] `frontend` — multi-stage Dockerfile: node собирает Vite-заглушку, nginx отдаёт статику и
      проксирует `/api/`, `/admin/`, `/static/` на `backend:8000`; порт 3000
- [ ] `config/settings.py` читает все переменные из §11 спецификации через небольшой хелпер
      `env(name, default=None, cast=str)`; ни одна не хардкожена
- [ ] `.env.example` содержит все имена из §43 брифа плюс `COOKIE_SECURE`,
      `ACCESS_TOKEN_LIFETIME_MINUTES`, `REFRESH_TOKEN_LIFETIME_DAYS`, `DJANGO_LOG_LEVEL`,
      `DEMO_USER_PASSWORD` — с безопасными значениями для локального запуска, секреты пустые
- [ ] `.env` в `.gitignore` (уже есть), реальный `.env` не коммитится
- [ ] `RequestLogMiddleware` пишет одну строку на запрос: метод, путь, статус, длительность в мс,
      `request_id` (из `X-Request-ID` или сгенерированный), возвращает тот же заголовок в ответе
- [ ] `custom_exception_handler` в `config/exceptions.py`: вызывает штатный DRF-обработчик; если
      тот вернул `None` — логирует `logger.exception` и отдаёт 500 с `{"detail": ..., "request_id": ...}`;
      если вернул ответ — не трогает тело, оставляет стандартный формат DRF
- [ ] `logging` настроен в `settings.py`, вывод в stdout; нигде в проекте нет `print()`
- [ ] `pyproject.toml` в `backend/`: конфигурация ruff (lint + format) и pytest-django
      (`DJANGO_SETTINGS_MODULE`, тестовая БД)
- [ ] `.pre-commit-config.yaml` в корне: хуки `ruff check --fix` и `ruff format`
- [ ] `requirements.txt` и `requirements-dev.txt` — все зависимости закреплены по минорной версии
      (`>=X.Y,<X.(Y+1)`), ни одна по патчу; `djangorestframework-simplejwt` (+ `token_blacklist`),
      `django-filter`, `drf-spectacular` уже в `requirements.txt` — их ставит этот таск, использует
      02/03/05
- [ ] Django apps `apps/users`, `apps/events`, `apps/registrations` существуют как пустые пакеты,
      зарегистрированы в `INSTALLED_APPS`, без моделей — следующие таски заполняют их
- [ ] `README.md` — только заготовка со структурой разделов из §63 брифа, без содержания (его
      дописывает таск 08)
- [ ] Фронтенд-скелет: `npm run build` в `frontend/` проходит и производит статику, которую
      отдаёт nginx-контейнер
