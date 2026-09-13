# 06 — Фронтенд: каркас, вход, регистрация, макет

**Требования:** R20, R21, R23, R24, R37, R38, R39, R40, R41, R42, R115, R118, R119, R120, R121,
R122, R123, R124, R125(часть — формы входа/регистрации), R126, R127

**Blocked by:** 02
**Зона:** `frontend/src/` — всё, кроме `frontend/src/features/events/` и
`frontend/src/pages/Events*.tsx` (их занимает таск 07)
**Волна:** 3 (параллельно с 03)
**Status:** ready

## Что должно заработать

Приложение открывается, показывает вход и регистрацию, держит сессию через `/auth/me/`, не
роняет пользователя каждые десять минут (тихий refresh в фоне) и не пускает на защищённые
маршруты без входа. Базовые компоненты (кнопка, поле ввода, состояния загрузки/ошибки/пустоты,
навигация) готовы и переиспользуются везде, включая таск 07. Маршрут `/events` в этом таске
существует, но его содержимое — таск 07; здесь достаточно, чтобы роутинг и защита маршрутов
работали.

Начало Phase 9 из §68 брифа: «React; TypeScript; Vite; Tailwind CSS; routing; authentication.»

## Из брифа, дословно

> «Because JWTs are stored in HttpOnly cookies, frontend code must not manually read them.» (§49)

> «Use TanStack Query for server state... Do not store server responses in Redux, Zustand, or a
> global Context.» (§48)

> «Do not add a large UI framework such as: Material UI; Bootstrap... Do not introduce shadcn/ui
> or another component library unless an actual implementation need appears.» (§46)

> «Pages/components should not contain large amounts of raw Axios request logic.» (§53)

## Разделы спецификации

Истории 5–15 (со стороны клиента), 54, 56–60, 62–64, §14 (фронтенд целиком, кроме частей,
специфичных для событий/записей).

## Критерии приёмки

- [ ] Vite + React + TypeScript + Tailwind настроены и собираются (`npm run build` без ошибок,
      `npm run type-check` без ошибок)
- [ ] `api/client.ts` — единый axios-инстанс: `baseURL=/api/v1`, `withCredentials: true`,
      `xsrfCookieName: "csrftoken"`, `xsrfHeaderName: "X-CSRFToken"`; вызывает `GET /auth/csrf/`
      один раз при старте приложения
- [ ] Интерсептор ответа: на 401 (кроме самого запроса к `/auth/token/refresh/`) — один общий
      refresh на все ожидающие в этот момент запросы (single-flight — не пять параллельных
      refresh при пяти параллельных 401), затем повтор исходных запросов; если refresh тоже
      получил 401 — `queryClient.clear()` и переход на `/login`, исходный запрос не повторяется
- [ ] `useMe()` — хук на `GET /auth/me/` через TanStack Query; на его основе работает
      `RequireAuth`, оборачивающий защищённые маршруты и уводящий анонима на `/login`
- [ ] React Router: маршруты `/login`, `/register`, `/events` (заглушка), `*` → «не найдено»;
      `createBrowserRouter`
- [ ] Формы входа и регистрации — React Hook Form + Zod (`zodResolver`); ошибки полей с сервера
      (400 от DRF) раскладываются в `setError`; форма не очищается при ошибке отправки
- [ ] После успешного входа — редирект на `/events` (или туда, откуда пришли, если был
      редирект из `RequireAuth`)
- [ ] Компоненты: `Navbar` (показывает вход/выход в зависимости от `useMe()`), `Button`, `Input`,
      `Textarea`, `LoadingState`, `ErrorState` (с кнопкой «повторить»), `EmptyState`,
      `ConfirmDialog`
- [ ] Адаптив: одноколоночная раскладка до `sm`, навигация сворачивается на мобильном
- [ ] Типы — `features/auth/types.ts` (`User`, запросы/ответы входа и регистрации); ни один тип
      не задублирован в компонентах
- [ ] Запросы к API — только в `features/auth/api.ts` и `features/auth/hooks.ts`; ни один
      компонент/страница не вызывает `axios`/`api` напрямую
