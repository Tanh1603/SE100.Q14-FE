"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { profileMenuConfig } from "@/config/navigation/profile-menu";
import { useState } from "react";
import { AppDialog } from "../../app-dialog";
import SignOutBtn from "../auth/sign-out-btn";
import { BranchContent, ProfileContent } from ".";

type NavUserProps = {
  user: {
    id: string;
    fullName: string | null;
    imageUrl: string;
    email?: string;
    role: string;
  };
};

export function NavUser({ user }: NavUserProps) {
  const [dialogType, setDialogType] = useState<"profile" | "branch" | null>(
    null
  );

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-white rounded-xl hover:bg-white focus-visible:shadow-none"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user.fullName ?? "NoName"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              {profileMenuConfig
                .filter((item) => item.roles.includes(user.role))
                .map((item) => (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setDialogType(item.key as "profile" | "branch");
                    }}
                    key={item.key}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    {item.label}
                  </DropdownMenuItem>
                ))}

              <SignOutBtn />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AppDialog
        open={dialogType !== null}
        onOpenChange={(open) => !open && setDialogType(null)}
        title={
          dialogType === "profile" ? "Thông tin cá nhân" : "Thông tin cửa hàng"
        }
        description={
          dialogType === "profile"
            ? "Thông tin tài khoản của bạn"
            : "Danh sách chi nhánh bạn quản lý"
        }
      >
        {dialogType === "profile" && <ProfileContent userId={user.id} />}
        {dialogType === "branch" && <BranchContent userId={user.id} />}
      </AppDialog>
    </>
  );
}
