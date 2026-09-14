import { Link } from "react-router-dom";

import { Button } from "../components/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="mx-auto max-w-sm w-full rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl">
        <span className="text-4xl font-extrabold text-blue-600">404</span>
        <h1 className="mt-2 text-lg font-bold text-slate-900">Page not found</h1>
        <p className="mt-1 text-xs text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/events" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            Back to events
          </Button>
        </Link>
      </div>
    </div>
  );
}

