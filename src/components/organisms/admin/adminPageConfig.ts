import type { ComponentType, SVGProps } from "react";
import {
  ClipboardListIcon,
  DashboardIcon,
  MailIcon,
  ProfileIcon,
  UsersIcon,
} from "../../icons";

export type AdminPageView =
  | "dashboard"
  | "deliveryRequests"
  | "informationRequests"
  | "admins";

export type AdminPageContent = {
  description: string;
  title: string;
};

export type AdminPanelItem = {
  // Admin roles that see this item; every role sees it when omitted.
  allowedRoles?: string[];
  description?: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: AdminPageView | "profile";
  label: string;
};

export const adminPanelItems: AdminPanelItem[] = [
  {
    description: "Dashboard home",
    href: "/admin",
    icon: DashboardIcon,
    id: "dashboard",
    label: "Overview",
  },
  {
    description: "Delivery submissions",
    href: "/admin/delivery-requests",
    icon: ClipboardListIcon,
    id: "deliveryRequests",
    label: "Delivery Requests",
  },
  {
    description: "Information inquiries",
    href: "/admin/information-requests",
    icon: MailIcon,
    id: "informationRequests",
    label: "Information Requests",
  },
  {
    allowedRoles: ["super_admin", "manager"],
    description: "Manage Admins",
    href: "/admin/admins",
    icon: UsersIcon,
    id: "admins",
    label: "Admins",
  },
  {
    description: "Account settings",
    href: "/admin/profile",
    icon: ProfileIcon,
    id: "profile",
    label: "Profile",
  },
];

// Role-restricted items stay off-limits until the signed-in admin is known.
export const canAccessAdminPanelItem = (
  item: AdminPanelItem,
  role?: string,
) =>
  !item.allowedRoles ||
  (role !== undefined && item.allowedRoles.includes(role));

// Used by the route guard, so typing a URL can't reach a view the sidebar hides.
export const canAccessAdminView = (
  view: AdminPanelItem["id"],
  role?: string,
) => {
  const item = adminPanelItems.find((panelItem) => panelItem.id === view);

  return !item || canAccessAdminPanelItem(item, role);
};

export type AdminHeaderView = Extract<AdminPageView, "dashboard">;

export const adminPageContent: Record<AdminHeaderView, AdminPageContent> = {
  dashboard: {
    description: "This area is reserved for Efficient Global administrators.",
    title: "Dashboard",
  },
};
