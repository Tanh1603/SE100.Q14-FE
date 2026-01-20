"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Hammer } from "lucide-react";

export type LiquidationCandidate = {
  id: string;
  contractNumber: string;
  customerName: string;
  assetName: string;
  loanAmount: number;
  overdueDays: number;
  status: string;
  phone: string;
};

export const columns: ColumnDef<LiquidationCandidate>[] = [
  {
    accessorKey: "contractNumber",
    header: "Số HĐ",
  },
  {
    accessorKey: "customerName",
    header: "Khách hàng",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.customerName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "assetName",
    header: "Tài sản",
  },
  {
    accessorKey: "loanAmount",
    header: "Khoản vay",
    cell: ({ row }) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(row.getValue("loanAmount")),
  },
  {
    accessorKey: "overdueDays",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quá hạn (ngày)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const days = row.getValue("overdueDays") as number;
      return (
        <Badge variant={days >= 7 ? "destructive" : "secondary"}>
          {days} ngày
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Actions will be handled in the main page via DataTable or a meaningful action button
      // For now returning null as we will use a row click or a specific action button outside if needed
      // Or we can put the "Thanh lý" button here.
      return (
        <Button size="sm" variant="destructive" className="flex gap-2">
          <Hammer className="w-4 h-4" />
          Thanh lý
        </Button>
      );
    },
  },
];
