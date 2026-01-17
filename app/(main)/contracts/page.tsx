"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  FileSignature,
  PlusCircle,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { LoanColumn } from "./column";
import Link from "next/link";
import { LoanService } from "@/lib/loan.service";
import { StoreService } from "@/lib/store.service";
import { CustomerService } from "@/lib/customer.service";
import { ContractCommandPanel } from "@/components/features/loan/contract-command-panel";
import { loan } from "@/types/asset";
import { Store } from "@/types/store";
import { Customer } from "@/types/customer";
import { PaymentDialog } from "@/components/features/payment/payment-dialog";
import { DebtReminderDialog } from "@/components/features/payment/debt-reminder-dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect } from "@/components/ui/searchable-select";

import { DateRange } from "react-day-picker";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";

const ContractPage = () => {
  const [selectedContract, setSelectedContract] = useState<
    (loan & { contractNumber?: string; endDate?: string }) | null
  >(null);
  const [openCommandPanel, setOpenCommandPanel] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDebtReminderDialogOpen, setIsDebtReminderDialogOpen] =
    useState(false);
  const router = useRouter();

  // State for data fetching & Filtering
  const [loans, setLoans] = useState<(loan & { contractNumber: string })[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [storeFilter, setStoreFilter] = useState("ALL");
  const [customerFilter, setCustomerFilter] = useState("ALL");
  const [periodFilter, setPeriodFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data
  const fetchLoans = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await LoanService.getAllLoans(
        page,
        limit,
        searchTerm,
        statusFilter,
        storeFilter,
        customerFilter,
        dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      );
      setLoans(response.data);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      setError("Không thể tải danh sách hợp đồng.");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    searchTerm,
    statusFilter,
    storeFilter,
    customerFilter,
    dateRange,
  ]);

  const fetchStores = async () => {
    try {
      const response = await StoreService.getStores({ limit: 100 });
      setStores(response.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAll(1, 100);
      setCustomers(response.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const triggerFetch = async () => {
      try {
        setIsLoading(true);
        const response = await LoanService.getAllLoans(
          page,
          limit,
          searchTerm, // This will use the CURRENT searchTerm when filters change
          statusFilter,
          storeFilter,
          customerFilter,
          dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
          dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        );
        setLoans(response.data);
        setTotalItems(response.meta.totalItems);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        console.error("Failed to fetch loans:", err);
        setError("Không thể tải danh sách hợp đồng.");
      } finally {
        setIsLoading(false);
      }
    };
    triggerFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, storeFilter, customerFilter, dateRange]); // Specifically NOT including searchTerm here

  const handleSearch = () => {
    setPage(1); // Reset to first page on search
    fetchLoans();
  };

  // Listen for events from Columns - Quick Pay opens PaymentDialog directly
  useEffect(() => {
    const handleQuickPay = (e: CustomEvent) => {
      if (e.detail?.loanId) {
        // Find the contract by ID and open PaymentDialog directly
        const contract = loans.find((c) => c.id === e.detail.loanId);
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setIsPaymentDialogOpen(true); // Open PaymentDialog directly
        }
      }
    };

    const handleDebtReminder = (e: CustomEvent) => {
      if (e.detail?.loanId) {
        // Find the contract by ID and open DebtReminderDialog
        const contract = loans.find((c) => c.id === e.detail.loanId);
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setIsDebtReminderDialogOpen(true); // Open DebtReminderDialog
        }
      }
    };

    const handleApproveLoan = async (e: CustomEvent) => {
      if (e.detail?.loanId) {
        if (
          !confirm(
            `Bạn có chắc chắn muốn duyệt khoản vay ${e.detail.loanCode}?`,
          )
        )
          return;
        try {
          await LoanService.approveLoan(e.detail.loanId, "Approved by Manager");
          alert("Đã duyệt khoản vay thành công!");
          fetchLoans(); // Refresh the list
        } catch (error) {
          console.error("Failed to approve loan:", error);
          alert("Lỗi khi duyệt khoản vay");
        }
      }
    };

    const handleRejectLoan = async (e: CustomEvent) => {
      if (e.detail?.loanId) {
        const reason = prompt("Nhập lý do từ chối:");
        if (reason === null) return; // Cancelled

        try {
          await LoanService.rejectLoan(
            e.detail.loanId,
            reason || "Rejected by Manager",
          );
          alert("Đã từ chối khoản vay!");
          fetchLoans(); // Refresh the list
        } catch (error) {
          console.error("Failed to reject loan:", error);
          alert("Lỗi khi từ chối khoản vay");
        }
      }
    };

    window.addEventListener("quick-pay", handleQuickPay as EventListener);
    window.addEventListener(
      "debt-reminder",
      handleDebtReminder as EventListener,
    );
    window.addEventListener(
      "approve-loan",
      handleApproveLoan as unknown as EventListener,
    );
    window.addEventListener(
      "reject-loan",
      handleRejectLoan as unknown as EventListener,
    );

    return () => {
      window.removeEventListener("quick-pay", handleQuickPay as EventListener);
      window.removeEventListener(
        "debt-reminder",
        handleDebtReminder as EventListener,
      );
      window.removeEventListener(
        "approve-loan",
        handleApproveLoan as unknown as EventListener,
      );
      window.removeEventListener(
        "reject-loan",
        handleRejectLoan as unknown as EventListener,
      );
    };
  }, [loans]);

  // Handle row click to open detail page
  const handleRowClick = (contract: loan) => {
    router.push(`/contracts/${contract.id}`);
  };

  return (
    <div className="pb-10">
      <div className="mx-5">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <FileSignature className="text-primary mr-5" />
            <p className="text-2xl text-primary font-bold">
              Danh sách hợp đồng
            </p>
          </div>
          <Link href="/contracts/overdue">
            <Button variant="destructive" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Hợp đồng quá hạn
            </Button>
          </Link>
        </div>

        {/* Filter - Minimalist Design */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            {/* Search - Spans 4 columns */}
            <div className="lg:col-span-4 relative">
              <Input
                className="w-full pl-4 pr-10 rounded-full bg-white border-gray-200 focus-visible:ring-offset-0" // Pill shape, space for icon
                placeholder="Tìm kiếm theo mã HĐ, tên, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-gray-400 hover:text-primary hover:bg-transparent"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {/* Status Filter */}
            <div className="lg:col-span-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full rounded-full border-gray-200 bg-white px-4">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                  <SelectItem value="CLOSED">Đã đóng</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Branch/Store Filter */}
            <div className="lg:col-span-3">
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger className="w-full rounded-full border-gray-200 bg-white px-4">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả chi nhánh</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="lg:col-span-3">
              <Select
                value={periodFilter}
                onValueChange={(value) => {
                  setPeriodFilter(value);
                  const now = new Date();
                  switch (value) {
                    case "TODAY":
                      setDateRange({
                        from: startOfDay(now),
                        to: endOfDay(now),
                      });
                      break;
                    case "THIS_WEEK":
                      setDateRange({
                        from: startOfWeek(now, { weekStartsOn: 1 }),
                        to: endOfWeek(now, { weekStartsOn: 1 }),
                      });
                      break;
                    case "THIS_MONTH":
                      setDateRange({
                        from: startOfMonth(now),
                        to: endOfMonth(now),
                      });
                      break;
                    case "LAST_MONTH":
                      const lastMonth = subMonths(now, 1);
                      setDateRange({
                        from: startOfMonth(lastMonth),
                        to: endOfMonth(lastMonth),
                      });
                      break;
                    case "THIS_YEAR":
                      setDateRange({
                        from: startOfYear(now),
                        to: endOfYear(now),
                      });
                      break;
                    default:
                      setDateRange(undefined);
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-full border-gray-200 bg-white px-4">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả thời gian</SelectItem>
                  <SelectItem value="TODAY">Hôm nay</SelectItem>
                  <SelectItem value="THIS_WEEK">Tuần này</SelectItem>
                  <SelectItem value="THIS_MONTH">Tháng này</SelectItem>
                  <SelectItem value="LAST_MONTH">Tháng trước</SelectItem>
                  <SelectItem value="THIS_YEAR">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Filter - Searchable */}
            <div className="lg:col-span-3">
              <SearchableSelect
                placeholder="Chọn khách hàng"
                className="w-full rounded-full border-gray-200 bg-white px-4"
                value={customerFilter}
                onValueChange={setCustomerFilter}
                options={[
                  { value: "ALL", label: "Tất cả khách hàng" },
                  ...customers.map((c) => ({
                    value: c.id,
                    label: c.fullName,
                    detail: c.phone,
                  })),
                ]}
              />
            </div>
          </div>
        </div>

        {/* Table - Responsive Container */}
        <div className="mt-5 pt-5 px-5 pb-5 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-5 justify-between">
            <div className="flex gap-3">
              <Link href="/contracts/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm mới
                </Button>
              </Link>

              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Sửa
              </Button>

              <Button variant="destructive" disabled>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Tổng số: <Badge variant="secondary">{totalItems}</Badge> hợp đồng
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center p-10">Loading...</div>
            ) : error ? (
              <div className="flex justify-center p-10 text-red-500">
                {error}
              </div>
            ) : (
              <>
                <DataTable
                  columns={LoanColumn}
                  data={loans}
                  onRowClick={handleRowClick}
                />

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
          </div>
        </div>
      </div>

      {/* Unified Contract Command Panel (Still used for other actions or details) */}
      <ContractCommandPanel
        open={openCommandPanel}
        onOpenChange={setOpenCommandPanel}
        contract={selectedContract}
        onPaymentSuccess={() => {
          fetchLoans();
        }}
        onRefinanceSuccess={() => {
          setOpenCommandPanel(false);
          fetchLoans();
        }}
      />

      {/* Reused Payment Dialog for Quick Pay */}
      {selectedContract && (
        <PaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          loanId={selectedContract.id}
          loanCode={selectedContract.contractNumber || selectedContract.id}
          onSuccess={fetchLoans}
        />
      )}

      {/* Debt Reminder Dialog for Overdue Loans */}
      {selectedContract && (
        <DebtReminderDialog
          open={isDebtReminderDialogOpen}
          onOpenChange={setIsDebtReminderDialogOpen}
          loanId={selectedContract.id}
          loanCode={selectedContract.contractNumber || selectedContract.id}
          customerName={selectedContract.customer?.fullName}
          onSuccess={fetchLoans}
        />
      )}
    </div>
  );
};

export default ContractPage;
