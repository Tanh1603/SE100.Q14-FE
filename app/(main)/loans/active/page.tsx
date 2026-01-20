"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SimpleDateRangePicker } from "@/components/ui/simple-date-range";
import { LoanService } from "@/lib/loan.service";
import { loan } from "@/types/asset";
import { addDays, isWithinInterval } from "date-fns";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Banknote,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { getActiveLoanColumns } from "./columns";
import { PaymentDialog } from "@/components/features/payment/payment-dialog";
import { Badge } from "@/components/ui/badge";

export default function ActiveLoansPage() {
  const router = useRouter();

  const [data, setData] = useState<loan[]>([]);
  const [filteredData, setFilteredData] = useState<loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Payment Dialog
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<loan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await LoanService.getAllLoans(
        page,
        limit,
        undefined,
        "ACTIVE",
      );
      setData(response.data);
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

  // Client-side filtering for search and date (applied on top of server pagination)
  useEffect(() => {
    let result = data;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.customer.fullName.toLowerCase().includes(q) ||
          item.customer.phone?.includes(q) ||
          (item as unknown as { contractNumber?: string }).contractNumber
            ?.toLowerCase()
            .includes(q),
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

  const handlePay = (loan: loan) => {
    setSelectedLoan(loan);
    setIsPaymentOpen(true);
  };

  const handleView = (loan: loan) => {
    router.push(`/contracts/${loan.id}`);
  };

  const columns = getActiveLoanColumns({
    onPay: handlePay,
    onView: handleView,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Banknote className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Thu Lãi (Khoản Vay Hoạt Động)
            </h1>
            <p className="text-muted-foreground">
              Danh sách các khoản vay đang hoạt động - Thu lãi nhanh
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách khoản vay đang hoạt động</span>
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
                  placeholder="Tìm tên, SĐT, mã HĐ..."
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

      {/* Payment Dialog */}
      {selectedLoan && (
        <PaymentDialog
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
          loanId={selectedLoan.id}
          loanCode={
            (selectedLoan as unknown as { contractNumber?: string })
              .contractNumber || selectedLoan.id
          }
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
