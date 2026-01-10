"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LiquidatedItem = {
  id: string;
  contractNumber: string;
  customerName: string;
  assetName: string;
  loanAmount: number;
  liquidatedAt: string;
  soldPrice: number;
  profit: number;
  buyerDetails: string;
  status: string;
};

export const historyColumns: ColumnDef<LiquidatedItem>[] = [
  {
    accessorKey: "contractNumber",
    header: "Hợp đồng",
  },
  {
    accessorKey: "assetName",
    header: "Tài sản",
  },
  {
    accessorKey: "loanAmount",
    header: "Vay gốc",
    cell: ({ row }) => {
      const amount = row.getValue("loanAmount") as number;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
  },
  {
    accessorKey: "soldPrice",
    header: "Giá thanh lý",
    cell: ({ row }) => {
      const amount = row.getValue("soldPrice") as number;
      return (
        <span className="font-bold text-green-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "profit",
    header: "Thiệt hại/Lời",
    cell: ({ row }) => {
      const amount = row.getValue("profit") as number;
      const color = amount >= 0 ? "text-green-600" : "text-red-600";
      return (
        <span className={`font-bold ${color}`}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "liquidatedAt",
    header: "Ngày thanh lý",
  },
  {
    accessorKey: "buyerDetails",
    header: "Người mua",
  },
];
