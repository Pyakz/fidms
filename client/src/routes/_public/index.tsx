import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionQuery } from "@/lib/queryOptions";

export const Route = createFileRoute("/_public/")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    throw redirect({
      to: session.data?.user ? "/dashboard" : "/sign-in",
    });
  },
  component: () => (
    <>
      Home Page will not be accessible, since its either login page or dashboard
    </>
  ),
});
