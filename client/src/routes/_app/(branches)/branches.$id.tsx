import { organization } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/$id")({
  component: RouteComponent,
  loader: async () => {
    const org = await organization.getFullOrganization({
      
    });
    return { org };
  },
});

function RouteComponent() {
  const { org } = Route.useLoaderData();

  return (
    <div>
      <pre>{JSON.stringify(org, null, 2)}</pre>
    </div>
  );
}
