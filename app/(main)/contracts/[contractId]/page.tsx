"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoanService } from "@/lib/loan.service";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ContractOverview } from "@/components/features/contract/detail/contract-overview";
import { RepaymentSchedule } from "@/components/features/contract/detail/repayment-schedule";
import { TransactionHistory } from "@/components/features/contract/detail/transaction-history";
import { ActionPanel } from "@/components/features/contract/detail/action-panel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;

  const [loan, setLoan] = useState<LoanDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLoan = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const data = await LoanService.getLoanById(contractId);
      setLoan(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  const handleRefresh = () => {
    fetchLoan();
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-8 w-[300px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-destructive font-medium">
          {error || "Không tìm thấy hợp đồng"}
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/contracts">Hợp đồng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{loan.loanCode || "Chi tiết"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                Hợp đồng {loan.loanCode}
                <Badge
                  variant={
                    loan.status === "ACTIVE"
                      ? "default"
                      : loan.status === "CLOSED"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {loan.status}
                </Badge>
              </h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Overview Cards */}
        <ContractOverview loan={loan} />

        {/* Action Panel */}
        <ActionPanel loan={loan} onRefresh={handleRefresh} />

        {/* Schedule */}
        <RepaymentSchedule key={`schedule-${refreshKey}`} loan={loan} />

        {/* History */}
        <TransactionHistory key={`history-${refreshKey}`} loanId={contractId} />
      </div>
    </div>
  );
}
