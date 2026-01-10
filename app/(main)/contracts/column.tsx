"use client";

import { Button } from "@/components/ui/button";
import { AssetTypeFieldEnum } from "@/types/enum";
import { ColumnDef } from "@tanstack/react-table";
import {
  LucideImageOff,
  Trash2,
  Banknote,
  Eye,
  History as HistoryIcon,
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
  onDelete: (row: AssetColumnDef) => void
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

import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";

const LoanActions = ({ row }: { row: any }) => {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as Role) || "staff";
  const canRefinance = ["admin", "manager"].includes(role);

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
              loanId: (row.original as any).contractNumber || "HD-NEW",
              amount:
                (row.original.totalLoan * row.original.interestRate) / 100,
            },
          });
          window.dispatchEvent(event);
        }}
      >
        <Banknote className="w-4 h-4 mr-1" /> Thu lãi
      </Button>

      {canRefinance && (
        <Button
          size="sm"
          variant="secondary"
          className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          title="Gia hạn hợp đồng (Chỉ quản lý)"
          onClick={() => {
            const event = new CustomEvent("refinance-loan", {
              detail: {
                id: (row.original as any).contractNumber || "HD-NEW",
                customerName: row.original.customer.fullName,
                amount: row.original.totalLoan,
                maturityDate: (row.original as any).endDate, // Assuming endDate exists or null
                interestRate: row.original.interestRate,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          <HistoryIcon className="w-4 h-4 mr-1" /> Gia hạn
        </Button>
      )}
    </div>
  );
};

export const LoanColumn: ColumnDef<loan>[] = [
  // ... previous columns ...
  {
    accessorKey: "contractNumber",
    header: "Mã HĐ",
    // Fix: cast to any to avoid TS error if contractNumber is missing in type definition
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {(row.original as any).contractNumber || "---"}
      </span>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: "Tên khách hàng",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.customer.fullName}</span>
    ),
  },
  {
    accessorKey: "asset.name",
    header: "Tên tài sản",
    cell: (info) => info.getValue() as string, // Simplification
  },
  {
    accessorKey: "totalLoan",
    header: "Số tiền vay",
    cell: ({ row }) => (
      <span className="text-primary font-bold">
        {formatCurrency(row.getValue("totalLoan"))}
      </span>
    ),
  },
  {
    // Placeholder for "Interest to date"
    id: "interest",
    header: "Lãi tạm tính",
    cell: ({ row }) => {
      // Simple mock calculation: 1 month of interest
      const interest =
        (row.original.totalLoan * row.original.interestRate) / 100;
      return (
        <span className="text-orange-600">{formatCurrency(interest)}</span>
      );
    },
  },
  {
    accessorKey: "asset.status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.asset.status;
      const isPledged = status === AssetStatus.PLEDGED;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isPledged
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        >
          {isPledged ? "Đang cầm" : status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <LoanActions row={row} />,
  },
];
