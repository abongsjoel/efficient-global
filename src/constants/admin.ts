// Mirrors the backend roles in constants/admin.js. A const object rather than a
// TS enum, since erasableSyntaxOnly in tsconfig.app.json rules enums out.
export const adminRoles = {
  SUPER_ADMIN: "super_admin",
  MANAGER: "manager",
  DISPATCHER: "dispatcher",
  VIEWER: "viewer",
} as const;

export type AdminRole = (typeof adminRoles)[keyof typeof adminRoles];
