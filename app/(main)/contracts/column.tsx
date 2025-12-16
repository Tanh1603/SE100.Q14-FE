"use client";

import { Button } from "@/components/ui/button";
import { AssetTypeFieldEnum } from "@/types/enum";
import { ColumnDef } from "@tanstack/react-table";
import { LucideImageOff, Trash2 } from "lucide-react";
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

export const LoanColumn: ColumnDef<loan>[] = [
  {
    accessorKey: "customer.fullName",
    header: "Tên khách hàng",
  },
  {
    accessorKey: "asset.name",
    header: "Tên tài sản",
  },
  {
    accessorKey: "totalLoan",
    header: "Số tiền vay",
    cell: ({ row }) => formatCurrency(row.getValue("totalLoan")),
  },
  {
    // Placeholder for "Amount Paid" - for now using 0 as per mock data limits
    id: "amountPaid",
    header: "Số tiền đã trả",
    cell: () => formatCurrency(0),
  },
  {
    // Placeholder for "Remaining" - for now using totalLoan
    id: "remaining",
    header: "Tiền vay còn lại",
    cell: ({ row }) => formatCurrency(row.original.totalLoan),
  },
  {
    // Placeholder for "Interest to date"
    id: "interest",
    header: "Lãi đến hôm nay",
    cell: ({ row }) => {
      // Simple mock calculation: 1 month of interest
      const interest =
        (row.original.totalLoan * row.original.interestRate) / 100;
      return formatCurrency(interest);
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
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isPledged ? "Đang cầm" : status}
        </span>
      );
    },
  },
];
