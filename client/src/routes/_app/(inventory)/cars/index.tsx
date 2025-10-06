import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/cars/")({
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
  return (
    <div>
      {Array.from({ length: 20 }).map((_, i) => (
        <Link
          key={i}
          to="/cars/$id"
          params={{ id: `${i}` }}
          preload="intent"
          className="block"
        >
          Car {i}
        </Link>
      ))}
    </div>
  );
}
