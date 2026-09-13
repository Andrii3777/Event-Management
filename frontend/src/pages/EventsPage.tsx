import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../components/Button";
import { useMe } from "../features/auth/hooks";
import { EventsList } from "../features/events/EventsList";

const ORDERING_OPTIONS = [
  { value: "date", label: "Date (soonest first)" },
  { value: "-date", label: "Date (latest first)" },
  { value: "created_at", label: "Recently added" },
  { value: "-created_at", label: "Newly added" },
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
];

// Search, filters, sort and page all live in the URL (query params) so the
// list is shareable and the browser back button works as expected.
export function EventsPage() {
  const { data: user } = useMe();
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
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Events</h1>
        {user && (
          <div className="flex gap-3">
            <Link to="/my-events" className="text-sm font-medium text-blue-600 hover:text-blue-800 self-center">
              My events
            </Link>
            <Link to="/events/create">
              <Button>Create event</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          placeholder="Search events"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="City"
          value={location}
          onChange={(e) => updateParam("location", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          aria-label="From date"
          value={dateAfter}
          onChange={(e) => updateParam("date_after", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          aria-label="To date"
          value={dateBefore}
          onChange={(e) => updateParam("date_before", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          aria-label="Sort by"
          value={ordering}
          onChange={(e) => updateParam("ordering", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ORDERING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <EventsList
          params={{ search, location, date_after: dateAfter, date_before: dateBefore, ordering }}
          page={page}
          onPageChange={setPage}
          emptyMessage="No events match your search."
          onResetFilters={hasFilters ? () => setSearchParams({}) : undefined}
        />
      </div>
    </div>
  );
}
