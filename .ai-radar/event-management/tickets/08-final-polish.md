# 08 — Приёмка и доводка

**Требования:** R16, R19, R138, R139, R140, R141, R142, R144, R145, R147

**Blocked by:** 05, 07
**Зона:** весь репозиторий (финальный таск, летит один)
**Волна:** 6
**Status:** ready

## Что должно заработать

Чеклист §70 брифа прогоняется построчно на живом стеке — каждый из 47 пунктов получает
«проверено» с указанием, чем именно, или «не выполнено» с причиной. README дописан целиком и
даёт другому разработчику пройти путь от `git clone` до работающего приложения без вопросов.
Репозиторий чист: ruff и pre-commit проходят без предупреждений по всему коду, лишних
зависимостей и абстракций нет, комментарии — минимум и только на английском.

Это Phase 10 из §68 брифа: «Ruff; pre-commit; README; Docker verification; API documentation
verification; responsive UI; remove unnecessary dependencies; remove unnecessary comments; final
test run.»

## Из брифа, дословно

> «`README.md` must be written entirely in English... The README should explain how another
> developer can run and evaluate the project from scratch. Keep it factual and concise. Do not
> fill it with generic boilerplate.» (§63)

> «Use the minimum possible number of comments in the code. All comments must be written in
> English only... No Russian or Ukrainian comments in source code.» (§64)

> «Remove unused dependencies and unnecessary abstractions before finalizing the project.» (§65)

> «The final project should be small enough to understand quickly, but polished enough to look
> like a serious production-oriented implementation.» (§71)

## Разделы спецификации

История 73, §15 (README — включая содержимое Architecture Decisions и Future Improvements),
§17 (чеклист сдачи).

## Критерии приёмки

- [ ] README дописан по структуре §63 брифа: Overview, Tech Stack, Features, Project Structure,
      Getting Started, Environment Variables, Running with Docker, Database Migrations, Running
      Tests, API Documentation, Authentication, API Endpoints, Frontend, Architecture Decisions,
      Future Improvements
- [ ] **Architecture Decisions** содержит: почему JWT в HttpOnly-cookie, а не в `localStorage`;
      почему ограничение уникальности записи — в базе, а не только в коде; почему письмо ставится
      в `on_commit`; почему сервисный слой есть у записей и нет у CRUD событий; почему один origin
      вместо CORS; почему нет UUID и soft delete — каждый пункт 2–3 строки, без общих слов
- [ ] **Future Improvements** содержит: поимённый список записавшихся для организатора, лимит
      мест на событие, тесты фронтенда, CI
- [ ] Каждая команда из README реально выполнена перед сдачей: `docker compose up --build`,
      `docker compose exec backend pytest`, `... migrate`, `... makemigrations`,
      `... ruff check .`, `... ruff format .`, `... seed_demo`, `npm install`, `npm run dev`,
      `npm run type-check`
- [ ] `ruff check .` и `ruff format --check .` проходят по всему `backend/` без предупреждений
- [ ] `pre-commit run --all-files` проходит
- [ ] Просмотрен весь код на предмет неиспользуемых зависимостей (`requirements*.txt`,
      `package.json`) и абстракций без второго применения — лишнее удалено
- [ ] Просмотрены все комментарии в коде: только английский, только там, где не очевидно логика
      (CSRF-проверка в аутентификации, `on_commit` перед задачей, разные `Path` у cookie —
      согласно списку из §15 спецификации), лишние удалены
- [ ] `docker compose up --build` с нуля (после `docker compose down -v`) поднимает весь стек
      и проходит полный ручной путь пользователя без ошибок в консоли
- [ ] `/api/docs/`, `/api/redoc/`, `/api/schema/` открываются и показывают реальные эндпоинты
- [ ] Чеклист §70 брифа (47 пунктов) прогнан целиком; результат — таблица «пункт → проверено
      чем / не выполнено почему» — записывается в отчёт Phase 8 ai-radar, не в README
- [ ] `pytest` (весь набор, все таски 02–04) — зелёный финальный прогон
- [ ] `npm run type-check` и `npm run build` во фронтенде — без ошибок
