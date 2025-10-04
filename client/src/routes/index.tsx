import { createFileRoute } from "@tanstack/react-router";
import { Button, Divider, Group, Paper, Text } from "@mantine/core";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className=" gap-3 i  h-screen">
      <Text>heheh</Text>
      <p className="text-blue-600/100 dark:text-cyan-400/100">
        The quick brown fox...
      </p>
      <Group>
        <Button>Dashboard</Button>
        <Button radius="sm">Dashboard</Button>
        <Button radius="md">Dashboard</Button>
        <Button radius="lg">Dashboard</Button>
        <Button radius="xl">Dashboard</Button>
      </Group>
      <Divider my="sm" />

      <div className="p-5">
        <Paper p={50} withBorder>
          <Text>This is a paper component from Mantine</Text>
        </Paper>
      </div>
    </div>
  );
}

export default Index;
