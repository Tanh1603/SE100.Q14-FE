import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getMenuByRole } from "@/config/menu";
import { getRole } from "@/lib/role.utils";
import { currentUser } from "@clerk/nextjs/server";
import { NavItem } from "./nav-item";
import { NavUser } from "./nav-user";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const role = await getRole();
  const menuItem = await getMenuByRole(role);

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
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
