import Counter from "@/components/Counter";
import { Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/(inventory)/cars/(tabs)/$id/gallery"
)({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 5000));
    return null;
  },
  pendingComponent: () => (
    <div>
      Loading Gallery...
      <Counter />
    </div>
  ),
  head: () => ({
    meta: [
      {
        title: "Gallery",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <Paper withBorder p="md">
      Gallery
    </Paper>
  );
}
