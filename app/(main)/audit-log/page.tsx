"use client";
import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { AppPagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuditLog } from "@/hooks/use-audit-log";
import { AuditLog } from "@/types/audit-log";
import { Label } from "@radix-ui/react-label";
import { History, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loading from "../loading";
import { AuditLogJsonDiff } from "./audit-log-table";
import { AuditLogColumn } from "./columns";

const Page = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // query
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  // local state for filters
  const [startDateFilter, setStartDateFilter] = useState(startDate || "");
  const [endDateFilter, setEndDateFilter] = useState(endDate || "");

  const updateQuery = (params: Record<string, string>) => {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      } else {
        query.delete(key);
      }
    });
    router.push(`?${query.toString()}`);
  };

  const { data: auditLogs, isLoading: auditLogLoading } = useAuditLog({
    page,
    limit,
    startDate,
    endDate,
  });

  return (
    <div className="mx-5">
      <div className="flex my-5 items-center">
        <History className="text-primary mr-5" />
        <p className="text-2xl text-primary font-bold">Nhật ký hoạt động</p>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row justify-between md:items-center pt-2 px-5 pb-5 bg-white rounded-xl gap-4">
        <div className="flex gap-x-10 flex-wrap overflow-x-auto pb-2 md:pb-0">
          <div className="flex flex-col gap-y-2 min-w-[200px]">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2 min-w-[200px]">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            updateQuery({
              startDate: startDateFilter,
              endDate: endDateFilter,
              page: "1",
            });
          }}
        >
          <Search />
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      {auditLogLoading ? (
        <Loading />
      ) : (
        <div className="mt-2 pt-2 px-5 pb-2 bg-white rounded-xl">
          <DataTable
            columns={AuditLogColumn}
            data={auditLogs?.data ?? []}
            onRowClick={(row) => {
              setSelectedLog(row);
              setOpenDialog(true);
            }}
          />
        </div>
      )}

      <div className="mt-5">
        <AppPagination
          page={page}
          totalPages={auditLogs?.meta?.totalPages ?? 0}
        />
      </div>

      <AppDialog
        title="Chi tiết"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
      >
        <AuditLogJsonDiff
          oldValue={selectedLog?.oldValue}
          newValue={selectedLog?.newValue}
        />
      </AppDialog>
    </div>
  );
};

export default Page;
