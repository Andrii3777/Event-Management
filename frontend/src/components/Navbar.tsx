import { Link, useNavigate } from "react-router-dom";

import { useLogout, useMe } from "../features/auth/hooks";

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
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/events" className="text-lg font-semibold text-gray-900">
          Event Management
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600">{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
                Log in
              </Link>
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
