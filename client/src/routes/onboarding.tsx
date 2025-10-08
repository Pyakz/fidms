import { sessionQuery } from "@/lib/queryOptions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
  beforeLoad: async ({ location, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (!session.data?.user) {
      queryClient.clear();
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href, // save current location for after login
        },
      });
    }

    return { session };
  },
});

function RouteComponent() {
  return <div>Hello "/_app/onboarding"!</div>;
}
