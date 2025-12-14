"use client";

import { WAREHOUSE_OPTIONS } from "@/types/enum";
import { Warehouse } from "@/types/warehouse";
import { ColumnDef } from "@tanstack/react-table";

export const WarehouseColumn: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "name",
    header: "Tên kho",
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

      return WAREHOUSE_OPTIONS.find((w) => w.value === status)?.label ?? "-";
    },
  },
];
