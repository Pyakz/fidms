import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/")({
  component: RouteComponent,
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
