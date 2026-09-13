# 07 — Фронтенд: события и записи

**Требования:** R22, R116, R117, R125(часть — формы событий), R154i(отображение)

**Blocked by:** 06, 04
**Зона:** `frontend/src/features/events/`, `frontend/src/pages/EventsPage.tsx`,
`frontend/src/pages/EventDetailsPage.tsx`, `frontend/src/pages/CreateEventPage.tsx`,
`frontend/src/pages/EditEventPage.tsx`, `frontend/src/pages/MyEventsPage.tsx`,
`frontend/src/components/` (`EventCard`, `EventForm`, `Pagination`)
**Волна:** 5 (параллельно с 05)
**Status:** ready

## Что должно заработать

Пользователь видит список событий с поиском, фильтрами и пагинацией; открывает карточку с
деталями, видит, сколько человек записано и записан ли он сам; записывается и отменяет запись
одной кнопкой; создаёт, правит и удаляет свои события. `/my-events` показывает в двух вкладках —
куда он записан и что организует. Каждое состояние (загрузка, ошибка, пусто) видно на экране.

Основная часть Phase 9 из §68 брифа — «event list; details; forms; registration» — и весь
пользовательский путь из §45 брифа одним проходом.

## Из брифа, дословно

> «Implement: ...event list; event search; event filtering; pagination; event details; event
> registration; registration cancellation; event creation; event editing; event deletion; loading
> states; error states; empty states; responsive layout.» (§45)

> «Again, route protection in React is only a UX mechanism. Backend permissions are the actual
> security boundary.» (§52)

## Решено в брифинге

`/my-events` — делаем, две вкладки (пользователь: «Делаем»).

## Разделы спецификации

Истории 16–37 (со стороны клиента), 45–53, 55–64, §8 (использование фильтров `organizer`,
`registered`), §14.

## Критерии приёмки

- [ ] `EventsPage`: список карточек, поиск с debounce 300 мс, фильтры (город, диапазон дат),
      сортировка, пагинация — состояние всего этого живёт в query-параметрах URL (ссылку можно
      переслать, кнопка «назад» браузера работает)
- [ ] Пустой результат поиска/фильтра — `EmptyState` с кнопкой сброса фильтров, а не пустой экран
- [ ] `EventCard` показывает `registrations_count` и кнопку «записаться»/«отменить запись» в
      зависимости от `is_registered`, без лишнего запроса на карточку
- [ ] `EventDetailsPage`: полная информация, кнопка записи/отмены с оптимистичным обновлением
      или явным `invalidateQueries` после мутации
- [ ] `CreateEventPage`/`EditEventPage`: `EventForm` на React Hook Form + Zod; дата в прошлом —
      ошибка на клиенте до отправки; серверная ошибка (400) раскладывается в поля формы; форма не
      теряет введённый текст при ошибке
- [ ] `DELETE` события — через `ConfirmDialog`, не по одному клику
- [ ] `MyEventsPage`: вкладка «куда записан» — `?registered=true`; вкладка «что организую» —
      `?organizer=<id текущего пользователя>`; обе используют тот же список событий с другим
      фильтром, не отдельный компонент
- [ ] `/events/create`, `/events/:id/edit`, `/my-events` защищены `RequireAuth` из таска 06
- [ ] Адаптив: сетка карточек одна колонка на мобильном, от `md` — несколько
- [ ] Инвалидация кэша TanStack Query после любой мутации (создание/правка/удаление события,
      запись/отмена) — список обновляется без ручного релоада страницы
- [ ] Запросы — только в `features/events/api.ts` и `features/events/hooks.ts`
      (`useEvents`, `useEvent`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`,
      `useRegister`, `useCancelRegistration`); ни один компонент не вызывает `axios` напрямую
- [ ] Полный путь проходим руками: регистрация → вход → список → поиск → карточка → запись →
      отмена → создание → правка → удаление, без ручного ввода URL на любом шаге
