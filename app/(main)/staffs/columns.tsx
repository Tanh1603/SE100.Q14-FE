"use client";

// import { GENDER_OPTIONS } from "@/types/enum";
import { Staff } from "@/types/staff";
import { ColumnDef } from "@tanstack/react-table";

export const StaffColumn: ColumnDef<Staff>[] = [
  {
    accessorKey: "fullName",
    header: "Tên nhân viên",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  // {
  //   accessorKey: "gender",
  //   header: "Giới tính",
  //   cell: ({ row }) => {
  //     const gender = row.original.gender;
  //     return GENDER_OPTIONS.find((g) => g.value === gender)?.label ?? "-";
  //   },
  // },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  {
    accessorKey: "role",
    header: "Chức vụ",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  // {
  //   accessorKey: "dob",
  //   header: "Ngày sinh",
  // },
  // {
  //   accessorKey: "cccd",
  //   header: "Số cccd",
  // },

  {
    accessorKey: "storeName",
    header: "Cửa hàng",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  {
    accessorKey: "hireDate",
    header: "Ngày vào làm",
  },
  {
    accessorKey: "terminatedDate",
    header: "Ngày nghỉ việc",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? value : "—";
    },
  },
];
