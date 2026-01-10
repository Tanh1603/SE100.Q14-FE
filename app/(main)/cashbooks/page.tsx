"use client";

import { useState } from "react";
import { CashbookSidePanel } from "@/components/features/cashbook/cashbook-side-panel";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payment";
import type {
  Payment,
  PaymentListParams,
  PaymentType,
  PaymentMethod,
} from "@/types/payment";
import { PAYMENT_METHOD_OPTIONS, PAYMENT_TYPE_OPTIONS } from "@/types/enum";
import {
  Wallet,
  Search,
  PlusCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { PaymentColumns } from "./columns";
import { formatCurrency } from "@/lib/payment.service";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

const CashBookPage = () => {
  // Panel states
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "view" | "edit">(
    "view"
  );
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter states
  const [filters, setFilters] = useState<PaymentListParams>({
    search: "",
    paymentMethod: undefined,
    paymentType: undefined,
    dateFrom: "",
    dateTo: "",
  });

  // Data fetching
  const {
    data: payments,
    meta,
    stats,
    isLoading,
    error,
    refetch,
    goToPage,
    updateParams,
  } = usePayments({
    page: 1,
    limit: 10,
  });

  const debouncedFilters = useDebounce(filters, 500);

  // Effect to trigger search when filters change
  useEffect(() => {
    updateParams({
      ...debouncedFilters,
      page: 1,
    });
  }, [debouncedFilters, updateParams]);

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      search: "",
      paymentMethod: undefined,
      paymentType: undefined,
      dateFrom: "",
      dateTo: "",
    });
    updateParams({
      search: "",
      paymentMethod: undefined,
      paymentType: undefined,
      dateFrom: "",
      dateTo: "",
      page: 1,
    });
  };

  // Handle row click
  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setPanelMode("view");
    setPanelOpen(true);
  };

  const handleCreate = () => {
    setSelectedPayment(null);
    setPanelMode("create");
    setPanelOpen(true);
  };

  // Calculated summaries
  const totalMoney = stats?.totalMoney || 0;
  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Wallet className="text-primary mr-5" />
            <p className="text-2xl text-primary font-bold">Sổ quỹ</p>
          </div>
        </div>

        {/* Quick Stats Cards - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-sm text-gray-600 font-medium">
              Tổng quỹ hiện tại
            </p>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatCurrency(totalMoney)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-sm text-gray-600 font-medium">
              Tổng thu trong tháng
            </p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-sm text-gray-600 font-medium">
              Tổng chi trong tháng
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              -{formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        {/* Filter Section - Responsive */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nội dung, người nhận..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Loại thanh toán</Label>
              <Select
                value={filters.paymentType || "all"}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    paymentType:
                      val === "all" ? undefined : (val as PaymentType),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {PAYMENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Phương thức</Label>
              <Select
                value={filters.paymentMethod || "all"}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    paymentMethod:
                      val === "all" ? undefined : (val as PaymentMethod),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Danh sách giao dịch</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button size="sm" onClick={handleCreate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo phiếu mới
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Có lỗi xảy ra khi tải dữ liệu
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <DataTable
                  columns={PaymentColumns}
                  data={payments || []}
                  onRowClick={handleRowClick}
                />
              </div>

              {/* Pagination (Simplified) */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Hiển thị {(meta?.currentPage || 1) * (meta?.limit || 10) - 9}-
                  {Math.min(
                    (meta?.currentPage || 1) * (meta?.limit || 10),
                    meta?.totalItems || 0
                  )}{" "}
                  trên {meta?.totalItems} kết quả
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(meta?.currentPage || 1) <= 1}
                    onClick={() => goToPage((meta?.currentPage || 1) - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      (meta?.currentPage || 1) >= (meta?.totalPages || 1)
                    }
                    onClick={() => goToPage((meta?.currentPage || 1) + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CashbookSidePanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        selectedPayment={selectedPayment}
        mode={panelMode}
        onSave={(payment) => {
          console.log("Saving payment:", payment);
          // if createPayment(payment) / updatePayment(payment) exists
          setPanelOpen(false);
          refetch();
        }}
        onDelete={(id) => {
          console.log("Deleting payment:", id);
          // if deletePayment(id) exists
          // deletePayment(id);
          setPanelOpen(false);
          // refetch();
        }}
      />
    </SidebarInset>
  );
};

export default CashBookPage;
