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

// Which roles each role may activate or deactivate, as in the backend. Roles
// left out can't change anyone's status.
const adminStatusManageableRoles: Partial<Record<string, readonly string[]>> = {
  [adminRoles.SUPER_ADMIN]: Object.values(adminRoles),
  [adminRoles.MANAGER]: [adminRoles.DISPATCHER, adminRoles.VIEWER],
};

export const canManageAnyAdminStatus = (actingRole = "") =>
  Boolean(adminStatusManageableRoles[actingRole]);

export const canManageAdminStatus = (actingRole = "", targetRole = "") =>
  adminStatusManageableRoles[actingRole]?.includes(targetRole) ?? false;
