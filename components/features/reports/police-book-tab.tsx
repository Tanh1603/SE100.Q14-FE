"use client";

import { useEffect, useState, useRef } from "react";
import { BookMarked, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StoreSelector } from "./store-selector";
import { ReportService } from "@/lib/report.service";
import { DailyLogResponse } from "@/types/report";
import { DailyLogPrint } from "@/components/templates/reports/daily-log-print";

const PoliceBookTab = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [storeId, setStoreId] = useState<string>("");
  const [data, setData] = useState<DailyLogResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return; // Wait for store selection
      try {
        setLoading(true);
        const res = await ReportService.getDailyLog(date, storeId);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch daily log", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, storeId]);

  const handlePrint = () => {
    if (printRef.current) {
      // Simple window print hack:
      // 1. Hide everything else
      // 2. Show print ref
      // 3. Print
      // 4. Restore
      // OR better: use a print stylesheet.
      // For this environment, let's try opening a new window or just standard window.print with CSS hiding
      window.print();
    }
  };

  const allLoans = data
    ? [...(data.newLoans || []), ...(data.closedLoans || [])]
    : [];
  const suspiciousItems = allLoans.filter((l) =>
    l.collateralDescription.toLowerCase().includes("nghi vấn")
  ); // Mock logic

  return (
    <div className="space-y-6">
      {/* Hidden Print Template */}
      <div className="hidden print:block absolute top-0 left-0 w-full z-[9999]">
        <DailyLogPrint ref={printRef} data={data} storeName="Cửa hàng cầm đồ" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center">
          <BookMarked className="text-primary mr-3 w-8 h-8" />
          <div>
            <h1 className="text-2xl text-primary font-bold">Sổ quản lý ANTT</h1>
            <p className="text-sm text-muted-foreground">
              Nhật ký hoạt động cầm đồ (Mẫu quy định nghị định 96)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <StoreSelector value={storeId} onChange={setStoreId} />
          <div className="relative">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-[160px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={loading || !data}
          >
            <Printer className="mr-2 h-4 w-4" />
            In sổ
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !data ? (
        <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-gray-50">
          Vui lòng chọn cơ sở và ngày để xem dữ liệu
        </div>
      ) : (
        <div className="print:hidden">
          {/* Suspicious Items Alert (Mock Logic for UI demo) */}
          {suspiciousItems.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 text-lg flex items-center">
                  🔴 Cảnh báo tài sản nghi vấn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {suspiciousItems.map((item) => (
                    <div
                      key={item.contractId}
                      className="text-sm text-red-800 bg-red-100 p-2 rounded flex justify-between"
                    >
                      <span>
                        <strong>{item.contractId}</strong> -{" "}
                        {item.collateralDescription} ({item.customerName})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Log Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">
                Nhật ký trong ngày ({new Date(date).toLocaleDateString("vi-VN")}
                )
              </h3>
              <div className="text-sm text-gray-500">
                Tổng giao dịch:{" "}
                {(data.summary?.totalNewLoans || 0) +
                  (data.summary?.totalClosedLoans || 0)}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã HĐ</TableHead>
                  <TableHead className="w-[200px]">Họ tên khách</TableHead>
                  <TableHead className="w-[150px]">Số CCCD</TableHead>
                  <TableHead className="w-[300px]">Thường trú</TableHead>
                  <TableHead>Mô tả tài sản</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLoans.length > 0 ? (
                  allLoans.map((log) => (
                    <TableRow key={log.contractId}>
                      <TableCell>{log.contractId}</TableCell>
                      <TableCell className="font-medium">
                        {log.customerName}
                      </TableCell>
                      <TableCell>{log.nationalId}</TableCell>
                      <TableCell className="text-xs">{log.address}</TableCell>
                      <TableCell>{log.collateralDescription}</TableCell>
                      <TableCell className="font-mono text-xs text-right">
                        {new Intl.NumberFormat("vi-VN").format(log.loanAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            log.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không có dữ liệu trong ngày này
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceBookTab;
