/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payment";
import type { Payment, PaymentListParams } from "@/types/payment";
import { PAYMENT_METHOD_OPTIONS, PAYMENT_TYPE_OPTIONS } from "@/types/enum";
import {
  Wallet,
  Search,
  PlusCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { PaymentColumns } from "./columns";
import PaymentForm from "./payment-form";
import PaymentDetail from "./payment-detail";
import { formatCurrency } from "@/lib/payment.service";

const CashBookPage = () => {
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>();

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
    isLoading,
    error,
    refetch,
    goToPage,
    updateParams,
  } = usePayments({
    page: 1,
    limit: 10,
  });

  // Handle search/filter
  const handleSearch = () => {
    updateParams({
      ...filters,
      page: 1,
    });
  };

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

  // Handle row click - opens detail dialog
  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenDetailDialog(true);
  };

  // Handle successful payment creation
  const handlePaymentCreated = () => {
    setOpenCreateDialog(false);
    refetch();
  };

  // Calculate totals for current page
  const totalIn = payments
    .filter((p) => p.flow === "IN")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOut = payments
    .filter((p) => p.flow === "OUT")
    .reduce((sum, p) => sum + p.amount, 0);
  const netAmount = totalIn - totalOut;

  return (
    <SidebarInset>
      <div className="mx-5">
        {/* Header */}
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Wallet className="text-primary mr-3 w-6 h-6" />
            <div>
              <h1 className="text-2xl text-primary font-bold">Sổ quỹ</h1>
              <p className="text-sm text-muted-foreground">
                Quản lý các giao dịch thu chi
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {meta && (
            <div className="flex gap-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">
                  Tổng giao dịch
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {meta.totalItems}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-100">
                <p className="text-xs text-green-600 font-medium">Thu vào</p>
                <p className="text-lg font-bold text-green-800">
                  + {formatCurrency(totalIn)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg px-4 py-2 border border-red-100">
                <p className="text-xs text-red-600 font-medium">Chi ra</p>
                <p className="text-lg font-bold text-red-800">
                  - {formatCurrency(totalOut)}
                </p>
              </div>
              <div
                className={`rounded-lg px-4 py-2 border ${
                  netAmount >= 0
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-orange-50 border-orange-100"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    netAmount >= 0 ? "text-emerald-600" : "text-orange-600"
                  }`}
                >
                  Chênh lệch
                </p>
                <p
                  className={`text-lg font-bold ${
                    netAmount >= 0 ? "text-emerald-800" : "text-orange-800"
                  }`}
                >
                  {formatCurrency(netAmount)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border shadow-sm mb-4">
          <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50/50 rounded-t-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-5 gap-4">
              {/* Search */}
              <div className="col-span-2 flex flex-col gap-y-2">
                <Label>Tìm kiếm</Label>
                <Input
                  placeholder="Mã giao dịch, tên khách hàng, số hợp đồng..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-y-2">
                <Label>Phương thức</Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      paymentMethod:
                        value as PaymentListParams["paymentMethod"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PAYMENT_METHOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Type */}
              <div className="flex flex-col gap-y-2">
                <Label>Loại thanh toán</Label>
                <Select
                  value={filters.paymentType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      paymentType: value as PaymentListParams["paymentType"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PAYMENT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex flex-col gap-y-2">
                <Label className="opacity-0">Action</Label>
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-5 gap-4 mt-4">
              <div className="flex flex-col gap-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Từ ngày
                </Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Đến ngày
                </Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border shadow-sm">
          {/* Action Bar */}
          <div className="flex justify-between items-center px-5 py-3 border-b">
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setOpenCreateDialog(true);
                  setSelectedPayment(undefined);
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo phiếu thu
              </Button>

              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>

            {/* Pagination Info */}
            {meta && (
              <div className="text-sm text-muted-foreground">
                Hiển thị {payments.length} / {meta.totalItems} giao dịch
              </div>
            )}
          </div>

          {/* Table */}
          <div className="p-5">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                <p className="font-medium">Đã có lỗi xảy ra</p>
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            ) : (
              <DataTable
                columns={PaymentColumns}
                data={payments}
                selectedRow={selectedPayment}
                onRowClick={handleRowClick}
              />
            )}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 px-5 py-4 border-t bg-gray-50/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={meta.currentPage === i + 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToPage(i + 1)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Payment Dialog */}
      <AppDialog
        title="Tạo phiếu thu"
        description="Nhập thông tin thanh toán cho hợp đồng"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      >
        <PaymentForm
          onSuccess={handlePaymentCreated}
          onCancel={() => setOpenCreateDialog(false)}
        />
      </AppDialog>

      {/* Payment Detail Dialog */}
      <AppDialog
        title="Chi tiết giao dịch"
        open={openDetailDialog}
        onOpenChange={setOpenDetailDialog}
      >
        {selectedPayment && <PaymentDetail payment={selectedPayment} />}
      </AppDialog>
    </SidebarInset>
  );
};

export default CashBookPage;
