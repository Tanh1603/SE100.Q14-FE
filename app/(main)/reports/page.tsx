"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { FileBarChart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuarterlyReportTab from "@/components/features/reports/quarterly-report-tab";
import RevenueReportTab from "@/components/features/reports/revenue-report-tab";
import PoliceBookTab from "@/components/features/reports/police-book-tab";

const ReportsPage = () => {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as Role) || "staff";

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center">
          <FileBarChart className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Trung tâm báo cáo</p>
        </div>

        <Tabs defaultValue="police-book" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="police-book">Sổ quản lý ANTT</TabsTrigger>
            <TabsTrigger value="quarterly">Báo cáo Quý (ĐK13)</TabsTrigger>
            <TabsTrigger
              value="revenue"
              disabled={!["admin", "manager"].includes(userRole)}
            >
              Báo cáo doanh thu
            </TabsTrigger>
          </TabsList>

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
