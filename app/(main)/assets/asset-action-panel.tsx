"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CollateralAssetResponse, CreateCollateralDTO } from "@/types/dto/collateral.dto";
import { CollateralService } from "@/lib/collateral.service";
import { Badge } from "@/components/ui/badge";
import { Box, Gavel, RefreshCw, MapPin } from "lucide-react";

interface AssetActionPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: CollateralAssetResponse | null;
  mode: "create" | "view" | "location" | "liquidate" | "sell";
  onSuccess: () => void;
  isAdminOrManager?: boolean;
}

export function AssetActionPanel({
  open,
  onOpenChange,
  asset,
  mode: initialMode,
  onSuccess,
  isAdminOrManager = false,
}: AssetActionPanelProps) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [ownerName, setOwnerName] = useState("");
  const [assetName, setAssetName] = useState(""); // Maps to collateralInfo.name
  const [storageLocation, setStorageLocation] = useState("");
  const [soldPrice, setSoldPrice] = useState(0);
  
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  useEffect(() => {
    if (asset) {
      setOwnerName(asset.ownerName || "");
      setAssetName(asset.collateralInfo?.name || "");
      setStorageLocation(asset.storageLocation || "");
    } else {
      setOwnerName("");
      setAssetName("");
      setStorageLocation("");
    }
  }, [asset, open]);

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    try {
        const payload: CreateCollateralDTO = {
            collateralTypeId: 1, // Default or select
            ownerName,
            collateralInfo: { name: assetName },
            // other fields
        };
        
        if (asset && mode === "view") {
             // Edit logic if needed, or just view
             // For now, view is read-only or basic edit
             await CollateralService.update(asset.id, payload);
        } else {
             await CollateralService.create(payload);
        }
        onSuccess();
        onOpenChange(false);
    } catch (e) {
        console.error(e);
        alert("Có lỗi xảy ra");
    } finally {
        setLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
      if (!asset) return;
      setLoading(true);
      try {
          await CollateralService.updateLocation(asset.id, { storageLocation });
          onSuccess();
          onOpenChange(false);
      } catch (e) {
          console.error(e);
          alert("Lỗi cập nhật vị trí");
      } finally {
          setLoading(false);
      }
  };

  const handleLiquidation = async () => {
      if (!asset) return;
      setLoading(true);
      try {
          await CollateralService.liquidate({
              collateralId: asset.id,
              soldPrice: 0, // Default start
              soldDate: new Date().toISOString()
          });
          onSuccess();
          onOpenChange(false);
      } catch (e) {
          console.error(e);
          alert("Lỗi khởi tạo thanh lý");
      } finally {
          setLoading(false);
      }
  };

  const handleConfirmSale = async () => {
      if (!asset) return;
      setLoading(true);
      try {
          // Disposition endpoint? Using update for now as per lifecycle or specific endpoint if exists
          // Lifecycle says "Manual update via PATCH ... Status: SOLD"
          await CollateralService.update(asset.id, {
              status: "SOLD",
              // logic for price update might need custom payload structure handling in service
          });
          onSuccess();
          onOpenChange(false);
      } catch (e) {
          console.error(e);
          alert("Lỗi xác nhận bán");
      } finally {
          setLoading(false);
      }
  };

  const renderInfoValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <ul className="list-disc list-inside">
            {value.map((item, index) => (
              <li key={index}>{renderInfoValue(item)}</li>
            ))}
          </ul>
        );
      }
      return (
        <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-1 mt-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
              <span className="font-semibold capitalize text-muted-foreground">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span>{renderInfoValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  const renderViewMode = () => {
      if (!asset) return null;
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-bold">{asset.collateralInfo?.name || asset.collateralInfo?.description || "Tài sản"}</h3>
                      <p className="text-sm text-muted-foreground">Loại: {asset.collateralTypeId} • HĐ: {asset.loanCode}</p>
                  </div>
                  <Badge variant={
                      asset.status === 'PLEDGED' ? 'default' : 
                      asset.status === 'LIQUIDATING' || asset.status === 'REJECTED' ? 'destructive' :
                      asset.status === 'STORED' || asset.status === 'SOLD' ? 'secondary' : 'outline'
                  }>
                      {asset.status}
                  </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <Label className="text-muted-foreground">Chủ sở hữu</Label>
                      <p className="font-medium">{asset.ownerName}</p>
                  </div>
                  <div>
                      <Label className="text-muted-foreground">Vị trí lưu kho</Label>
                      <div className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />
                          {asset.storageLocation || "Chưa cập nhật"}
                      </div>
                  </div>
                  <div>
                      <Label className="text-muted-foreground">Ngày nhận</Label>
                      <p>{asset.receivedDate ? new Date(asset.receivedDate).toLocaleDateString("vi-VN") : "-"}</p>
                  </div>
                  <div>
                      <Label className="text-muted-foreground">Định giá</Label>
                      <p>{asset.appraisedValue ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.appraisedValue) : "-"}</p>
                  </div>
              </div>
              
              <div className="pt-2">
                  <Label className="text-muted-foreground">Thông tin chi tiết</Label>
                  <div className="bg-muted/30 p-3 rounded-md mt-1 text-sm space-y-2">
                      {asset.collateralInfo && Object.entries(asset.collateralInfo).length > 0 ? (
                          Object.entries(asset.collateralInfo).map(([key, value]) => {
                              // Skip name/description as they are in header
                              if (key === 'name' || key === 'description') return null;
                              return (
                                <div key={key} className="flex flex-col border-b last:border-0 pb-2 last:pb-0 border-muted-foreground/10">
                                    <span className="font-semibold capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <div className="text-muted-foreground pl-2">{renderInfoValue(value)}</div>
                                </div>
                              );
                          })
                      ) : (
                          <span className="text-muted-foreground italic">Không có thông tin thêm</span>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  const renderContent = () => {
      switch (mode) {
          case "view": return renderViewMode();
          case "create":
              return (
                  <div className="space-y-4">
                      <div className="grid gap-2">
                          <Label>Chủ sở hữu</Label>
                          <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                          <Label>Tên tài sản</Label>
                          <Input value={assetName} onChange={e => setAssetName(e.target.value)} />
                      </div>
                      {/* File upload placeholder */}
                  </div>
              );
          case "location":
              return (
                  <div className="space-y-4">
                      <div className="grid gap-2">
                          <Label>Vị trí lưu kho</Label>
                          <Input value={storageLocation} onChange={e => setStorageLocation(e.target.value)} placeholder="VD: Kho A, Kệ 2" />
                      </div>
                  </div>
              );
          case "liquidate":
              return (
                  <div className="space-y-4">
                      <p>Bạn có chắc chắn muốn chuyển tài sản này sang trạng thái <strong>Đang thanh lý</strong>?</p>
                      <p className="text-sm text-muted-foreground">Hành động này thường thực hiện khi hợp đồng quá hạn.</p>
                  </div>
              );
          case "sell":
              return (
                  <div className="space-y-4">
                      <div className="grid gap-2">
                          <Label>Giá bán thực tế</Label>
                          <Input type="number" value={soldPrice} onChange={e => setSoldPrice(Number(e.target.value))} />
                      </div>
                  </div>
              );
          default: return null;
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
              {mode === "create" && "Thêm tài sản mới"}
              {mode === "view" && "Chi tiết tài sản"}
              {mode === "location" && "Cập nhật vị trí"}
              {mode === "liquidate" && "Thanh lý tài sản"}
              {mode === "sell" && "Xác nhận bán"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
            {renderContent()}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
            {mode === "view" ? (
                <>
                    {/* View Mode Actions */}
                    {isAdminOrManager && asset && (asset.status === "PLEDGED" || asset.status === "STORED") && (
                        <Button variant="outline" onClick={() => setMode("location")}>
                            <Box className="w-4 h-4 mr-2" /> Vị trí
                        </Button>
                    )}
                    
                    {isAdminOrManager && asset && (asset.status === "STORED" || asset.status === "PLEDGED") && (
                        <Button variant="destructive" onClick={() => setMode("liquidate")}>
                            <Gavel className="w-4 h-4 mr-2" /> Thanh lý
                        </Button>
                    )}

                    {isAdminOrManager && asset && asset.status === "LIQUIDATING" && (
                        <Button variant="secondary" onClick={() => setMode("sell")}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Đã bán
                        </Button>
                    )}
                    
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Đóng</Button>
                </>
            ) : (
                <>
                    <Button variant="outline" onClick={() => {
                        if (mode !== "create" && mode !== "view") setMode("view"); // Back to view
                        else onOpenChange(false);
                    }}>
                        {mode === "create" ? "Hủy" : "Quay lại"}
                    </Button>
                    <Button onClick={() => {
                        if (mode === 'create') handleCreateOrUpdate();
                        if (mode === 'location') handleLocationUpdate();
                        if (mode === 'liquidate') handleLiquidation();
                        if (mode === 'sell') handleConfirmSale();
                    }} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
