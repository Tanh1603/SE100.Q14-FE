// export type Role = "admin" | "manager" | "staff";

// // Role constant values
// export const ROLE = {
//   ADMIN: "admin" as Role,
//   MANAGER: "manager" as Role,
//   STAFF: "staff" as Role,
// } as const;

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

// Role options for select dropdowns
export const ROLE_OPTIONS = [
  { label: "Quản lí", value: Role.MANAGER },
  { label: "Nhân viên", value: Role.STAFF },
];
