// Mirror the backend roles and statuses in constants/admin.js. Const objects
// rather than TS enums, since erasableSyntaxOnly in tsconfig.app.json rules
// enums out.
export const adminRoles = {
  SUPER_ADMIN: "super_admin",
  MANAGER: "manager",
  DISPATCHER: "dispatcher",
  VIEWER: "viewer",
} as const;

export type AdminRole = (typeof adminRoles)[keyof typeof adminRoles];

export const adminStatuses = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type AdminStatus = (typeof adminStatuses)[keyof typeof adminStatuses];
