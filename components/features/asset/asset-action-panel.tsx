"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollateralAssetResponse } from "@/types/dto/collateral.dto";
import {
  CollateralService,
  CreateCollateralDTO,
} from "@/lib/collateral.service";
import { Badge } from "@/components/ui/badge";
import { Box, Gavel, RefreshCw, MapPin } from "lucide-react";
import Image from "next/image";
import { StoreService } from "@/lib/store.service";
import { Store } from "@/types/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [valuation, setValuation] = useState(0);
  const [soldPrice, setSoldPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    StoreService.getStores().then((res) => {
      if (res && res.data) setStores(res.data);
    });
  }, []);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  useEffect(() => {
    if (asset) {
      setOwnerName(asset.ownerName || "");
      setAssetName((asset.collateralInfo?.name as string) || "");
      setStorageLocation(asset.storageLocation || "");
      setValuation(asset.appraisedValue || 0);

      if (asset.storageLocation) {
        const found = stores.find((s) => s.id === asset.storageLocation);
        if (found) {
          setStoreName(found.name);
        } else {
          StoreService.getStoreById(asset.storageLocation)
            .then((s) => setStoreName(s.name))
            .catch(() => setStoreName(asset.storageLocation || ""));
        }
      } else {
        setStoreName("");
      }
    } else {
      setOwnerName("");
      setAssetName("");
      setStorageLocation("");
      setValuation(0);
      setStoreName("");
    }
  }, [asset, open, stores]);

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    try {
      const payload: CreateCollateralDTO = {
        collateralTypeId: 1, // Default or select
        ownerName,
        collateralInfo: { name: assetName },
        appraisedValue: valuation,
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
        minimumSalePrice: minPrice,
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
      await CollateralService.sell(asset.id, {
        sellPrice: soldPrice,
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

  const renderInfoValue = (value: unknown): React.ReactNode => {
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
            <div
              key={k}
              className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs"
            >
              <span className="font-semibold capitalize text-muted-foreground">
                {k.replace(/([A-Z])/g, " $1").trim()}:
              </span>
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
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              {(asset.collateralInfo?.name as string) ||
                (asset.collateralInfo?.description as string) ||
                "Tài sản"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Loại: {asset.collateralTypeId} • HĐ: {asset.loanCode}
            </p>
          </div>
          <Badge
            variant={
              asset.status === "PLEDGED"
                ? "default"
                : asset.status === "LIQUIDATING" || asset.status === "REJECTED"
                  ? "destructive"
                  : asset.status === "STORED" || asset.status === "SOLD"
                    ? "secondary"
                    : "outline"
            }
          >
            {asset.status}
          </Badge>
        </div>

        {/* Image Gallery Section */}
        {asset.images && asset.images.length > 0 && (
          <div className="pt-2">
            <Label className="text-muted-foreground">Hình ảnh tài sản</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {asset.images.map((image, index) => (
                <div
                  key={image.publicId || index}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(image.url, "_blank")}
                >
                  <Image
                    src={image.url}
                    alt={`Hình ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">Chủ sở hữu</Label>
            <p className="font-medium">{asset.ownerName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Vị trí lưu kho</Label>
            <div className="flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3" />
              {storeName || asset.storageLocation || "Chưa cập nhật"}
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Ngày nhận</Label>
            <p>
              {asset.receivedDate
                ? new Date(asset.receivedDate).toLocaleDateString("vi-VN")
                : "-"}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Định giá</Label>
            <p>
              {asset.appraisedValue
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(asset.appraisedValue)
                : "-"}
            </p>
          </div>
          {/* Show sell price for LIQUIDATING or SOLD status */}
          {(asset.status === "LIQUIDATING" || asset.status === "SOLD") &&
            asset.sellPrice && (
              <div>
                <Label className="text-muted-foreground">
                  {asset.status === "LIQUIDATING"
                    ? "Giá định bán"
                    : "Giá bán thực tế"}
                </Label>
                <p
                  className={
                    asset.status === "LIQUIDATING"
                      ? "text-orange-600 font-medium"
                      : "text-teal-600 font-medium"
                  }
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(asset.sellPrice)}
                </p>
              </div>
            )}
          {/* Show sell date for SOLD status */}
          {asset.status === "SOLD" && asset.sellDate && (
            <div>
              <Label className="text-muted-foreground">Ngày bán</Label>
              <p>{new Date(asset.sellDate).toLocaleDateString("vi-VN")}</p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Label className="text-muted-foreground">Thông tin chi tiết</Label>
          <div className="bg-muted/30 p-3 rounded-md mt-1 text-sm space-y-2">
            {asset.collateralInfo &&
            Object.entries(asset.collateralInfo).length > 0 ? (
              Object.entries(asset.collateralInfo).map(([key, value]) => {
                // Skip name/description as they are in header
                if (key === "name" || key === "description") return null;
                return (
                  <div
                    key={key}
                    className="flex flex-col border-b last:border-0 pb-2 last:pb-0 border-muted-foreground/10"
                  >
                    <span className="font-semibold capitalize mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="text-muted-foreground pl-2">
                      {renderInfoValue(value)}
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-muted-foreground italic">
                Không có thông tin thêm
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case "view":
        return renderViewMode();
      case "create":
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Chủ sở hữu</Label>
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tên tài sản</Label>
              <Input
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Định giá (VNĐ)</Label>
              <Input
                type="number"
                value={valuation}
                onChange={(e) => setValuation(Number(e.target.value))}
              />
            </div>
            {/* File upload placeholder */}
          </div>
        );
      case "location":
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Vị trí lưu kho</Label>
              <Select
                value={storageLocation}
                onValueChange={(value) => setStorageLocation(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kho" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "liquidate":
        return (
          <div className="space-y-4">
            <p>
              Bạn có chắc chắn muốn chuyển tài sản này sang trạng thái{" "}
              <strong>Đang thanh lý</strong>?
            </p>
            <div className="grid gap-2">
              <Label>Định giá</Label>
              <Input
                disabled
                value={
                  asset?.appraisedValue
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(asset.appraisedValue)
                    : "0 ₫"
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Giá thanh lý tối thiểu</Label>
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Hành động này thường thực hiện khi hợp đồng quá hạn.
            </p>
          </div>
        );
      case "sell":
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Định giá</Label>
              <Input
                disabled
                value={
                  asset?.sellPrice
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(asset.sellPrice)
                    : "0 ₫"
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Giá bán thực tế</Label>
              <Input
                type="number"
                value={soldPrice}
                onChange={(e) => setSoldPrice(Number(e.target.value))}
              />
            </div>
          </div>
        );
      default:
        return null;
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

        <div className="py-4">{renderContent()}</div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {mode === "view" ? (
            <>
              {/* View Mode Actions */}
              {isAdminOrManager &&
                asset &&
                (asset.status === "PLEDGED" || asset.status === "STORED") && (
                  <Button variant="outline" onClick={() => setMode("location")}>
                    <Box className="w-4 h-4 mr-2" /> Vị trí
                  </Button>
                )}

              {isAdminOrManager &&
                asset &&
                (asset.status === "STORED" || asset.status === "PLEDGED") && (
                  <Button
                    variant="destructive"
                    onClick={() => setMode("liquidate")}
                  >
                    <Gavel className="w-4 h-4 mr-2" /> Thanh lý
                  </Button>
                )}

              {isAdminOrManager && asset && asset.status === "LIQUIDATING" && (
                <Button variant="secondary" onClick={() => setMode("sell")}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Đã bán
                </Button>
              )}

              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (mode !== "create")
                    setMode("view"); // Back to view
                  else onOpenChange(false);
                }}
              >
                {mode === "create" ? "Hủy" : "Quay lại"}
              </Button>
              <Button
                onClick={() => {
                  if (mode === "create") handleCreateOrUpdate();
                  if (mode === "location") handleLocationUpdate();
                  if (mode === "liquidate") handleLiquidation();
                  if (mode === "sell") handleConfirmSale();
                }}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
