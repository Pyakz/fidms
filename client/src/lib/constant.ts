import {
  IconGauge,
  IconCarGarage,
  IconReport,
  IconAdjustments,
  IconBuilding,
} from "@tabler/icons-react";

export const SIDEBAR_LINKS = [
  { label: "Dashboard", icon: IconGauge, link: "/dashboard" },
  {
    label: "Inventory",
    icon: IconCarGarage,
    links: [
      { label: "Cars", link: "/cars" },
      { label: "Motorcycles", link: "/motorcycles" },
    ],
  },
  {
    label: "Reports",
    icon: IconReport,
    links: [{ label: "Sales", link: "/sales" }],
  },
  {
    label: "Branches",
    icon: IconBuilding,
    link: "/branches",
  },
  { label: "Settings", icon: IconAdjustments, link: "/settings" },
];
