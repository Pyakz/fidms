import { getLastUsedLoginMethod, useSession } from "@/lib/auth";
import { Center, Paper, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
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
  const lastMethod = getLastUsedLoginMethod();
  return (
    <Center className="h-screen">
      <Paper withBorder shadow="md" p="md" mt="md">
        <Text>Last login method: {lastMethod ?? "unknown"}</Text>
        <pre>
          <code>{JSON.stringify(data?.user, null, 2)}</code>
        </pre>
      </Paper>
    </Center>
  );
}
