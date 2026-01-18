"use client";

import { CustomerDTO } from "@/types/dto/customer.dto";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const CustomerColumn: ColumnDef<CustomerDTO>[] = [
  {
    accessorKey: "fullName",
    header: "Tên khách hàng",
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const dob = row.original.dob;
      if (!dob) return "-";
      // Format date to DD/MM/YYYY
      const date = new Date(dob);
      return date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "nationalId",
    header: "Số CCCD",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => row.original.address || "-",
  },
  {
    accessorKey: "customerType",
    header: "Loại KH",
    cell: ({ row }) => {
      const type = row.original.customerType;
      if (type === "VIP") {
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">VIP</Badge>;
      }
      return <Badge variant="secondary">Thường</Badge>;
    },
  },
];
