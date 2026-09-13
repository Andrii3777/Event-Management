# 03 — События: модель, CRUD, права, фильтры, производительность

**Требования:** R02, R03, R04, R05, R07, R08, R09, R10, R11, R17, R52, R56, R73, R75, R76, R77,
R78, R81, R82, R86, R87, R89, R90, R91, R92, R93, R94, R95, R96, R97, R98, R129, R131, R150i,
R154i

**Blocked by:** 02
**Зона:** `backend/apps/events/`
**Волна:** 3 (параллельно с 06)
**Status:** ready

## Что должно заработать

Любой посетитель видит список событий, ищет и фильтрует его без входа. Аутентифицированный
пользователь создаёт событие — организатором становится он сам, подделать это поле нельзя.
Править и удалять может только организатор; попытка чужого — 403, а не «как будто ничего не
произошло». Список пагинирован, отсортирован детерминированно, не создаёт N+1 запросов и
показывает, сколько человек записано и записан ли текущий пользователь — без дополнительного
запроса на строку.

Это Phase 3 и Phase 5 из §68 брифа: «Event model; serializers; ViewSet; permissions; CRUD» и
«django-filter; search; ordering; pagination».

## Из брифа, дословно

> «The organizer must be derived from the authenticated user... Do not allow clients to create
> events on behalf of another user by submitting an arbitrary organizer ID.» (§9)

> «Update — Only the event organizer. Delete — Only the event organizer... Security must be
> enforced on the backend even if the frontend hides buttons.» (§23)

> «Do not use URLs such as: /createEvent /deleteEvent /getEvents /registerUser» (§22)

> «Event lists must be paginated... Do not return unlimited collections.» (§28)

> «Avoid N+1 queries. Use `select_related()` for appropriate ForeignKey/OneToOne relationships...
> organizer data will likely justify `select_related("organizer")`.» (§29)

> «Add indexes based on actual query patterns. Potential candidates include: Event.date
> Event.location... Do not index every field.» (§30)

## Решено в брифинге

Дата события при создании — только будущее (400 на прошлое); правка описания уже прошедшего
события разрешена, смена его даты на прошлое — нет (пользователь: «Создание — только будущее»).

## Разделы спецификации

Истории 16–28, 36, §3 (модель `Event`), §6 (контракты API событий), §7 (коды ошибок), §8
(фильтры/поиск/сортировка/пагинация).

## Критерии приёмки

- [ ] `Event`: `title`, `description`, `date` (индекс), `location` (индекс), `organizer` (FK на
      User, `on_delete=CASCADE`), `created_at`, `updated_at`, `Meta.ordering = ["date", "id"]`
- [ ] `EventViewSet(ModelViewSet)`, `http_method_names` без `put` (только `get`, `post`, `patch`,
      `delete`); маршруты `/api/v1/events/` и `/api/v1/events/{id}/`
- [ ] `EventWriteSerializer` (`title, description, date, location`) не содержит поле `organizer`
      вообще; `perform_create` подставляет `request.user`
- [ ] `EventSerializer` (чтение): `id, title, description, date, location, organizer{id,username},
      created_at, updated_at`. **`registrations_count` и `is_registered` сюда НЕ входят** — они
      физически не могут существовать до модели `EventRegistration`; закрывает их таск 04
      (см. D01 в `manifest.md` и в этом же разделе спецификации, §6)
- [ ] `list`/`retrieve` — `AllowAny`; `create` — `IsAuthenticated`; `update`/`destroy` —
      `IsAuthenticated` + объектный `IsOrganizerOrReadOnly`
- [ ] Создание с датой в прошлом → 400; PATCH прошедшего события без смены `date` → 200; смена
      `date` на прошлое → 400
- [ ] Чужое событие: PATCH/DELETE → 403 (не 404), при этом GET того же события → 200
- [ ] Несуществующее событие → 404 (не 500)
- [ ] `EventFilter`: `location` (`icontains`), `date_after`/`date_before` (`gte`/`lte` по `date`);
      `search` по `title`, `description`, `location`; `ordering` — `date`, `created_at`, `title`
      (обе стороны), по умолчанию `date`
- [ ] Пагинация `PageNumberPagination`, `page_size=10`, параметр `page_size` до 100, ответ
      `{count, next, previous, results}`
- [ ] `select_related("organizer")` на queryset списка; тест `django_assert_num_queries`
      подтверждает константное число запросов независимо от количества событий в списке
- [ ] Тесты (`apps/events/tests/`): список анониму → 200 · создание анониму → 401 · создание
      аутентифицированному → 201, `organizer` = текущий пользователь · подсунутый `organizer` в
      теле игнорируется · дата в прошлом → 400 · retrieve → 200 · retrieve несуществующего → 404 ·
      PATCH своего → 200 · PATCH чужого → 403 · DELETE своего → 204 · DELETE чужого → 403 · `PUT`
      → 405 · поиск по каждому из трёх полей · фильтр `location` регистронезависимо ·
      `date_after`/`date_before` · `ordering=date` и `ordering=-date` · вторая страница
      пагинации · число запросов константно
