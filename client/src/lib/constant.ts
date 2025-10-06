import {
  IconCarGarage,
  IconReport,
  IconAdjustments,
  IconBuilding,
  IconLayoutDashboard,
} from "@tabler/icons-react";

export const SIDEBAR_LINKS = [
  { label: "Dashboard", icon: IconLayoutDashboard, link: "/dashboard" },
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

export const HEADER_HEIGHT = 55;
export const FULL_HEIGHT = `calc(100vh - ${HEADER_HEIGHT * 2}px)`;
