import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/welcome"!</div>;
}
