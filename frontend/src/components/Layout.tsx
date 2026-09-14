import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen overflow-x-hidden bg-slate-100 flex flex-col justify-between">
      {/* Pinned background layer with ambient blur & frosted mist */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ backgroundImage: `url('/background.jpg')` }}
      />
      {/* Frosted ethereal veil over background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-blue-100/75 via-sky-50/85 to-indigo-100/80 backdrop-blur-[45px]" />

      {/* Main content surface */}
      <div className="relative z-10 flex min-h-screen lg:h-screen lg:max-h-screen flex-col justify-between overflow-y-auto lg:overflow-hidden">
        <header className="sticky top-0 z-20 pt-2.5 sm:pt-3 px-4 sm:px-6 shrink-0">
          <div className="mx-auto max-w-6xl">
            <Navbar />
          </div>
        </header>

        <main className="mx-auto max-w-6xl w-full flex-1 px-4 py-2 sm:px-6 sm:py-3 min-h-0 flex flex-col">
          <Outlet />
        </main>

        <footer className="relative z-10 border-t border-white/50 bg-white/40 backdrop-blur-md py-2 sm:py-2.5 px-4 sm:px-6 shrink-0">
          <div className="mx-auto max-w-6xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Event Management</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>Small events. Big connections.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-script text-sm sm:text-base text-blue-600/70">Build your next story</span>
              <div className="h-0.5 w-8 rounded-full bg-blue-400/40" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

