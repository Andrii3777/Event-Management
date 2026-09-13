import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { primeCsrf } from "./api/client";
import { queryClient } from "./api/queryClient";
import { router } from "./router";

// Fetch the csrftoken cookie once before any unsafe request needs it (R70.1).
void primeCsrf();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
