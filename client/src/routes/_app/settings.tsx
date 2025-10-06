import { useSession } from "@/lib/auth";
import { Center } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((r) => setTimeout(r, 3000));
    return null;
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
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
