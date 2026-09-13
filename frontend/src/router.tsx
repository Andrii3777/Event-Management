import { createBrowserRouter, Navigate } from "react-router-dom";

import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";

// /events content is ticket 07's scope — this route is a public placeholder
// (R76/history 16: the events list is visible to guests, no RequireAuth
// here). RequireAuth itself is ready in ./routes/RequireAuth for ticket 07
// to apply to /events/create and /events/:id/edit.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/events" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "events", element: <div>Events (скоро)</div> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
