<!-- ai-radar:start -->
# Event Management

REST API для управления событиями (Django + DRF) с небольшим React/TypeScript-клиентом.

## Команды

| Команда | Что делает |
|---------|------------|
| `docker compose up --build` | Поднять весь стек локально |
| `docker compose exec backend pytest` | Прогнать тесты бэкенда |
| `docker compose exec backend python manage.py migrate` | Применить миграции |

## Как здесь работает ai-radar

Сборка ведётся навыком `/ai-radar`. Требования, спецификация и таски — в `.ai-radar/event-management/`.
Прогресс — в радаре, общем экране всех сборок на этой машине; он читает
`.ai-radar/event-management/state.js`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи радар»: состояние поднимется
из `.ai-radar/event-management/state.js`, переспрашивать ничего не нужно.
<!-- ai-radar:end -->
