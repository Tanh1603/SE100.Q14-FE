export type Role = "admin" | "manager" | "staff";

// Role constant values
export const ROLE = {
  ADMIN: "admin" as Role,
  MANAGER: "manager" as Role,
  STAFF: "staff" as Role,
} as const;

// Role options for select dropdowns
export const ROLE_OPTIONS = [
  { label: "Quản lí", value: ROLE.MANAGER },
  { label: "Nhân viên", value: ROLE.STAFF },
];
