import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getMenuByRole } from "@/config/navigation/menu.config";
import { getRole } from "@/lib/role.utils";
import { currentUser } from "@clerk/nextjs/server";
import { NavUser } from "../features/user/nav-user";
import { NavItem } from "./nav-item";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const role = await getRole();
  const menuItem = await getMenuByRole(role);

  const navUser = user && {
    id: user.id,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    imageUrl: user.imageUrl,
    email: user.emailAddresses?.[0]?.emailAddress,
    role: user.publicMetadata?.role as string,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center">
              <h1 className=" font-bold text-xl text-white">Tiệm cầm đồ</h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <NavItem items={menuItem} />
      </SidebarContent>
      <SidebarFooter className="bg-primary">
        {navUser && <NavUser user={navUser} />}
      </SidebarFooter>
    </Sidebar>
  );
}
