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
    description: "Access management",
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

export const adminPageContent: Record<AdminPageView, AdminPageContent> = {
  admins: {
    description: "Admin management tools will live here.",
    title: "Admins",
  },
  dashboard: {
    description: "This area is reserved for Efficient Global administrators.",
    title: "Dashboard",
  },
  deliveryRequests: {
    description: "Delivery request submissions will live here.",
    title: "Delivery Requests",
  },
  informationRequests: {
    description: "Request information submissions will live here.",
    title: "Information Requests",
  },
};
