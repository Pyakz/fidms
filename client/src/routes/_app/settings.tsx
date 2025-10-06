import { useSession } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Center, Loader } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
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
});

function RouteComponent() {
  const { data, isPending, error } = useSession();

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
        <code>{JSON.stringify(data?.user, null, 2)}</code>
      </pre>
    </Center>
  );
}
