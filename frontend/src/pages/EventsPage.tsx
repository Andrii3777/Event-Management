import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { CalendarIcon, ChevronDownIcon, MapPinIcon, SearchIcon } from "../components/icons";
import { EventsList } from "../features/events/EventsList";

const ORDERING_OPTIONS = [
  { value: "date", label: "Date (soonest first)" },
  { value: "-date", label: "Date (latest first)" },
  { value: "created_at", label: "Recently added" },
  { value: "-created_at", label: "Newly added" },
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
];

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const location = searchParams.get("location") ?? "";
  const dateAfter = searchParams.get("date_after") ?? "";
  const dateBefore = searchParams.get("date_before") ?? "";
  const ordering = searchParams.get("ordering") ?? "date";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);

  // Keep the input in sync when the URL changes externally (back/forward).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce 300ms before writing the search term into the URL.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) {
        updateParam("search", searchInput);
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function updateParam(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("page");
      return next;
    });
  }

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
  }

  const hasFilters = !!(search || location || dateAfter || dateBefore);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 gap-2.5 sm:gap-3">
      {/* Top Header Area & Filters - pinned to top */}
      <div className="shrink-0 space-y-2 sm:space-y-2.5">
        {/* Hero Header Area */}
        <div className="relative flex flex-col justify-between gap-2 sm:flex-row sm:items-end min-w-0">
          <div className="min-w-0 flex-1 pr-0 lg:pr-36">
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              DISCOVER EVENTS
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
              Events
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 leading-snug">
              Find and join interesting events around you.
            </p>
          </div>

          {/* Decorative Script Accent from Reference */}
          <div className="pointer-events-none hidden select-none text-right font-script text-lg leading-tight text-blue-500/35 -rotate-6 lg:block shrink-0 self-start">
            <div>Small events.</div>
            <div>Big connections.</div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 rounded-2xl border border-white/80 bg-white/75 p-1.5 sm:p-2 shadow-xs backdrop-blur-md min-w-0">
          {/* Search Input */}
          <div className="relative flex items-center min-w-0">
            <SearchIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Search events..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-9 min-h-[36px] rounded-xl border border-transparent bg-slate-50/70 py-1.5 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100/70"
            />
          </div>

          {/* City Input */}
          <div className="relative flex items-center min-w-0">
            <MapPinIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="City"
              value={location}
              onChange={(e) => updateParam("location", e.target.value)}
              className="w-full h-9 min-h-[36px] rounded-xl border border-transparent bg-slate-50/70 py-1.5 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100/70"
            />
          </div>

          {/* Date From */}
          <div className="relative flex items-center min-w-0">
            <CalendarIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              aria-label="From date"
              value={dateAfter}
              onChange={(e) => updateParam("date_after", e.target.value)}
              className="w-full h-9 min-h-[36px] rounded-xl border border-transparent bg-slate-50/70 py-1.5 pl-8 pr-2.5 text-xs text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100/70"
            />
          </div>

          {/* Date To */}
          <div className="relative flex items-center min-w-0">
            <CalendarIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              aria-label="To date"
              value={dateBefore}
              onChange={(e) => updateParam("date_before", e.target.value)}
              className="w-full h-9 min-h-[36px] rounded-xl border border-transparent bg-slate-50/70 py-1.5 pl-8 pr-2.5 text-xs text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100/70"
            />
          </div>

          {/* Ordering Dropdown */}
          <div className="relative flex items-center min-w-0">
            <select
              aria-label="Sort by"
              value={ordering}
              onChange={(e) => updateParam("ordering", e.target.value)}
              className="w-full h-9 min-h-[36px] appearance-none rounded-xl border border-transparent bg-slate-50/70 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100/70 cursor-pointer"
            >
              {ORDERING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Events List Grid and Pagination anchored to bottom */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <EventsList
          params={{ search, location, date_after: dateAfter, date_before: dateBefore, ordering }}
          page={page}
          onPageChange={setPage}
          emptyMessage="No events match your search filters."
          onResetFilters={hasFilters ? () => setSearchParams({}) : undefined}
        />
      </div>

      {/* Outlet for modal popups over the events list */}
      <Outlet />
    </div>
  );
}

