import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import "./styles/index.css";
import "./styles/theme.css";

import MantineProvider from "./providers/Mantine";
import { ColorSchemeScript } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";

const queryClient = new QueryClient();
// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingMs: 100,
});

router.subscribe("onBeforeLoad", ({ fromLocation, pathChanged }) => {
  if (fromLocation && pathChanged) {
    nprogress.start();
  }
});
router.subscribe("onLoad", () => nprogress.complete());
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  );
}

// Render the app
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider>
        <NavigationProgress />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </MantineProvider>
    </StrictMode>
  );
}
