import { sessionQuery } from "@/lib/queryOptions";
import { Center, Loader } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: Outlet,
  beforeLoad: async ({ context: { queryClient } }) => {
    // throw Error("This route should not be loaded directly");
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (session.data?.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
    return { session };
  },
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
});
