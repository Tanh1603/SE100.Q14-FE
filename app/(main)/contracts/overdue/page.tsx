"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { AlertTriangle, ChevronLeft, ChevronRight, FileWarning, Search, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { LoanColumn } from "../column";
import Link from "next/link";
import { LoanService } from "@/lib/loan.service";
import { loan } from "@/types/asset";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const OverdueContractPage = () => {
  const router = useRouter();

  // State
  const [loans, setLoans] = useState<(loan & { contractNumber: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data - Force status=OVERDUE
  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const response = await LoanService.getAllLoans(
        page, 
        limit, 
        searchTerm, 
        "OVERDUE"
      );
      setLoans(response.data);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error("Failed to fetch overdue loans:", err);
      setError("Không thể tải danh sách hợp đồng quá hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [page, limit]); 

  const handleSearch = () => {
    setPage(1);
    fetchLoans();
  };

  const handleRowClick = (contract: loan) => {
    router.push(`/contracts/${contract.id}`);
  };

  return (
    <div className="pb-10">
      <div className="mx-5">
        <div className="flex my-5 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <FileWarning className="text-destructive mr-3 h-8 w-8" />
            <div>
                <p className="text-2xl text-destructive font-bold">Hợp đồng quá hạn</p>
                <p className="text-sm text-muted-foreground">Danh sách các khoản vay đã quá hạn thanh toán</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-col gap-4 p-5 bg-white rounded-xl shadow-sm border">
            <div className="flex gap-4 items-end">
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
            </div>
        </div>

        {/* Table */}
        <div className="mt-5 pt-5 px-5 pb-5 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-5 justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Tổng số: <Badge variant="destructive">{totalItems}</Badge> hợp đồng quá hạn
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
                    
                    {/* Pagination */}
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
    </div>
  );
};

export default OverdueContractPage;