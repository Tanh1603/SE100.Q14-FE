"use server"

import { Role } from "@/types/constant";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Role) => {
  const { sessionClaims } = await auth();
  const metadata =
    sessionClaims &&
    typeof sessionClaims === "object" &&
    "metadata" in sessionClaims
      ? (sessionClaims as { metadata?: { role?: unknown } }).metadata
      : undefined;
  return metadata && typeof metadata === "object" && "role" in metadata
    ? metadata.role === role
    : false;
};

export const getRole = async (): Promise<Role> => {
  const { sessionClaims } = await auth();

  const metadata =
    sessionClaims &&
    typeof sessionClaims === "object" &&
    "metadata" in sessionClaims
      ? (sessionClaims as { metadata?: { role?: unknown } }).metadata
      : undefined;

  const role = metadata?.role;

  if (role === "admin" || role === "manager" || role === "staff") {
    return role;
  }

  return "staff"; // hoặc "manager" tùy hệ thống
};