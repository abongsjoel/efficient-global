import type { DropdownOption } from "../../atoms/Dropdown";
import { adminRoles, adminStatuses } from "../../../constants/admin";

// Shared by the add-admin and edit-admin forms.
export const adminRoleOptions: DropdownOption[] = [
  { label: "Super Admin", value: adminRoles.SUPER_ADMIN },
  { label: "Manager", value: adminRoles.MANAGER },
  { label: "Dispatcher", value: adminRoles.DISPATCHER },
  { label: "Viewer", value: adminRoles.VIEWER },
];

export const adminStatusOptions: DropdownOption[] = [
  { label: "Active", value: adminStatuses.ACTIVE },
  { label: "Inactive", value: adminStatuses.INACTIVE },
];
