import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";

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
      size="xl"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === "light" ? (
        <IconMoon className={twMerge("w-[22px] h-[22px]")} stroke={1.5} />
      ) : (
        <IconSun className={twMerge("w-[22px] h-[22px]")} stroke={1.5} />
      )}
    </ActionIcon>
  );
}

export default ThemeToggler;
