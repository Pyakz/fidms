import { IconProps } from "@tabler/icons-react";
import { ActionIcon, Badge, NavLink, Popover, Tooltip } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useMediaQuery } from "@mantine/hooks";
import AppLink from "./AppLink";

interface CommonProps {
  icon: React.FC<IconProps>;
  label: string;
  closeSidebarOnClick?: () => void;
  minimized?: boolean;
  count?: number;
  isNew?: boolean;
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
  count,
  isNew,
}: LinksGroupProps) {
  const location = useRouterState({ select: (s) => s.location });

  const currentPathname = location.pathname;

  const isMobile = useMediaQuery("(max-width: 768px)");

  const root = isMobile
    ? {
        padding: "11px",
      }
    : { paddingTop: "5px", paddingBottom: "5px" };
  const isActive =
    link === currentPathname ||
    (link !== "/" && currentPathname.startsWith(link || ""));

  const hasLinks = Array.isArray(links);
  const items = (hasLinks ? links : []).map((link) => (
    <NavLink
      component={Link}
      key={link.label}
      to={link.link}
      fw={500}
      className="rounded"
      preload="intent"
      styles={{ root }}
      variant="filled"
      rightSection={
        isNew ? (
          <Badge
            radius={2}
            size="xs"
            variant="light"
            color={isActive ? "secondary" : "green"}
          >
            New
          </Badge>
        ) : count ? (
          <Badge
            radius={2}
            size="xs"
            variant="light"
            color={isActive ? "secondary" : "green"}
          >
            {String(count)}
          </Badge>
        ) : null
      }
      label={link.label}
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

    return minimized ? (
      <Popover width={200} position="right-start" withArrow shadow="md">
        <Popover.Target>
          <Tooltip label={label} position="right" withArrow>
            <ActionIcon
              mb={4}
              className="rounded"
              variant={isParentActive ? "filled" : "default"}
              size="xl"
            >
              <Icon size={16} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown p={5}>{items}</Popover.Dropdown>
      </Popover>
    ) : (
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

  return minimized ? (
    <Tooltip label={label} position="right" withArrow>
      <ActionIcon
        className="rounded"
        variant={isActive ? "filled" : "default"}
        size="xl"
        component={Link}
        to={link || "#"}
        preload="intent"
        mb={4}
      >
        <Icon size={16} />
      </ActionIcon>
    </Tooltip>
  ) : (
    <AppLink
      preload="intent"
      to={link}
      className="rounded"
      variant="filled"
      rightSection={
        isNew ? (
          <Badge
            radius={2}
            size="xs"
            variant="light"
            color={isActive ? "secondary" : "green"}
          >
            New
          </Badge>
        ) : count ? (
          <Badge
            radius={2}
            size="xs"
            variant="light"
            color={isActive ? "secondary" : "green"}
          >
            {String(count)}
          </Badge>
        ) : null
      }
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
