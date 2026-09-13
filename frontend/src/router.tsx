import { createBrowserRouter, Navigate } from "react-router-dom";

import { Layout } from "./components/Layout";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EditEventPage } from "./pages/EditEventPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventsPage } from "./pages/EventsPage";
import { LoginPage } from "./pages/LoginPage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequireAuth } from "./routes/RequireAuth";

// /events and /events/:id stay public (R76/history 16: guests see the list
// and event details with no RequireAuth). RequireAuth guards
// /events/create, /events/:id/edit and /my-events (R126).
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/events" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:id", element: <EventDetailsPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "events/create", element: <CreateEventPage /> },
          { path: "events/:id/edit", element: <EditEventPage /> },
          { path: "my-events", element: <MyEventsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
