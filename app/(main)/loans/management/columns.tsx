"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, Eye, Package, Edit } from "lucide-react";
import { loan } from "@/types/asset";
import { LoanStatus } from "@/types/enum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Extended loan type with collateral info for this page
export interface EnrichedLoan extends loan {
  contractNumber?: string;
  loanStatus?: string;
  loanTypeName?: string;
  collateralAssets?: Array<{
    id: string;
    name: string;
    appraisedValue: number;
    status: string;
  }>;
}

interface LoanManagementColumnsProps {
  onApprove: (loan: EnrichedLoan) => void;
  onReject: (loan: EnrichedLoan) => void;
  onView: (loan: EnrichedLoan) => void;
  onEdit: (loan: EnrichedLoan) => void;
}

// Format currency helper
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export const getLoanColumns = ({
  onApprove,
  onReject,
  onView,
  onEdit,
}: LoanManagementColumnsProps): ColumnDef<EnrichedLoan>[] => [
  {
    accessorKey: "contractNumber",
    header: "Mã HĐ",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.original.contractNumber || "---"}
      </span>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: "Khách Hàng",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.customer?.fullName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "loanTypeName",
    header: "Loại Vay",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        {row.original.loanTypeName ||
          row.original.asset?.assetType?.name ||
          "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "totalLoan",
    header: "Số Tiền",
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        {formatCurrency(row.original.totalLoan)}
      </span>
    ),
  },
  {
    id: "collateral",
    header: "Tài sản Thế Chấp",
    cell: ({ row }) => {
      const assets = row.original.collateralAssets;

      if (!assets || assets.length === 0) {
        return (
          <span className="text-muted-foreground text-sm italic">
            Không có tài sản
          </span>
        );
      }

      // Calculate total appraisal value
      const totalValue = assets.reduce(
        (sum, a) => sum + (a.appraisedValue || 0),
        0,
      );

      // Show first asset, with tooltip for all if multiple
      const firstAsset = assets[0];
      const hasMore = assets.length > 1;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">
                    {firstAsset.name}
                  </span>
                  {hasMore && (
                    <Badge variant="secondary" className="text-xs px-1.5">
                      +{assets.length - 1}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Định giá:{" "}
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <div className="space-y-2">
                <p className="font-semibold text-sm">
                  Danh sách tài sản thế chấp:
                </p>
                {assets.map((asset, idx) => (
                  <div
                    key={asset.id || idx}
                    className="border-b last:border-0 pb-1 last:pb-0"
                  >
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs">
                      Định giá:{" "}
                      <span className="text-emerald-600">
                        {formatCurrency(asset.appraisedValue)}
                      </span>
                    </p>
                  </div>
                ))}
                <div className="pt-1 border-t font-semibold">
                  Tổng: {formatCurrency(totalValue)}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "loanDate",
    header: "Ngày Tạo",
    cell: ({ row }) =>
      new Date(row.original.loanDate).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "status", // Assuming status is mapped to AssetStatus or LoanStatus
    header: "Trạng Thái",
    cell: ({ row }) => {
      // Need to access the raw status from API or mapped one.
      // The LoanAdapter currently maps API status to AssetStatus (PLEDGED etc) which might be confusing.
      // But for this page, we care about the LOAN status (PENDING, ACTIVE, REJECTED).
      // Let's assume the adapter or the object has a 'status' field that reflects the LoanStatus.
      // If LoanAdapter maps 'status' to AssetStatus, we might need to check if 'loanStatus' exists or if we need to adjust the adapter.
      // Let's check LoanAdapter.

      // Checking LoanAdapter in previous turns:
      // return { ... status: status ... } where status was defaulting to AssetStatus.PLEDGED.
      // This is a problem. The Adapter loses the PENDING/REJECTED state.

      // I'll assume for now I need to fix the adapter or cast it.
      // Actually, let's fix the Adapter first if I can, or just display whatever is there.

      // Wait, if I use the 'loan' type, it has 'status: AssetStatus'.
      // I should update the 'loan' type to support LoanStatus or add a separate field 'loanStatus'.

      const status = row.original.loanStatus || "PENDING"; // Fallback

      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      let className = "";
      let label = status;

      switch (status) {
        case LoanStatus.PENDING:
          variant = "outline";
          className =
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
          label = "Chờ duyệt";
          break;
        case LoanStatus.ACTIVE:
          variant = "outline";
          className =
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
          label = "Đang hoạt động";
          break;
        case LoanStatus.REJECTED:
          variant = "destructive";
          className =
            "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200";
          label = "Đã từ chối";
          break;
        case LoanStatus.CLOSED:
          variant = "secondary";
          className =
            "bg-slate-800 text-slate-100 hover:bg-slate-700 border-transparent";
          label = "Đã tất toán";
          break;
      }

      return (
        <Badge variant={variant} className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const status = row.original.loanStatus || "PENDING";
      const isPending = status === LoanStatus.PENDING;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          {isPending && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-2"
                onClick={() => onEdit(row.original)}
              >
                <Edit className="w-4 h-4 mr-1" /> Sửa hồ sơ
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                onClick={() => onApprove(row.original)}
              >
                <Check className="w-4 h-4 mr-1" /> Duyệt
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 px-2"
                onClick={() => onReject(row.original)}
              >
                <X className="w-4 h-4 mr-1" /> Từ chối
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
