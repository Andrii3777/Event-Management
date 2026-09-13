import { useSearchParams } from "react-router-dom";

import { useMe } from "../features/auth/hooks";
import { EventsList } from "../features/events/EventsList";

const TABS = [
  { key: "registered", label: "Registered" },
  { key: "organizing", label: "Organizing" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Same event list as EventsPage, just filtered by ?registered=true or
// ?organizer=<my id> (§8) — not a separate list component.
export function MyEventsPage() {
  const { data: user } = useMe();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: TabKey = searchParams.get("tab") === "organizing" ? "organizing" : "registered";
  const page = Number(searchParams.get("page") ?? "1");

  function setTab(nextTab: TabKey) {
    setSearchParams({ tab: nextTab });
  }

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      next.set("page", String(nextPage));
      return next;
    });
  }

  if (!user) {
    // RequireAuth redirects anonymous visitors before this renders; this only
    // covers the brief window while useMe() is still loading.
    return null;
  }

  const params = tab === "organizing" ? { organizer: String(user.id) } : { registered: "true" };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900">My events</h1>
      <div className="mt-4 flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium ${
              tab === t.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <EventsList
          params={params}
          page={page}
          onPageChange={setPage}
          emptyMessage={
            tab === "organizing"
              ? "You are not organizing any events yet."
              : "You are not registered for any events yet."
          }
        />
      </div>
    </div>
  );
}
