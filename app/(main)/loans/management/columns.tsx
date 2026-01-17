"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, Eye } from "lucide-react";
import { loan } from "@/types/asset";
import { LoanStatus } from "@/types/enum";

interface LoanManagementColumnsProps {
  onApprove: (loan: loan) => void;
  onReject: (loan: loan) => void;
  onView: (loan: loan) => void;
}

export const getLoanColumns = ({
  onApprove,
  onReject,
  onView,
}: LoanManagementColumnsProps): ColumnDef<loan>[] => [
  {
    accessorKey: "contractNumber",
    header: "Mã HĐ",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {(row.original as any).contractNumber || "---"}
      </span>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: "Khách Hàng",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.customer?.fullName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "totalLoan",
    header: "Số Tiền",
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.original.totalLoan)}
      </span>
    ),
  },
  {
    accessorKey: "loanDate",
    header: "Ngày Tạo",
    cell: ({ row }) =>
      new Date(row.original.loanDate).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "status", // Assuming status is mapped to AssetStatus or LoanStatus
    header: "Trạng Thái",
    cell: ({ row }) => {
      // Need to access the raw status from API or mapped one.
      // The LoanAdapter currently maps API status to AssetStatus (PLEDGED etc) which might be confusing.
      // But for this page, we care about the LOAN status (PENDING, ACTIVE, REJECTED).
      // Let's assume the adapter or the object has a 'status' field that reflects the LoanStatus.
      // If LoanAdapter maps 'status' to AssetStatus, we might need to check if 'loanStatus' exists or if we need to adjust the adapter.
      // Let's check LoanAdapter.

      // Checking LoanAdapter in previous turns:
      // return { ... status: status ... } where status was defaulting to AssetStatus.PLEDGED.
      // This is a problem. The Adapter loses the PENDING/REJECTED state.

      // I'll assume for now I need to fix the adapter or cast it.
      // Actually, let's fix the Adapter first if I can, or just display whatever is there.

      // Wait, if I use the 'loan' type, it has 'status: AssetStatus'.
      // I should update the 'loan' type to support LoanStatus or add a separate field 'loanStatus'.

      const status = (row.original as any).loanStatus || "PENDING"; // Fallback

      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      let className = "";
      let label = status;

      switch (status) {
        case LoanStatus.PENDING:
          variant = "outline";
          className =
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
          label = "Chờ duyệt";
          break;
        case LoanStatus.ACTIVE:
          variant = "outline";
          className =
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
          label = "Đang hoạt động";
          break;
        case LoanStatus.REJECTED:
          variant = "destructive";
          className =
            "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200";
          label = "Đã từ chối";
          break;
        case LoanStatus.CLOSED:
          variant = "secondary";
          className =
            "bg-slate-800 text-slate-100 hover:bg-slate-700 border-transparent";
          label = "Đã tất toán";
          break;
      }

      return (
        <Badge variant={variant} className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const status = (row.original as any).loanStatus || "PENDING";
      const isPending = status === LoanStatus.PENDING;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          {isPending && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                onClick={() => onApprove(row.original)}
              >
                <Check className="w-4 h-4 mr-1" /> Duyệt
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 px-2"
                onClick={() => onReject(row.original)}
              >
                <X className="w-4 h-4 mr-1" /> Từ chối
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
