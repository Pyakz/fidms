import { useSession } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Card, Center, Loader, Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
  ),
  head: () => ({ meta: [{ title: "Dashboard - FIDMS" }] }),
  staticData: {
    breadcrumbs: [{ order: 1, title: "Dashboard", to: "#", active: true }],
  },
});

function RouteComponent() {
  const { data, isPending, error } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.user) {
    return <div>Access Denied</div>;
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Paper shadow="sm" p={25} withBorder>
          Car
        </Paper>
        <Paper shadow="sm" p={25} withBorder>
          Car
        </Paper>
        <Paper shadow="sm" p={25} withBorder>
          Car
        </Paper>
      </div>

      <Card shadow="sm">Car</Card>

      <Paper className="p-5" withBorder>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    </div>
  );
}
