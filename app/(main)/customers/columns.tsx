"use client";

import { Customer } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import { LucideImageOff } from "lucide-react";
import Image from "next/image";

export const CustomerColumn: ColumnDef<Customer>[] = [
  {
    accessorKey: "fullName",
    header: "Tên khách hàng",
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
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Tình trạng",
  },
  {
    accessorKey: "avatar",
    header: "Ảnh",
    cell: ({ row }) => {
      const avatar = row.original.avatar;

      return (
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            {avatar ? (
              <Image
                src={avatar}
                alt={row.original.fullName}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <LucideImageOff className="w-20 h-20 text-muted-foreground flex items-center justify-center" />
            )}
          </div>
        </div>
      );
    },
  },
];
