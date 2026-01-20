"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SimpleDateRangePicker } from "@/components/ui/simple-date-range";
import { LoanService } from "@/lib/loan.service";
import { DisbursementService } from "@/lib/disbursement.service";
import { generateIdempotencyKey } from "@/lib/payment.service";
import { getUserRole, isManagerOrAdmin } from "@/lib/role.helper";
import { useUser } from "@clerk/nextjs";
import { addDays, isWithinInterval } from "date-fns";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { getLoanColumns, EnrichedLoan } from "./columns";
import { Badge } from "@/components/ui/badge";
import { EditPendingLoanDialog } from "@/components/features/loan/edit-pending-loan-dialog";

export default function LoanManagementPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [data, setData] = useState<EnrichedLoan[]>([]);
  const [filteredData, setFilteredData] = useState<EnrichedLoan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [isEditPendingDialogOpen, setIsEditPendingDialogOpen] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string>("");
  const [editingLoanCode, setEditingLoanCode] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Role Guard
  useEffect(() => {
    if (isLoaded) {
      const userRole = getUserRole(user?.publicMetadata);
      if (!isManagerOrAdmin(userRole)) {
        toast.error("Bạn không có quyền truy cập trang này");
        router.push("/home");
      }
    }
  }, [isLoaded, user, router]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await LoanService.getAllLoans(
        page,
        limit,
        undefined,
        "PENDING",
      );

      // Enrich each loan with collateral info by fetching details
      const enrichedLoans = await Promise.all(
        response.data.map(async (summaryLoan) => {
          try {
            const detail = await LoanService.getLoanById(summaryLoan.id);

            // Extract collateral asset info
            const collateralAssets = (detail.collateral || []).map((c) => {
              // Try to get a readable name from collateralInfo
              let assetName = "Tài sản";
              if (c.collateralInfo) {
                const info = c.collateralInfo as Record<string, unknown>;
                assetName =
                  (info.name as string) ||
                  (info.description as string) ||
                  (info.ten as string) ||
                  (info.brand ? `${info.brand} ${info.model || ""}` : "") ||
                  c.ownerName ||
                  "Tài sản";
              }

              return {
                id: c.id,
                name: assetName.trim() || "Tài sản",
                appraisedValue: c.appraisedValue || 0,
                status: c.status,
              };
            });

            return {
              ...summaryLoan,
              loanTypeName: detail.loanTypeName,
              loanStatus: detail.status,
              collateralAssets,
            } as EnrichedLoan;
          } catch (err) {
            console.error(
              `Failed to fetch details for loan ${summaryLoan.id}`,
              err,
            );
            return {
              ...summaryLoan,
              loanStatus: "PENDING",
              collateralAssets: [],
            } as EnrichedLoan;
          }
        }),
      );

      setData(enrichedLoans);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách khoản vay");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side filtering
  useEffect(() => {
    let result = data;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.customer.fullName.toLowerCase().includes(q) ||
          item.contractNumber?.toLowerCase().includes(q),
      );
    }

    // Date Range filter
    if (dateRange?.from && dateRange?.to) {
      result = result.filter((item) => {
        const date = new Date(item.loanDate);
        return isWithinInterval(date, {
          start: dateRange.from!,
          end: dateRange.to!,
        });
      });
    }

    setFilteredData(result);
  }, [data, search, dateRange]);

  const handleApprove = async (loan: EnrichedLoan) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt khoản vay này?")) return;
    try {
      // 1. Approve Loan
      await LoanService.approveLoan(loan.id, "Approved by Manager");

      // 2. Fetch full details to get Store ID (as summary might miss it)
      // Note: If loan object already has storeId in asset.warehouses.id, we could use it,
      // but adapter sets it to 'unknown' or 'wh-1' if missing in summary. Safest to fetch.
      const fullLoan = await LoanService.getLoanById(loan.id);

      if (!fullLoan.storeId) {
        toast.error(
          "Không thể giải ngân tự động: Thiếu thông tin Chi nhánh (Store ID)",
        );
        return;
      }

      // 3. Auto Disburse
      await DisbursementService.create(
        {
          loanId: loan.id,
          storeId: fullLoan.storeId,
          amount: fullLoan.loanAmount,
          disbursementMethod: "CASH", // Defaulting to CASH for auto-flow
          recipientName: fullLoan.customer?.fullName || "Khách hàng",
          notes: "Giải ngân tự động sau khi duyệt",
        },
        generateIdempotencyKey(),
      );

      toast.success("Đã duyệt và giải ngân thành công!");
      fetchData(); // Refresh list
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể xử lý khoản vay";
      toast.error(`Lỗi: ${errorMessage}`);
    }
  };

  const handleReject = async (loan: EnrichedLoan) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (reason === null) return; // Cancelled

    try {
      await LoanService.rejectLoan(loan.id, reason || "Rejected by Manager");
      toast.success("Đã từ chối khoản vay");
      fetchData(); // Refresh
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi từ chối khoản vay");
    }
  };

  const handleView = (loan: EnrichedLoan) => {
    // Navigate to details using ID as per API requirement for pending loans
    router.push(`/contracts/${loan.id}`);
  };

  const handleEdit = (loan: EnrichedLoan) => {
    setEditingLoanId(loan.id);
    setEditingLoanCode(loan.contractNumber || loan.id);
    setIsEditPendingDialogOpen(true);
  };

  const columns = getLoanColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onView: handleView,
    onEdit: handleEdit,
    userRole: getUserRole(user?.publicMetadata),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Duyệt Khoản Vay (Chờ duyệt)
        </h1>
        <p className="text-muted-foreground">
          Danh sách các khoản vay đang chờ phê duyệt.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách chờ duyệt</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {totalItems} khoản vay
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm tên, mã HĐ..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <SimpleDateRangePicker date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={filteredData} />

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <div className="text-sm">
                  Trang {page} / {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page >= totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EditPendingLoanDialog
        open={isEditPendingDialogOpen}
        onOpenChange={setIsEditPendingDialogOpen}
        loanId={editingLoanId}
        loanCode={editingLoanCode}
        onSuccess={fetchData}
      />
    </div>
  );
}
