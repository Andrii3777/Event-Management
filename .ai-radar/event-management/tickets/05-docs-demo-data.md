# 05 — Документация API и демо-данные

**Требования:** R14, R99, R100, R153i

**Blocked by:** 04
**Зона:** `backend/config/settings.py` (секция drf-spectacular), `backend/config/urls.py`
(маршруты docs), `backend/apps/*/views.py` (только декораторы `@extend_schema`, без изменения
логики), `backend/apps/events/management/commands/seed_demo.py` (новый файл)
**Волна:** 5 (параллельно с 07)
**Status:** ready

## Что должно заработать

Кто угодно открывает `/api/docs/` и видит рабочий Swagger UI по всему API — включая коды 401,
403, 404, 409, которые автогенерация drf-spectacular не выводит сама. `/api/redoc/` и
`/api/schema/` тоже отвечают. Отдельная management-команда наполняет пустую базу двумя
пользователями и полутора десятками событий в разных городах и датах, чтобы проверяющий сразу
увидел работающую пагинацию и фильтры, а не пустой список.

Это Phase 7 из §68 брифа: «drf-spectacular; OpenAPI; Swagger UI; ReDoc.»

## Из брифа, дословно

> «Use: /api/schema/ → OpenAPI schema, /api/docs/ → Swagger UI, /api/redoc/ → ReDoc... Use
> OpenAPI 3.x. Swagger UI should be the primary interactive documentation interface.» (§33)

> «Use `@extend_schema` and related annotations where automatic schema generation is
> insufficient.» (§33)

## Решено в брифинге

Демо-данные — да, через management-команду (пользователь: «Да, management command»).

## Разделы спецификации

Истории 67–68, §15 (`seed_demo`).

## Критерии приёмки

- [ ] `drf-spectacular` подключён: `/api/schema/` отдаёт валидный OpenAPI 3.1, `/api/docs/` —
      Swagger UI, `/api/redoc/` — ReDoc; все три доступны без аутентификации
- [ ] `@extend_schema` добавлен там, где автогенерация не показывает реальные ответы: действие
      `register`/`cancel` на событии (201/400/401/404/409), обновление/удаление события
      (200/204/403/404), регистрация и вход (201/400/401)
- [ ] Схема не содержит выдуманных полей — она описывает то, что реально отдают сериализаторы из
      тасков 02–04, ничего сверх
- [ ] `python manage.py seed_demo`: создаёт (если их ещё нет — команда идемпотентна, повторный
      запуск не плодит дубли) двух пользователей с паролем из `DEMO_USER_PASSWORD` и ~15 событий
      в разных городах и датах (часть в прошлом, часть в будущем, часть уже с записями от обоих
      демо-пользователей)
- [ ] Пустая база остаётся дефолтом — `seed_demo` не вызывается автоматически при старте
- [ ] Команда описана в README (раздел, который дополняет таск 08, — здесь достаточно, чтобы
      команда работала и была видна в `manage.py help`)
