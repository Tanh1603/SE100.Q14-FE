import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@/types/constant";

/**
 * Get the role of the currently authenticated user
 * @returns User's role or "manager" as default if not set
 */
export async function getRole(): Promise<Role | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Get role from publicMetadata, default to "manager" if not set
  const role = user.publicMetadata?.role as Role | undefined;

  // Log for debugging (will show in server console)
  console.log("[getRole] User ID:", user.id);
  console.log("[getRole] Public Metadata:", user.publicMetadata);
  console.log("[getRole] Role:", role);

  // Return role or default to "manager" for authenticated users
  return role || Role.MANAGER;
}
