"use client";

import { Button } from "@/components/ui/button";
import { AssetTypeFieldEnum } from "@/types/enum";
import { ColumnDef } from "@tanstack/react-table";
import {
  LucideImageOff,
  Trash2,
  Banknote,
  Eye,
  MessageSquare,
  Check,
  X,
  Edit,
} from "lucide-react";
import Image from "next/image";

export type AssetColumnDef = {
  id: string;
  name: string;
  image: string;
  warehouse: {
    id: string;
    name: string;
  };
  assetType: {
    id: string;
    name: string;
    field: {
      id: string;
      label: string; // nhãn ví dụ vàng
      required: boolean; // cần hay không
      type: AssetTypeFieldEnum; // string, date, number
    }[];
    fieldValues?: Record<string, string>; // key = field.id, value = input
  };
};

export const AssetColumn = (
  onDelete: (row: AssetColumnDef) => void,
): ColumnDef<AssetColumnDef>[] => [
  {
    accessorKey: "name",
    header: "Tên tài sản",
  },

  {
    accessorKey: "warehouse.name",
    header: "Tên kho",
  },

  {
    accessorKey: "assetType.name",
    header: "Tên loại tài sản",
  },

  {
    accessorKey: "image",
    header: "Ảnh",
    cell: ({ row }) => {
      const avatar = row.original.image;

      return (
        <div className="flex justify-center">
          <div className="relative w-10 h-10">
            {avatar ? (
              <Image
                src={avatar}
                alt={row.original.name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <LucideImageOff className="w-10 h-10 text-muted-foreground flex items-center justify-center" />
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

import { loan } from "@/types/asset";
import { AssetStatus } from "@/types/enum";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const LoanActions = ({ row }: { row: any }) => {
  // Get the loan status
  const rawStatus = (row.original as any).status || row.original.asset?.status;
  const isActiveLoan = rawStatus === "ACTIVE";
  const isOverdueLoan = rawStatus === "OVERDUE";
  const isPendingLoan = rawStatus === "PENDING";
  const showPaymentActions = isActiveLoan || isOverdueLoan;

  // PENDING loans - show approve/reject/edit buttons
  if (isPendingLoan) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Xem chi tiết"
        >
          <Eye className="w-4 h-4 text-gray-500" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          title="Sửa hồ sơ"
          onClick={() => {
            const event = new CustomEvent("edit-pending-loan", {
              detail: {
                loanId: row.original.id,
                loanCode:
                  (row.original as any).contractNumber || row.original.id,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          <Edit className="w-4 h-4 mr-1" /> Sửa hồ sơ
        </Button>
        <Button
          size="sm"
          className="h-8 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            const event = new CustomEvent("approve-loan", {
              detail: {
                loanId: row.original.id,
                loanCode:
                  (row.original as any).contractNumber || row.original.id,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          <Check className="w-4 h-4 mr-1" /> Duyệt
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-8"
          onClick={() => {
            const event = new CustomEvent("reject-loan", {
              detail: {
                loanId: row.original.id,
                loanCode:
                  (row.original as any).contractNumber || row.original.id,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          <X className="w-4 h-4 mr-1" /> Từ chối
        </Button>
      </div>
    );
  }

  // Non-actionable states (CLOSED, REJECTED, etc.) - only show view button
  if (!showPaymentActions) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Xem chi tiết"
        >
          <Eye className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    );
  }

  // ACTIVE and OVERDUE loans - show payment actions
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-2"
        title="Xem chi tiết"
      >
        <Eye className="w-4 h-4 text-gray-500" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
        onClick={() => {
          const event = new CustomEvent("quick-pay", {
            detail: {
              loanId: row.original.id,
              loanCode: (row.original as any).contractNumber || row.original.id,
            },
          });
          window.dispatchEvent(event);
        }}
      >
        <Banknote className="w-4 h-4 mr-1" /> Thu lãi
      </Button>

      {/* Show "Nhắc nợ" button for OVERDUE loans */}
      {isOverdueLoan && (
        <Button
          size="sm"
          variant="secondary"
          className="h-8 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
          onClick={() => {
            const event = new CustomEvent("debt-reminder", {
              detail: {
                loanId: row.original.id,
                loanCode:
                  (row.original as any).contractNumber || row.original.id,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          <MessageSquare className="w-4 h-4 mr-1" /> Nhắc nợ
        </Button>
      )}
    </div>
  );
};

import { Badge } from "@/components/ui/badge";

export const LoanColumn: ColumnDef<loan>[] = [
  {
    accessorKey: "contractNumber",
    header: "Mã HĐ",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-primary">
        {(row.original as any).contractNumber || "---"}
      </span>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: "Khách hàng",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.original.customer.fullName}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.customer.phone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "asset.name",
    header: "Loại Vay",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.asset.name}</span>
        {/* <span className="text-xs text-muted-foreground">{row.original.asset.assetType?.name}</span> */}
      </div>
    ),
  },
  {
    accessorKey: "totalLoan",
    header: "Khoản vay",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-green-700">
          {formatCurrency(row.getValue("totalLoan"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "loanDate",
    header: "Ngày vay",
    cell: ({ row }) => {
      const dateStr = row.getValue("loanDate") as string;
      if (!dateStr)
        return <span className="text-muted-foreground">--/--/----</span>;
      // Handle both ISO strings and YYYY-MM-DD
      const date = new Date(dateStr);
      return <span>{new Intl.DateTimeFormat("vi-VN").format(date)}</span>;
    },
  },
  {
    id: "status",
    accessorKey: "status", // Use the direct status string if available from adapter
    header: "Trạng thái",
    cell: ({ row }) => {
      // Adapter maps API status to row.original.status (string) OR asset.status (enum)
      // Let's use the status string if it exists on the object (added in adapter)
      const rawStatus =
        (row.original as any).status || row.original.asset.status;

      let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
        "outline";
      let badgeClassName = "";
      let label = rawStatus;

      switch (rawStatus) {
        case "ACTIVE":
          badgeVariant = "outline";
          badgeClassName =
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
          label = "Đang vay";
          break;
        case "OVERDUE":
          badgeVariant = "destructive";
          badgeClassName =
            "bg-red-600 hover:bg-red-700 text-white font-bold border-transparent";
          label = "Quá hạn";
          break;
        case "CLOSED":
          badgeVariant = "secondary";
          badgeClassName =
            "bg-slate-800 text-slate-100 hover:bg-slate-700 border-transparent";
          label = "Đã đóng";
          break;
        case "PENDING":
          badgeVariant = "outline";
          badgeClassName =
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
          label = "Chờ duyệt";
          break;
        case "REJECTED":
          badgeVariant = "destructive";
          badgeClassName =
            "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200";
          label = "Từ chối";
          break;
        default:
          // Fallback for AssetStatus enum values
          if (rawStatus === AssetStatus.PLEDGED) {
            badgeVariant = "default";
            badgeClassName =
              "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200";
            label = "Đang cầm";
          }
          break;
      }

      return (
        <Badge
          variant={badgeVariant}
          className={`whitespace-nowrap ${badgeClassName}`}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <LoanActions row={row} />
      </div>
    ),
  },
];
