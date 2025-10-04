import { useSession } from "@/lib/auth";
import { Center } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile")({
  component: RouteComponent,
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
    <Center className="h-screen">
      <pre>
        <code>{JSON.stringify(data?.user, null, 2)}</code>
      </pre>
    </Center>
  );
}
