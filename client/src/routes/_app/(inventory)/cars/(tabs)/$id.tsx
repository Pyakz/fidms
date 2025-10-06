import AppLink from "@/components/AppLink";
import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Group, Loader, Paper } from "@mantine/core";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/cars/(tabs)/$id")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 5000));
    return null;
  },
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
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
      <Group gap={2} className=" w-full">
        <AppLink
          to="/cars/$id"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Details"
          variant="filled"
          activeOptions={{ exact: true }}
          className="rounded"
        />

        <AppLink
          to="/cars/$id/gallery"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Gallery"
          variant="filled"
          activeOptions={{ exact: true }}
          className="rounded"
        />
        <AppLink
          to="/cars/$id/service-history"
          params={{ id: id }}
          preload="intent"
          w="auto"
          label="Service History"
          variant="filled"
          activeOptions={{ exact: true }}
          className="rounded"
        />
      </Group>
      <Outlet />
    </div>
  );
}
