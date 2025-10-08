import { organization, useSession } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
  loader: async () => {
    const orgs = await organization.list();

    return {
      orgs,
    };
  },
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
  ),
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  head: () => ({
    meta: [
      {
        title: "Settings",
      },
    ],
  }),
  staticData: {
    breadcrumbs: [{ order: 1, title: "Settings", to: "#", active: true }],
  },
});

function RouteComponent() {
  const { data, isPending, error } = useSession();
  const { orgs } = Route.useLoaderData();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.user) {
    return <div>Access Denied</div>;
  }

  return (
    <Center>
      <pre>
        <code>{JSON.stringify(orgs, null, 2)}</code>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </Center>
  );
}
