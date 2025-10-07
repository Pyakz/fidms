import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { AnchorProps, Anchor } from "@mantine/core";

type MantineAnchorProps = Omit<AnchorProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MantineAnchorProps
>((props, ref) => {
  return <Anchor ref={ref} underline="never" {...props} />;
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

const AnchorLink: LinkComponent<typeof MantineLinkComponent> = (props) => (
  <CreatedLinkComponent preload="intent" {...props} />
);

export default AnchorLink;
