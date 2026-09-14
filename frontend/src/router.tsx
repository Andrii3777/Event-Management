import { createBrowserRouter, Navigate } from "react-router-dom";

import { Layout } from "./components/Layout";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EditEventPage } from "./pages/EditEventPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventsPage } from "./pages/EventsPage";
import { LoginPage } from "./pages/LoginPage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SignUpPage } from "./pages/RegisterPage";
import { RequireAuth } from "./routes/RequireAuth";

// /events and /events/:id stay public: guests see the list
// and event details with no RequireAuth. RequireAuth guards
// /events/create, /events/:id/edit and /my-events.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/events" replace /> },
      {
        path: "login",
        element: (
          <>
            <EventsPage />
            <LoginPage />
          </>
        ),
      },
      {
        path: "signup",
        element: (
          <>
            <EventsPage />
            <SignUpPage />
          </>
        ),
      },
      { path: "register", element: <Navigate to="/signup" replace /> },
      {
        path: "events",
        element: <EventsPage />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              { path: "create", element: <CreateEventPage /> },
              { path: ":id/edit", element: <EditEventPage /> },
            ],
          },
          { path: ":id", element: <EventDetailsPage /> },
        ],
      },
      {
        path: "my-events",
        element: (
          <RequireAuth>
            <MyEventsPage />
          </RequireAuth>
        ),
        children: [
          { path: ":id/edit", element: <EditEventPage /> },
          { path: ":id", element: <EventDetailsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
