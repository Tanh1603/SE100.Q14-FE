"use client";

import { Branch } from "@/types/branch";
import { BRANCH_STATUS_OPTIONS } from "@/types/enum";
import { ColumnDef } from "@tanstack/react-table";

export const BranchColumn: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Tên chi nhánh",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const fullAddress =
        row.original.address +
        ", " +
        row.original.ward.label +
        ", " +
        row.original.province.label;

      return <div>{fullAddress}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        BRANCH_STATUS_OPTIONS.find((w) => w.value === status)?.label ?? "-"
      );
    },
  },
];
