import { sessionQuery } from "@/lib/queryOptions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: Outlet,
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (session.data?.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
    return { session };
  },
});
