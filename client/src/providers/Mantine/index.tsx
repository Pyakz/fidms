import {
  Card,
  DEFAULT_THEME,
  InputError,
  Loader,
  mergeMantineTheme,
  Paper,
  MantineProvider as Provider,
  rem,
} from "@mantine/core";
import { themeCssVariableResolver } from "./cssVariableResolver";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { appTheme } from "./theme";
const theme = mergeMantineTheme(DEFAULT_THEME, appTheme);
const MantineProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      theme={{
        ...theme,
        radius: {
          xs: rem("4px"),
          sm: rem("7px"),
          md: rem("11px"),
          lg: rem("15px"),
          xl: rem("24px"),
        },
        defaultRadius: "xs",
        components: {
          ...theme.components,
          InputError: InputError.extend({
            defaultProps: {
              style: {
                textAlign: "end",
              },
            },
          }),
          Loader: Loader.extend({
            defaultProps: {
              type: "dots",
            },
          }),
          Paper: Paper.extend({
            defaultProps: {
              shadow: "xs",
              bg: "rgba(255, 255, 255, 0.05)",
            },
          }),
          Card: Card.extend({
            defaultProps: {
              shadow: "sm",
              withBorder: true,
              bg: "rgba(255, 255, 255, 0.05)",
            },
          }),
        },
      }}
      defaultColorScheme="light"
      cssVariablesResolver={themeCssVariableResolver}
    >
      <Notifications position="top-right" />
      {children}
    </Provider>
  );
};

export default MantineProvider;
