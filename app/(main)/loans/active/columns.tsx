"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Banknote, Eye } from "lucide-react";
import { loan } from "@/types/asset";

interface ActiveLoanColumnsProps {
  onPay: (loan: loan) => void;
  onView: (loan: loan) => void;
}

export const getActiveLoanColumns = ({
  onPay,
  onView,
}: ActiveLoanColumnsProps): ColumnDef<loan>[] => [
  {
    accessorKey: "contractNumber",
    header: "Mã HĐ",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-primary">
        {(row.original as unknown as { contractNumber?: string })
          .contractNumber || "---"}
      </span>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: "Khách Hàng",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">
          {row.original.customer?.fullName || "N/A"}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.customer?.phone || ""}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalLoan",
    header: "Khoản Vay",
    cell: ({ row }) => (
      <span className="font-bold text-green-700">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.original.totalLoan)}
      </span>
    ),
  },
  {
    accessorKey: "interestRate",
    header: "Lãi Suất",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.interestRate}%/tháng</span>
    ),
  },
  {
    accessorKey: "loanDate",
    header: "Ngày Vay",
    cell: ({ row }) => {
      const dateStr = row.original.loanDate;
      if (!dateStr)
        return <span className="text-muted-foreground">--/--/----</span>;
      const date = new Date(dateStr);
      return <span>{new Intl.DateTimeFormat("vi-VN").format(date)}</span>;
    },
  },
  {
    accessorKey: "asset.name",
    header: "Loại Vay",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.asset?.name || "N/A"}</span>
    ),
  },
  {
    id: "status",
    header: "Trạng Thái",
    cell: () => (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
      >
        Đang vay
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          title="Xem chi tiết"
          onClick={() => onView(row.original)}
        >
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>
        <Button
          size="sm"
          className="h-8 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onPay(row.original)}
        >
          <Banknote className="w-4 h-4 mr-1" /> Thu lãi
        </Button>
      </div>
    ),
  },
];
