import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Alert, Center, Loader } from "@mantine/core";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
  errorComponent: ({ error }) => (
    <Center className="h-screen">
      <Alert variant="light" color="rgba(255, 0, 0, 1)" title="Error">
        {error.message}
      </Alert>
    </Center>
  ),
  head: () => ({
    meta: [
      {
        title: "FIDMS",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <TanStackDevtools
        eventBusConfig={{ debug: true }}
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
          },
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
