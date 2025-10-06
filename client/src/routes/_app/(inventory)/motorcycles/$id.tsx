import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(inventory)/motorcycles/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_app/(inventory)/motorcycles/$id",
  });

  return <div>{id}</div>;
}
