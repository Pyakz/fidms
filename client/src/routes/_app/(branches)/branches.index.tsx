import { organization } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/")({
  component: RouteComponent,
  loader: async () => {
    const branches = await organization.list();
    const full = await organization.listUserInvitations();

    return { branches, full };
  },
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
  ),
  head: () => ({ meta: [{ title: "Branches" }] }),
  staticData: {
    breadcrumbs: [{ order: 1, title: "Branches", to: "#", active: true }],
  },
});

function RouteComponent() {
  const { branches, full } = Route.useLoaderData();
  return (
    <div>
      <pre>
        <code>{JSON.stringify(full, null, 2)}</code>
        {/* <code>{JSON.stringify(full, null, 2)}</code> */}
      </pre>
      {branches?.data?.map((branch) => (
        <Link
          key={branch.id}
          to="/branches/$id"
          params={{ id: branch.id }}
          preload="intent"
        >
          {branch.name}
        </Link>
      ))}
    </div>
  );
}
