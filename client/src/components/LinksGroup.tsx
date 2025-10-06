import { IconProps } from "@tabler/icons-react";
import { NavLink } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useMediaQuery } from "@mantine/hooks";

interface CommonProps {
  icon: React.FC<IconProps>;
  label: string;
  closeSidebarOnClick?: () => void;
  minimized?: boolean;
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

function LinksGroup({
  icon: Icon,
  label,
  link,
  links,
  closeSidebarOnClick,
  minimized,
}: LinksGroupProps) {
  const location = useRouterState({ select: (s) => s.location });

  const currentPathname = location.pathname;

  const isMobile = useMediaQuery("(max-width: 768px)");

  const root = isMobile
    ? {
        padding: "11px",
      }
    : minimized
      ? { padding: "11px", justifyContent: "center" }
      : { paddingTop: "4px", paddingBottom: "4px" };

  const hasLinks = Array.isArray(links);
  const items = (hasLinks ? links : []).map((link) => (
    <NavLink
      component={Link}
      key={link.label}
      to={link.link}
      fw={500}
      className="rounded"
      styles={{ root }}
      variant="filled"
      label={minimized ? null : link.label}
      onClick={() => {
        if (isMobile) {
          closeSidebarOnClick?.();
        }
      }}
    />
  ));

  if (hasLinks) {
    const isParentActive = items.some(
      (item) =>
        item.props.to === currentPathname ||
        (item.props.to !== "/" && currentPathname.startsWith(item.props.to))
    );

    return (
      <NavLink
        href="#required-for-focus"
        label={minimized ? null : label}
        variant="filled"
        className="rounded"
        styles={{ root }}
        fw={500}
        leftSection={<Icon size={16} />}
        childrenOffset={18}
        active={isParentActive}
        defaultOpened={isParentActive}
      >
        <div className="border-l-2 border-dashed pl-1.5 border-zinc-4000 py-1 space-y-1">
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
      label={minimized ? null : label}
      styles={{ root }}
      fw={500}
      leftSection={<Icon size={16} />}
      onClick={() => {
        if (isMobile) {
          closeSidebarOnClick?.();
        }
      }}
    />
  );
}

export default LinksGroup;
