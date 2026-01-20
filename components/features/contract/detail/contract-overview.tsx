"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { format } from "date-fns";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Box,
  Loader2,
} from "lucide-react";
import { StoreLabel } from "./store-label";
import { AssetActionPanel } from "@/components/features/asset/asset-action-panel";
import { CollateralService } from "@/lib/collateral.service";
import { CollateralAssetResponse } from "@/types/dto/collateral.dto";
import { useUser } from "@clerk/nextjs";
import { getUserRole, isManagerOrAdmin } from "@/lib/role.helper";
import { toast } from "sonner";

interface ContractOverviewProps {
  loan: LoanDetailDTO;
}

export function ContractOverview({ loan }: ContractOverviewProps) {
  const { user } = useUser();
  const role = getUserRole(user);
  const canEdit = isManagerOrAdmin(role);

  const [selectedAsset, setSelectedAsset] =
    useState<CollateralAssetResponse | null>(null);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);

  const handleAssetClick = async (assetId: string) => {
    setIsLoadingAsset(true);
    try {
      const fullAsset = await CollateralService.getById(assetId);
      setSelectedAsset(fullAsset);
      setIsAssetOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải thông tin chi tiết tài sản");
    } finally {
      setIsLoadingAsset(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Họ tên:</span>
            <span className="font-medium">
              {loan.customer?.fullName || "N/A"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" /> SĐT:
            </span>
            <span>{loan.customer?.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> CCCD:
            </span>
            <span>{loan.customer?.nationalId || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Địa chỉ:
            </span>
            <span className="text-sm">{loan.customer?.address || "N/A"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Loan Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thông tin khoản vay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số tiền vay:</span>
            <span className="font-bold text-primary text-lg">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(loan.loanAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lãi suất:</span>
            <span className="font-medium">
              {loan.appliedInterestRate}% / tháng
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời hạn:</span>
            <span>{loan.durationMonths} tháng</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hình thức trả:</span>
            <Badge variant="outline">{loan.repaymentMethod}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày bắt đầu:</span>
            <span>
              {loan.startDate
                ? format(new Date(loan.startDate), "dd/MM/yyyy")
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Collateral Info */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5" />
            Tài sản thế chấp
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAsset && (
            <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          <div className="border rounded-md divide-y">
            {(loan.collateral || []).map((item, index) => {
              // Ensure collateralInfo is an object
              const info =
                typeof item.collateralInfo === "string"
                  ? JSON.parse(item.collateralInfo)
                  : item.collateralInfo || {};

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row justify-between p-4 gap-4 cursor-pointer hover:bg-muted/50 transition-colors group relative"
                  onClick={() => handleAssetClick(item.id)}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-30" />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                        {info.name || info.description || "Tài sản"}
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          Tài sản {index + 1}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.ownerName}
                      </div>
                    </div>

                    {/* Dynamic Collateral Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm mt-2">
                      {info.brand && (
                        <div>
                          <span className="text-muted-foreground">
                            Thương hiệu:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {info.brand}
                          </span>
                        </div>
                      )}
                      {info.model && (
                        <div>
                          <span className="text-muted-foreground">Model:</span>{" "}
                          <span className="font-medium text-foreground">
                            {info.model}
                          </span>
                        </div>
                      )}
                      {info.color && (
                        <div>
                          <span className="text-muted-foreground">
                            Màu sắc:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {info.color}
                          </span>
                        </div>
                      )}
                      {info.serial && (
                        <div>
                          <span className="text-muted-foreground">
                            Số Serial/IMEI:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {info.serial}
                          </span>
                        </div>
                      )}
                      {info.condition && (
                        <div>
                          <span className="text-muted-foreground">
                            Tình trạng:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {info.condition}
                          </span>
                        </div>
                      )}
                      {info.description && (
                        <div className="col-span-2 md:col-span-3">
                          <span className="text-muted-foreground">Mô tả:</span>{" "}
                          <span className="font-medium text-foreground">
                            {info.description}
                          </span>
                        </div>
                      )}
                      {/* Fallback for other arbitrary keys if needed */}
                      {Object.entries(info)
                        .filter(
                          ([k]) =>
                            ![
                              "brand",
                              "model",
                              "color",
                              "serial",
                              "condition",
                              "description",
                              "name",
                            ].includes(k),
                        )
                        .map(([k, v]) => (
                          <div key={k}>
                            <span className="text-muted-foreground capitalize">
                              {k}:
                            </span>{" "}
                            <span className="font-medium text-foreground">
                              {String(v)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[150px] pl-4 border-l">
                    <Badge
                      className="mb-1"
                      variant={
                        item.status === "STORED" ? "default" : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                    <div className="text-sm text-right">
                      <span className="text-muted-foreground block text-xs">
                        Định giá
                      </span>
                      <span className="font-bold text-lg text-primary">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.appraisedValue)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {item.storageLocation ? (
                        <>
                          Kho: <StoreLabel storeId={item.storageLocation} />
                        </>
                      ) : (
                        <span className="italic">Chưa nhập kho</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AssetActionPanel
        open={isAssetOpen}
        onOpenChange={setIsAssetOpen}
        asset={selectedAsset}
        mode="view"
        onSuccess={() => {
          setIsAssetOpen(false);
          // Potential future enhancement: Refresh contract data
        }}
        isAdminOrManager={canEdit}
      />
    </div>
  );
}
