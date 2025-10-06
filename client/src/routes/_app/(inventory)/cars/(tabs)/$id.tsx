import AppLink from "@/components/AppLink";
import Counter from "@/components/Counter";
import { Group, Paper } from "@mantine/core";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/cars/(tabs)/$id")({
  component: RouteComponent,

  loader: async () => {
    await new Promise((r) => setTimeout(r, 5000));
    return null;
  },

  pendingComponent: () => (
    <div>
      Loading Layout...
      <Counter />
    </div>
  ),
  errorComponent: ({ error }) => <div>Error: {String(error)}</div>,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <div className="space-y-4">
      <Paper withBorder p="md">
        Upper Layout
      </Paper>
      <Group>
        <AppLink
          to="/cars/$id"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Details"
          variant="filled"
        />
        <AppLink
          to="/cars/$id/gallery"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Gallery"
          variant="filled"
        />
        <AppLink
          to="/cars/$id/service-history"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Service History"
          variant="filled"
        />
      </Group>
      <Outlet />
    </div>
  );
}
