import { Breadcrumbs } from "@mantine/core";
import { isMatch, useMatches } from "@tanstack/react-router";
import AnchorLink from "./AnchorLink";
import { IconChevronRight } from "@tabler/icons-react";

const Breadcrumb = () => {
  const matches = useMatches();

  // Extract static and loader-based breadcrumbs
  let initialStaticBreadcrumbs = matches
    .filter((match) => isMatch(match, "staticData.breadcrumbs"))
    .flatMap((match) => match.staticData?.breadcrumbs || []);

  const staticBreadcrumbWithLoaders = matches
    .filter((match) => isMatch(match, "loaderData.breadcrumbs"))
    .flatMap((match) => match.loaderData?.breadcrumbs || []);

  if (staticBreadcrumbWithLoaders.length > 0) {
    initialStaticBreadcrumbs = initialStaticBreadcrumbs.concat(
      staticBreadcrumbWithLoaders
    );
  }

  // Sort by order
  const sortedBreadcrumbs = [...initialStaticBreadcrumbs].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  // Inject temporary "..." breadcrumbs for missing order gaps
  const withPlaceholders: {
    title: string;
    to?: string;
    active?: boolean;
    order?: number;
    temporary?: boolean;
  }[] = [];
  for (let i = 0; i < sortedBreadcrumbs.length; i++) {
    const current = sortedBreadcrumbs[i];
    const next = sortedBreadcrumbs[i + 1];

    withPlaceholders.push(current);

    if (next && current.order !== undefined && next.order !== undefined) {
      const diff = next.order - current.order;
      if (diff > 1) {
        // Insert a temporary gap breadcrumb
        withPlaceholders.push({
          title: "...",
          to: undefined,
          order: current.order + 0.5, // to keep sorting consistent
          temporary: true,
        });
      }
    }
  }

  return (
    <Breadcrumbs
      separator={<IconChevronRight size={10} />}
      separatorMargin="xs"
    >
      {withPlaceholders.map((breadcrumb, index) => (
        <AnchorLink
          to={breadcrumb.to}
          key={index}
          size="sm"
          fw={breadcrumb.active ? 600 : "initial"}
        >
          {breadcrumb.title}
        </AnchorLink>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
