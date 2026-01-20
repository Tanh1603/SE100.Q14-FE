"use client";

import { AuditLog } from "@/types/audit-log";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const AuditLogColumn: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "actorName",
    header: "Người thực hiện",
  },
  {
    accessorKey: "action",
    header: "Hành động",
  },
  {
    accessorKey: "entityType",
    header: "Loại thực thể",
  },
  {
    accessorKey: "entityName",
    header: "Tên thực thể",
    cell: ({ row }) => {
      const text = row.original.entityName || "-";
      return (
        <div
          className="line-clamp-1 truncate max-w-[200px]"
          title={text}
        >
          {text}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const text = row.original.description || "-";
      return (
        <div
          className="line-clamp-2 truncate max-w-[200px]"
          title={text}
        >
          {text}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Thời gian",
    cell: ({ row }) => {
      try {
        const date = new Date(row.original.createdAt);
        return (
          <div className="whitespace-nowrap truncate max-w-[200px]">
            {format(date, "dd/MM/yyyy HH:mm:ss")}
          </div>
        );
      } catch {
        return <div>-</div>;
      }
    },
  },
];
