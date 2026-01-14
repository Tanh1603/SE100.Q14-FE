"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Edit,
  FileSignature,
  PlusCircle,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { LoanColumn } from "./column";
import Link from "next/link";
import { LoanService } from "@/lib/loan.service";
import { ContractCommandPanel } from "@/components/features/loan/contract-command-panel";
import { loan } from "@/types/asset";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ContractPage = () => {
  const [selectedContract, setSelectedContract] = useState<
    (loan & { contractNumber?: string; endDate?: string }) | null
  >(null);
  const [openCommandPanel, setOpenCommandPanel] = useState(false);
  const router = useRouter();

  // State for data fetching & Filtering
  const [loans, setLoans] = useState<(loan & { contractNumber: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [storeFilter, setStoreFilter] = useState("ALL"); // Assuming store fetching is separate or mocked
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data
  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const response = await LoanService.getAllLoans(
        page, 
        limit, 
        searchTerm, 
        statusFilter, 
        storeFilter
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

  useEffect(() => {
    fetchLoans();
  }, [page, limit, statusFilter, storeFilter]); // Trigger on filter/page change

  const handleSearch = () => {
    setPage(1); // Reset to first page on search
    fetchLoans();
  };

  // Listen for events from Columns (for backward compatibility with quick actions)
  useEffect(() => {
    const handleQuickPay = (e: CustomEvent) => {
      if (e.detail?.loanId) {
        // Find the contract and open command panel
        const contract = loans.find(
          (c) =>
            (c as { contractNumber?: string }).contractNumber ===
            e.detail.loanId
        );
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setOpenCommandPanel(true);
        }
      }
    };

    const handleRefinance = (e: CustomEvent) => {
      if (e.detail?.id) {
        const contract = loans.find(
          (c) =>
            (c as { contractNumber?: string }).contractNumber === e.detail.id
        );
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setOpenCommandPanel(true);
        }
      }
    };

    window.addEventListener("quick-pay", handleQuickPay as EventListener);
    window.addEventListener("refinance-loan", handleRefinance as EventListener);

    return () => {
      window.removeEventListener("quick-pay", handleQuickPay as EventListener);
      window.removeEventListener(
        "refinance-loan",
        handleRefinance as EventListener
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
                <p className="text-2xl text-primary font-bold">Danh sách hợp đồng</p>
            </div>
            <Link href="/contracts/overdue">
                <Button variant="destructive" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Hợp đồng quá hạn
                </Button>
            </Link>
        </div>

        {/* Filter - Responsive */}
        <div className="flex flex-col gap-4 p-5 bg-white rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <Label className="font-medium text-sm">Tìm kiếm</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Nhập mã HĐ, tên khách, sdt..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />
                        <Button onClick={handleSearch}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <Label className="font-medium text-sm">Trạng thái</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                            <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                            <SelectItem value="CLOSED">Đã đóng</SelectItem>
                            <SelectItem value="REJECTED">Từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Store Filter - Placeholder until store list is available */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <Label className="font-medium text-sm">Chi nhánh</Label>
                    <Select value={storeFilter} onValueChange={setStoreFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tất cả chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            <SelectItem value="store-1">Chi nhánh chính</SelectItem>
                            {/* Fetch stores to populate this */}
                        </SelectContent>
                    </Select>
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
                <div className="flex justify-center p-10 text-red-500">{error}</div>
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
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

      {/* Unified Contract Command Panel */}
      <ContractCommandPanel
        open={openCommandPanel}
        onOpenChange={setOpenCommandPanel}
        contract={selectedContract}
        onPaymentSuccess={() => {
           fetchLoans(); // Refresh list on success
        }}
        onRefinanceSuccess={() => {
          setOpenCommandPanel(false);
          fetchLoans();
        }}
      />
    </div>
  );
};

export default ContractPage;