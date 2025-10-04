import { createFileRoute } from "@tanstack/react-router";
import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Switch,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

import { IconCheck, IconMoon, IconSun } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <div className=" gap-3 i  h-screen">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="xl"
        radius="md"
        aria-label="Toggle color scheme"
      >
        <IconSun stroke={1.5} />
        <IconMoon stroke={1.5} />
      </ActionIcon>
      <Text>heheh</Text>
      <p className="text-blue-600/100 dark:text-cyan-400/100">
        The quick brown fox...
      </p>
      <Center>
        <Group>
          <Button>Default</Button>
          <Button
            radius="sm"
            onClick={() => {
              notifications.show({
                title: "Default notification",
                message: "Hey there, your code is awesome! 🤥",
                icon: <IconCheck />,
                autoClose: 5000,
                onClose: () => console.log("Notification closed"),
                onOpen: () => console.log("Notification opened"),
                position: "bottom-center",
              });
            }}
          >
            SM Radius
          </Button>
          <Button radius="md">MD Radius</Button>
          <Button radius="lg">LG Radius</Button>
          <Button radius="xl">XL Radius</Button>
        </Group>
      </Center>
      <Center>
        <Switch.Group
          defaultValue={["react"]}
          label="Select your favorite framework/library"
          description="This is anonymous"
          withAsterisk
        >
          <Group mt="xs">
            <Switch
              value="react"
              label="React"
              size="lg"
              offLabel="No"
              onLabel="yes"
            />
            <Switch
              value="svelte"
              label="Svelte"
              size="lg"
              offLabel="No"
              onLabel="yes"
            />
            <Switch
              value="ng"
              label="Angular"
              size="lg"
              offLabel="No"
              onLabel="yes"
            />
            <Switch
              value="vue"
              label="Vue"
              size="lg"
              offLabel="No"
              onLabel="yes"
            />
          </Group>
        </Switch.Group>
      </Center>
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
