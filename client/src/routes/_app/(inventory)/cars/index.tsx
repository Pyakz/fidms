import Counter from "@/components/Counter";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/cars/")({
  component: RouteComponent,
  // simulate 3 seconds of loading time
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
  },
  pendingComponent: () => (
    <div>
      Loading cars...
      <Counter />
    </div>
  ),
});

function RouteComponent() {
  return (
    <div>
      {Array.from({ length: 20 }).map((_, i) => (
        <Link
          to="/cars/$id"
          params={{ id: `${i}` }}
          preload="intent"
          key={i}
          className="block"
        >
          Car {i}
        </Link>
      ))}
    </div>
  );
}
