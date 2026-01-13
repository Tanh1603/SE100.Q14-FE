import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { GlobalCommandListener } from "@/components/global/global-command-listener";
import React from "react";

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <GlobalCommandListener />
      <SidebarInset>
        <div className="w-full h-full bg-gray-50/50">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
