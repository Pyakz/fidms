import { IconProps } from "@tabler/icons-react";
import { NavLink } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useMediaQuery } from "@mantine/hooks";

interface CommonProps {
  icon: React.FC<IconProps>;
  label: string;
  initiallyOpened?: boolean;
}

// 1. Type for a single, direct link (no nested links)
interface SingleLinkProps extends CommonProps {
  link: string; // Required when no 'links' array is present
  links?: never; // Ensures 'links' is not present
}

// 2. Type for a group of links (must have nested links, no direct link)
interface GroupLinkProps extends CommonProps {
  link?: never; // Ensures 'link' is not present
  links: { label: string; link: string }[]; // Required when no single 'link' is present
}

// The final interface is a union of the two distinct types
type LinksGroupProps = SingleLinkProps | GroupLinkProps;

function LinksGroup({ icon: Icon, label, link, links }: LinksGroupProps) {
  const location = useRouterState({ select: (s) => s.location });
  const currentPathname = location.pathname;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const root = isMobile
    ? {
        padding: "11px",
      }
    : { paddingTop: "4px", paddingBottom: "4px" };
  const hasLinks = Array.isArray(links);
  const items = (hasLinks ? links : []).map((link) => (
    <NavLink
      component={Link}
      key={link.label}
      to={link.link}
      fw={500}
      className="rounded"
      styles={{
        root,
      }}
      variant="filled"
      label={link.label}
    />
  ));

  if (hasLinks) {
    return (
      <NavLink
        href="#required-for-focus"
        label={label}
        variant="filled"
        className="rounded"
        styles={{
          root,
        }}
        fw={500}
        leftSection={<Icon size={16} />}
        childrenOffset={18}
        active={items.some((item) => item.props.to === currentPathname)}
        defaultOpened={items.some((item) => item.props.to === currentPathname)}
      >
        <div className="border-l-2 pl-1 border-zinc-4000 pt-1 space-y-1">
          {items}
        </div>
      </NavLink>
    );
  }

  return (
    <NavLink
      component={Link}
      preload="intent"
      to={link}
      className="rounded"
      variant="filled"
      label={label}
      styles={{
        root,
      }}
      fw={500}
      leftSection={<Icon size={16} />}
    />
  );
}

export default LinksGroup;
