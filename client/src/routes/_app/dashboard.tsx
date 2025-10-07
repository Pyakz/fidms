import { useSession } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Card, Center, Loader, Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 2000));
    return null;
  },
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
    <div className="grid grid-cols-4 gap-3">
      <div className="border-2 light:border-indigo-600 h-23 dark:bg-red-100">
        2
      </div>
      <div className="border-2 dark:rounded-md dark:border-indigo-600 h-23">
        3
      </div>
      <div className="border-4 dark:rounded-md dark:border-indigo-600 h-23">
        4
      </div>
      <div className="border-8 dark:rounded-md dark:border-indigo-600 h-23">
        5
      </div>
      <Paper
        withBorder
        className="col-span-1 h-36 p-3 bg-orange-100 text-orange-500"
      >
        Paper
      </Paper>
      <Card className="bg-red-500">
        <div className="h-36 p-3">Card</div>
      </Card>
      <Paper withBorder className="col-span-1 h-36 p-3 text-red-400">
        Paper
      </Paper>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
    </div>
  );
}
