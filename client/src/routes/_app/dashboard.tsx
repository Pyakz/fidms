import { useSession } from "@/lib/auth";
import { Avatar, Center, Group, Paper, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
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
  return (
    <Center className="h-screen">
      <Paper withBorder p={10}>
        <Group gap={8}>
          <Avatar
            src={data.user.image ?? undefined}
            name={data.user.name ?? undefined}
            alt={data.user.name ?? undefined}
            radius={2}
          />

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Harriette Spoonlicker
            </Text>

            <Text c="dimmed" size="xs">
              hspoonlicker@outlook.com
            </Text>
          </div>

          <IconChevronRight size={14} stroke={1.5} />
        </Group>
      </Paper>
    </Center>
  );
}
