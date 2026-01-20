"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetConfigTab } from "@/components/features/settings/asset-config-tab";
import { WarehouseSettingsTab } from "@/components/features/settings/warehouse-settings-tab";
import { Settings, Box, MapPin } from "lucide-react";

const SettingPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-gray-700" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-500">
            Quản lý cấu hình tài sản, kho bãi và hệ thống.
          </p>
        </div>
      </div>

      <Tabs defaultValue="assets" className="flex-1 flex flex-col">
        <div className="overflow-x-auto mb-6">
          <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent space-x-6 min-w-[400px]">
            <TabsTrigger
              value="assets"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 data-[state=active]:shadow-none px-4 py-2"
            >
              <Box className="w-4 h-4 mr-2" />
              Cấu hình Tài sản
            </TabsTrigger>
            <TabsTrigger
              value="warehouses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:shadow-none px-4 py-2"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Kho lưu trữ
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assets" className="flex-1 mt-0 outline-none">
          <AssetConfigTab />
        </TabsContent>

        <TabsContent value="warehouses" className="flex-1 mt-0 outline-none">
          <WarehouseSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
