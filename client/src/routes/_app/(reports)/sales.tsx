import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(reports)/sales")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
  },
});

function RouteComponent() {
  return <div>Hello "/_app/(reports)/sales"!</div>;
}
