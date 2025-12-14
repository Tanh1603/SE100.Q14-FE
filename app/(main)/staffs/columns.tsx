"use client";

import { GENDER_OPTIONS } from "@/types/enum";
import { Staff } from "@/types/staff";
import { ColumnDef } from "@tanstack/react-table";

export const StaffColumn: ColumnDef<Staff>[] = [
  {
    accessorKey: "fullName",
    header: "Tên nhân viên",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      const gender = row.original.gender;
      return GENDER_OPTIONS.find((g) => g.value === gender)?.label ?? "-";
    },
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
  },
  {
    accessorKey: "cccd",
    header: "Số cccd",
  },

  {
    accessorKey: "branch.name",
    header: "Cửa hàng",
  },
];
