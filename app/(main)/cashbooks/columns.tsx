"use client";

import type { Payment } from "@/types/payment";
import {
  PaymentMethodEnum,
  PaymentTypeEnum,
  PaymentFlowEnum,
  PaymentMethodColor,
  PaymentTypeColor,
  PaymentFlowColor,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_FLOW_OPTIONS,
} from "@/types/enum";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/payment.service";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

// Helper to get label from options
const getMethodLabel = (value: string) =>
  PAYMENT_METHOD_OPTIONS.find((o) => o.value === value)?.label || value;

const getTypeLabel = (value: string) => {
  // Handle new DISBURSEMENT type
  if (value === "DISBURSEMENT") return "Giải ngân";
  return PAYMENT_TYPE_OPTIONS.find((o) => o.value === value)?.label || value;
};

const getFlowLabel = (value: string) =>
  PAYMENT_FLOW_OPTIONS.find((o) => o.value === value)?.label || value;

export const PaymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "flow",
    header: "Loại",
    cell: ({ row }) => {
      const flow = row.original.flow as PaymentFlowEnum;
      const isIn = flow === PaymentFlowEnum.IN;
      const colorClass = PaymentFlowColor[flow] || "bg-gray-100 text-gray-800";
      const Icon = isIn ? ArrowDownCircle : ArrowUpCircle;
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          <Icon className="w-3 h-3" />
          {getFlowLabel(flow)}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "referenceCode",
  //   header: "Mã giao dịch",
  //   cell: ({ row }) => (
  //     <span className="font-medium text-primary">
  //       {row.original.referenceCode || "-"}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "loan.contractNumber",
    header: "Hợp đồng",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.loan?.contractNumber || "-"}
        </span>
        <span className="text-sm text-muted-foreground">
          {row.original.loan?.customerName || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) => {
      const flow = row.original.flow;
      const isOut = flow === "OUT";
      const colorClass = isOut ? "text-red-600" : "text-green-600";
      const prefix = isOut ? "-" : "+";
      return (
        <span className={`font-semibold ${colorClass}`}>
          {prefix} {formatCurrency(row.original.amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Phương thức",
    cell: ({ row }) => {
      const method = row.original.paymentMethod as PaymentMethodEnum;
      const colorClass =
        PaymentMethodColor[method] || "bg-gray-100 text-gray-800";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {getMethodLabel(method)}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentType",
    header: "Loại thanh toán",
    cell: ({ row }) => {
      const type = row.original.paymentType as PaymentTypeEnum;
      // Use orange for disbursement type
      const colorClass =
        type === ("DISBURSEMENT" as PaymentTypeEnum)
          ? "bg-orange-100 text-orange-800"
          : PaymentTypeColor[type] || "bg-gray-100 text-gray-800";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {getTypeLabel(type)}
        </span>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Thời gian",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.paidAt)}
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Ghi chú",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
        {row.original.notes || "-"}
      </span>
    ),
  },
];
