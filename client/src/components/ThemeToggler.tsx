import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

function ThemeToggler() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      aria-label="Toggle color scheme"
      size="lg"
    >
      {computedColorScheme === "light" ? (
        <IconMoon size={20} stroke={1.5} />
      ) : (
        <IconSun size={20} stroke={1.5} />
      )}
    </ActionIcon>
  );
}

export default ThemeToggler;
