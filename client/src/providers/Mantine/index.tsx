import { MantineProvider as Provider } from "@mantine/core";
import { themeCssVariableResolver } from "./cssVariableResolver";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import "@mantine/notifications/styles.css";
import "./theme.css";

const MantineProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={themeCssVariableResolver}
    >
      <Notifications position="top-right" />
      {children}
    </Provider>
  );
};

export default MantineProvider;
