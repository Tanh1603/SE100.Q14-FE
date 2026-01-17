"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CollateralAssetResponse } from "@/types/dto/collateral.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Box, Gavel, RefreshCw, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AssetColumns = (
  onAction: (action: string, asset: CollateralAssetResponse) => void,
  isAdminOrManager: boolean,
): ColumnDef<CollateralAssetResponse>[] => [
  {
    accessorKey: "collateralInfo",
    header: "Tài sản",
    cell: ({ row }) => {
      // Assuming collateralInfo has a 'name' or we construct it
      const info = row.original.collateralInfo as {
        name?: string;
        description?: string;
      };
      const name =
        info?.name ||
        info?.description ||
        `Tài sản #${row.original.id.slice(0, 4)}`;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">
            Loại: {row.original.collateralTypeId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";
      let label: string = status;

      switch (status) {
        case "PROPOSED":
          label = "Mới / Đề xuất";
          variant = "outline";
          break;
        case "PLEDGED":
          label = "Đang cầm cố";
          variant = "default";
          break;
        case "STORED":
          label = "Đã nhập kho";
          variant = "secondary";
          break;
        case "LIQUIDATING":
          label = "Đang thanh lý";
          variant = "destructive";
          break;
        case "SOLD":
          label = "Đã bán";
          variant = "secondary";
          break;
        case "RELEASED":
          label = "Đã trả khách";
          variant = "outline";
          break;
        case "REJECTED":
          label = "Đã từ chối";
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "ownerName",
    header: "Chủ sở hữu",
  },
  {
    accessorKey: "loanCode",
    header: "Hợp đồng",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.loanCode || "-"}</span>
    ),
  },
  {
    accessorKey: "storageLocation",
    header: "Vị trí",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        {row.original.storageLocation ? (
          <>
            <MapPin className="w-3 h-3 text-muted-foreground" />
            {row.original.storageLocation}
          </>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    accessorKey: "sellPrice",
    header: "Giá bán",
    cell: ({ row }) => {
      const asset = row.original;
      if (asset.status === "LIQUIDATING" && asset.sellPrice) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Giá định bán</span>
            <span className="font-medium text-orange-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(asset.sellPrice)}
            </span>
          </div>
        );
      }
      if (asset.status === "SOLD" && asset.sellPrice) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Giá bán thực tế
            </span>
            <span className="font-medium text-teal-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(asset.sellPrice)}
            </span>
          </div>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asset = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

            {/* View/Edit is always available */}
            <DropdownMenuItem onClick={() => onAction("view", asset)}>
              Xem chi tiết
            </DropdownMenuItem>

            {/* Warehouse/Location Update - Admin/Manager */}
            {isAdminOrManager &&
              (asset.status === "PLEDGED" || asset.status === "STORED") && (
                <DropdownMenuItem onClick={() => onAction("location", asset)}>
                  <Box className="w-4 h-4 mr-2" /> Cập nhật vị trí
                </DropdownMenuItem>
              )}

            {/* Liquidation - Admin/Manager only, usually if Overdue or Stored */}
            {isAdminOrManager &&
              (asset.status === "STORED" || asset.status === "PLEDGED") && (
                <DropdownMenuItem
                  onClick={() => onAction("liquidate", asset)}
                  className="text-red-600"
                >
                  <Gavel className="w-4 h-4 mr-2" /> Thanh lý tài sản
                </DropdownMenuItem>
              )}

            {/* Disposition - If Liquidating */}
            {isAdminOrManager && asset.status === "LIQUIDATING" && (
              <DropdownMenuItem onClick={() => onAction("sell", asset)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Xác nhận đã bán
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
