"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ConfigurationService,
  SystemConfiguration,
} from "@/lib/configuration.service";
import { LoanProductManager } from "./loan-product-manager";
import { ConfigurationEditor } from "./configuration-editor";
import { Loader2, Settings, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { RoleGate } from "@/components/features/role/role-gate";
import { Role } from "@/types/constant";

const AccessDeniedFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <ShieldAlert className="w-16 h-16 text-destructive" />
    <h2 className="text-xl font-semibold text-gray-900">Truy cập bị từ chối</h2>
    <p className="text-muted-foreground text-center max-w-md">
      Bạn không có quyền truy cập trang này. Chỉ quản trị viên (Admin) mới có
      thể cấu hình hệ thống.
    </p>
  </div>
);

export default function SystemSettingsPage() {
  const [configs, setConfigs] = useState<SystemConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await ConfigurationService.getAll();
      setConfigs(data);
    } catch (error) {
      toast.error("Không thể tải cấu hình hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ensure configs is an array
  const safeConfigs = Array.isArray(configs) ? configs : [];

  // Filter groups
  const loanProductsConfig = safeConfigs.find(
    (c) => c.key === "SUPPORTED_LOAN_PRODUCTS",
  );
  const rateConfigs = safeConfigs.filter((c) => c.group === "RATES");
  const systemConfigs = safeConfigs.filter(
    (c) => c.group === "SYSTEM" && c.key !== "SUPPORTED_LOAN_PRODUCTS",
  );
  // Assuming LIMITS goes to general system or separate tab, merging into system for now if few
  const limitConfigs = safeConfigs.filter((c) => c.group === "LIMITS");

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <RoleGate allowedRoles={[Role.ADMIN]} fallback={<AccessDeniedFallback />}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Settings className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Cài Đặt Hệ Thống
            </h1>
            <p className="text-muted-foreground">
              Quản lý tham số, lãi suất và các gói vay.
            </p>
          </div>
        </div>

        <Tabs defaultValue="rates" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            {/* <TabsTrigger value="products">Gói vay</TabsTrigger> */}
            <TabsTrigger value="rates">Lãi suất & Phí</TabsTrigger>
            <TabsTrigger value="general">Cấu hình chung</TabsTrigger>
          </TabsList>

          {/* TAB 1: LOAN PRODUCTS */}
          {/* <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý Gói sản phẩm vay</CardTitle>
                <CardDescription>
                  Cấu hình các gói vay (Lãi suất, Thời hạn) hiển thị cho nhân viên khi tạo hợp đồng.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loanProductsConfig ? (
                  <LoanProductManager 
                      initialValue={loanProductsConfig.value} 
                      configKey={loanProductsConfig.key}
                      onUpdate={fetchData} 
                  />
                ) : (
                  <div className="text-center py-10 text-gray-500">Không tìm thấy cấu hình SUPPORTED_LOAN_PRODUCTS</div>
                )}
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* TAB 2: RATES */}
          <TabsContent value="rates" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tham số Lãi suất & Phí</CardTitle>
                <CardDescription>
                  Các giới hạn và quy định về lãi suất áp dụng toàn hệ thống.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationEditor
                  configs={rateConfigs}
                  onUpdate={fetchData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: GENERAL */}
          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình chung</CardTitle>
                <CardDescription>Các tham số hệ thống khác.</CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationEditor
                  configs={[...systemConfigs, ...limitConfigs]}
                  onUpdate={fetchData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGate>
  );
}
