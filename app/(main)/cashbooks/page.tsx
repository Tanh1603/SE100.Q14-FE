"use client";

import { useState } from "react";
import { CashbookSidePanel } from "@/components/features/cashbook/cashbook-side-panel";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payment";
import { useDisbursements } from "@/hooks/use-disbursement";
import type { Payment } from "@/types/payment";
import {
  Wallet,
  Search,
  PlusCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PaymentColumns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CashBookPage = () => {
  const [activeTab, setActiveTab] = useState("payment");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "view" | "edit">("view");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Payments (Money In)
  const {
    data: payments,
    meta: paymentMeta,
    isLoading: loadingPayments,
    refetch: refetchPayments,
    goToPage: goToPaymentPage,
    updateParams: updatePaymentParams
  } = usePayments({ page: 1, limit: 10 });

  // Disbursements (Money Out)
  const {
    data: disbursements,
    meta: disbursementMeta,
    isLoading: loadingDisbursements,
    refetch: refetchDisbursements,
    goToPage: goToDisbursementPage,
    updateParams: updateDisbursementParams
  } = useDisbursements({ page: 1, limit: 10 });

  const handleSearch = () => {
    if (activeTab === "payment") {
        updatePaymentParams({ search: searchTerm, page: 1 });
    } else {
        updateDisbursementParams({ search: searchTerm, page: 1 });
    }
  };

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

  const renderPagination = (meta: any, goToPage: (page: number) => void) => {
      if (!meta) return null;
      return (
        <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-500">
                Trang {meta.currentPage} / {meta.totalPages} ({meta.totalItems} kết quả)
            </p>
            <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                disabled={meta.currentPage <= 1}
                onClick={() => goToPage(meta.currentPage - 1)}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                variant="outline"
                size="sm"
                disabled={meta.currentPage >= meta.totalPages}
                onClick={() => goToPage(meta.currentPage + 1)}
                >
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      );
  }

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Wallet className="text-primary mr-5" />
            <p className="text-2xl text-primary font-bold">Sổ quỹ</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 space-y-4">
            <div className="flex gap-4">
                <div className="space-y-2 flex-1 max-w-sm">
                    <Label>Tìm kiếm</Label>
                    <div className="relative flex gap-2">
                        <Input
                        placeholder="Mã phiếu, tên khách..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="payment">Phiếu Thu (Tiền vào)</TabsTrigger>
                    <TabsTrigger value="disbursement">Phiếu Chi (Tiền ra)</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { refetchPayments(); refetchDisbursements(); }}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Làm mới
                    </Button>
                    <Button size="sm" onClick={handleCreate}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tạo phiếu
                    </Button>
                </div>
            </div>

            <TabsContent value="payment">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {loadingPayments ? (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <>
                            <DataTable
                                columns={PaymentColumns}
                                data={payments || []}
                                onRowClick={handleRowClick}
                            />
                            {renderPagination(paymentMeta, goToPaymentPage)}
                        </>
                    )}
                </div>
            </TabsContent>

            <TabsContent value="disbursement">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {loadingDisbursements ? (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <>
                            <DataTable
                                columns={PaymentColumns}
                                data={disbursements || []}
                                onRowClick={handleRowClick}
                            />
                            {renderPagination(disbursementMeta, goToDisbursementPage)}
                        </>
                    )}
                </div>
            </TabsContent>
        </Tabs>
      </div>

      <CashbookSidePanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        selectedPayment={selectedPayment}
        mode={panelMode}
        onSave={() => {
          setPanelOpen(false);
          refetchPayments();
          refetchDisbursements();
        }}
        onDelete={() => {
          setPanelOpen(false);
          refetchPayments();
        }}
      />
    </SidebarInset>
  );
};

export default CashBookPage;