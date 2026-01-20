"use client";

import { Branch } from "@/types/branch";
import { BRANCH_STATUS_OPTIONS, BranchStatus } from "@/types/enum";
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
      const fullAddress = row.original.address + ", " + (row.original.wardName) + ", " + (row.original.provinceName);
      return <div>{fullAddress}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      const label =
        BRANCH_STATUS_OPTIONS.find(
          (w) => w.value === (isActive ? BranchStatus.ACTIVE : BranchStatus.CLOSE)
        )?.label ?? "-";

      return (
        <span
          className={`font-medium ${isActive ? "text-green-600" : "text-red-600"
            }`}
        >
          {label}
        </span>
      );
    },
  }

];
