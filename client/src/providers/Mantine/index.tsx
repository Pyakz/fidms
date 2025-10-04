import { InputError, Loader, MantineProvider as Provider } from "@mantine/core";
import { themeCssVariableResolver } from "./cssVariableResolver";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import "@mantine/notifications/styles.css";
import "./theme.css";

const MantineProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      theme={{
        ...theme,
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
        },
      }}
      defaultColorScheme={
        import.meta.env.NODE_ENV === "production" ? "auto" : "dark"
      }
      cssVariablesResolver={themeCssVariableResolver}
    >
      <Notifications position="top-right" />
      {children}
    </Provider>
  );
};

export default MantineProvider;
