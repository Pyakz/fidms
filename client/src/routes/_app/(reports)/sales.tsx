import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(reports)/sales")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
  },
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
  ),
});

function RouteComponent() {
  return <div>Hello "/_app/(reports)/sales"!</div>;
}
