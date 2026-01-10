"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { iconMap, MenuItem } from "@/config/navigation/menu.config";

export function NavItem({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const hasSubmenu = item.items && item.items.length > 0;

          // Improved active state detection:
          // 1. Exact match
          // 2. Parent path match (e.g. /contracts/create matches /contracts)
          // 3. Submenu item match
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
            (item.items
              ? item.items.some((i) => pathname.startsWith(i.url))
              : false);

          return !hasSubmenu ? (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="hover:bg-gray-400"
              >
                <a href={item.href}>
                  <Icon
                    className={isActive ? "text-[#056569]" : "text-white"}
                  />
                  <span className={isActive ? "text-[#056569]" : "text-white"}>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    {item.icon && (
                      <Icon
                        className={isActive ? "text-[#056569]" : "text-white"}
                      />
                    )}
                    <span
                      className={isActive ? "text-[#056569]" : "text-white"}
                    >
                      {item.title}
                    </span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                        isActive ? "text-[#056569]" : "text-white"
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname.startsWith(subItem.url)}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
