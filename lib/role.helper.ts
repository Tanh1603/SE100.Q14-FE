import { Role } from "@/types/constant";

// Helper to safely get user role from Clerk metadata
export function getUserRole(metadata: unknown): Role {
  if (!metadata || typeof metadata !== "object") {
    return Role.STAFF;
  }

  const rawRole = (metadata as { role?: unknown }).role;

  if (typeof rawRole !== "string") {
    return Role.STAFF;
  }

  const normalizedRole = rawRole.toUpperCase();

  switch (normalizedRole) {
    case Role.ADMIN:
      return Role.ADMIN;
    case Role.MANAGER:
      return Role.MANAGER;
    case Role.STAFF:
      return Role.STAFF;
    default:
      return Role.STAFF;
  }
}

// Helper to check permissions
export function isManagerOrAdmin(role: Role): boolean {
  return role === Role.ADMIN || role === Role.MANAGER;
}
