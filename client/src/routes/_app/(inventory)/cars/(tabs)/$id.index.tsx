import Counter from "@/components/Counter";
import { Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/cars/(tabs)/$id/")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 5000));
    return null;
  },
  pendingComponent: () => (
    <div>
      Loading Details...
      <Counter />
    </div>
  ),
});

function RouteComponent() {
  return (
    <Paper withBorder p="md">
      Details
    </Paper>
  );
}
