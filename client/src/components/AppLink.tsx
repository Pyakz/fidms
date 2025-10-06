import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { NavLinkProps, NavLink } from "@mantine/core";

type MantineAnchorProps = Omit<NavLinkProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MantineAnchorProps
>((props, ref) => {
  return <NavLink ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

const AppLink: LinkComponent<typeof MantineLinkComponent> = (props) => (
  <CreatedLinkComponent preload="intent" {...props} />
);

export default AppLink;
