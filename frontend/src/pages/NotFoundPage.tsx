import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-sm text-center">
      <h1 className="text-xl font-semibold text-gray-900">Page not found</h1>
      <Link to="/events" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
        Back to events
      </Link>
    </div>
  );
}
