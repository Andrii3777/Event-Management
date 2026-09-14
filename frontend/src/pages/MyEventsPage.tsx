import { Outlet, useSearchParams } from "react-router-dom";

import { RegistrationButton } from "../components/RegistrationButton";
import { useMe } from "../features/auth/hooks";
import { EventsList } from "../features/events/EventsList";

const TABS = [
  { key: "joined", label: "Joined" },
  { key: "organizing", label: "Organizing" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function MyEventsPage() {
  const { data: user } = useMe();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: TabKey = tabParam === "organizing" ? "organizing" : "joined";
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
    return null;
  }

  const params = tab === "organizing" ? { organizer: String(user.id) } : { joined: "true" };

  return (
    <div className="relative flex-1 flex flex-col justify-between min-h-0 gap-2.5 sm:gap-3">
      {/* Top Header Area & Tabs - pinned to top */}
      <div className="shrink-0 space-y-2 sm:space-y-2.5">
        <div className="relative flex flex-col justify-between gap-2 sm:flex-row sm:items-end min-w-0">
          <div className="min-w-0 flex-1 pr-0 lg:pr-36">
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              MY EVENTS
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
              My events
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 leading-snug">
              Events you've joined or are organizing.
            </p>
          </div>

          {/* Decorative Script Accent from Reference */}
          <div className="pointer-events-none hidden select-none text-right font-script text-lg leading-tight text-blue-500/35 -rotate-6 lg:block shrink-0 self-start">
            <div>Good events</div>
            <div>bring great people</div>
          </div>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center min-w-0">
          <div className="inline-flex rounded-xl border border-white/80 bg-white/75 p-1 shadow-xs backdrop-blur-md min-w-0">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`min-h-[34px] h-8.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List fills remaining space, anchoring cards to top and pagination to bottom */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <EventsList
          params={params}
          page={page}
          onPageChange={setPage}
          renderCardAction={(event) =>
            tab === "joined" ? (
              <RegistrationButton event={event} user={user} size="sm" />
            ) : undefined
          }
          emptyMessage={
            tab === "organizing"
              ? "You are not organizing any events yet."
              : "You have not joined any events yet."
          }
        />
      </div>

      {/* Outlet for modal popups over my events */}
      <Outlet />
    </div>
  );
}

