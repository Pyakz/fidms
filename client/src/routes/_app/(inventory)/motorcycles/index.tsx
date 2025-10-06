import Counter from "@/components/Counter";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/motorcycles/")({
  component: RouteComponent,
  // simulate 3 seconds of loading time
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
  },
  pendingComponent: () => (
    <div>
      Loading motorcycles...
      <Counter />
    </div>
  ),
});

function RouteComponent() {
  return (
    <div>
      <Link to="/motorcycles/$id" params={{ id: "123" }} preload="intent">
        Vehicle 1
      </Link>
      <br />
      <Link to="/motorcycles/$id" params={{ id: "456" }} preload="intent">
        Vehicle 2
      </Link>
    </div>
  );
}
