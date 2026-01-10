"use client";

import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode; // Optional content to show if access denied
}

export const RoleGate = ({
  children,
  allowedRoles,
  fallback = null,
}: RoleGateProps) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // Or a spinner
  }

  const userRole = (user?.publicMetadata?.role as Role) || "staff"; // Default to lowest role

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
