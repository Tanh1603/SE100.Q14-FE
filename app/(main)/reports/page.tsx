"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { FileBarChart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { getUserRole, isManagerOrAdmin } from "@/lib/role.helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuarterlyReportTab from "@/components/features/reports/quarterly-report-tab";
import RevenueReportTab from "@/components/features/reports/revenue-report-tab";
import PoliceBookTab from "@/components/features/reports/police-book-tab";

const ReportsPage = () => {
  const { user } = useUser();
  const userRole = getUserRole(user?.publicMetadata);

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center">
          <FileBarChart className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Trung tâm báo cáo</p>
        </div>

        <Tabs defaultValue="police-book" className="w-full">
          <div className="overflow-x-auto pb-2 mb-6">
            <TabsList className="grid w-full grid-cols-3 min-w-[500px]">
              <TabsTrigger value="police-book">Sổ quản lý ANTT</TabsTrigger>
              <TabsTrigger value="quarterly">Báo cáo Quý (ĐK13)</TabsTrigger>
              <TabsTrigger
                value="revenue"
                disabled={!isManagerOrAdmin(userRole)}
              >
                Báo cáo doanh thu
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="police-book">
            <PoliceBookTab />
          </TabsContent>

          <TabsContent value="quarterly">
            <QuarterlyReportTab />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueReportTab />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default ReportsPage;
