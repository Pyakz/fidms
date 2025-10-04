import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/fogot-password"!</div>;
}
