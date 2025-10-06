import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/")({
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
  head: () => ({ meta: [{ title: "Branches" }] }),
});

function RouteComponent() {
  return (
    <div>
      <Link to="/branches/$id" params={{ id: "1" }} preload="intent">
        Branch 1
      </Link>
      <br />
      <Link to="/branches/$id" params={{ id: "2" }} preload="intent">
        Branch 2
      </Link>
    </div>
  );
}
