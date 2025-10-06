import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_app/(branches)/branches/$id",
  });

  return <div>{id}</div>;
}
