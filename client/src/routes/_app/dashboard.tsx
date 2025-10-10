import { useSession } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader, Paper } from "@mantine/core";
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
    <div className="">
      <Paper withBorder>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    </div>
  );
}
