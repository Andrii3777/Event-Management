import { Link, useNavigate } from "react-router-dom";

import { useLogout, useMe } from "../features/auth/hooks";
import { CalendarIcon, LogOutIcon, UserIcon } from "./icons";

export function Navbar() {
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <nav className="flex items-center justify-between gap-2 rounded-2xl border border-white/80 bg-white/80 px-3.5 py-2 shadow-xs backdrop-blur-md transition-all sm:px-5 sm:py-2.5">
      {/* Brand */}
      <Link
        to="/events"
        className="group flex min-w-0 shrink items-center gap-2 font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20 sm:h-9 sm:w-9">
          <CalendarIcon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
        </div>
        <span className="truncate text-sm font-bold text-slate-900 sm:text-lg">
          Event Management
        </span>
      </Link>

      {/* Nav Controls */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {user ? (
          <>
            <Link
              to="/my-events"
              className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600 sm:px-2.5 sm:text-sm"
            >
              My events
            </Link>

            <Link
              to="/events/create"
              className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 sm:px-3.5 sm:py-2 sm:text-sm"
            >
              <span className="hidden xs:inline">+</span>
              <span>Create</span>
              <span className="hidden sm:inline">event</span>
            </Link>

            <div className="hidden h-4 w-px bg-slate-200/80 md:block" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50/80 px-2 py-1 text-xs font-medium text-slate-700 sm:px-2.5 sm:text-sm"
                title={user.username}
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 sm:h-5 sm:w-5">
                  <UserIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
                <span className="max-w-[70px] truncate xs:max-w-[100px] sm:max-w-[140px]">
                  {user.username}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="flex min-h-[36px] items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 sm:px-2.5 sm:text-sm"
                title="Log out"
                aria-label="Log out"
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-blue-600 sm:px-3 sm:text-sm"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="min-h-[36px] inline-flex items-center rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

