import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/inventory/motorcycles")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/inventory/motorcycles"!</div>;
}
