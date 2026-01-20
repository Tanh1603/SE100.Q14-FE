"use client";

import { Button } from "@/components/ui/button";
import { Printer, Download, ShieldAlert, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { RoleGate } from "@/components/features/role/role-gate";
import { ReportService } from "@/lib/report.service";
import {
  QuarterlyReportResponse,
  DK13Row,
  AssetBreakdownItem,
} from "@/types/report";
import { StoreSelector } from "./store-selector";
import { QuarterlyReportPrint } from "@/components/templates/reports/quarterly-report-print";
import { Role } from "@/types/constant";
import { exportQuarterlyReportToExcel } from "@/components/templates/reports/excel-export.helper";

const QuarterlyReportTab = () => {
  const [quarter, setQuarter] = useState("1");
  const [year, setYear] = useState("2026");
  const [storeId, setStoreId] = useState<string>("");

  const [data, setData] = useState<QuarterlyReportResponse | null>(null);
  const [reportRows, setReportRows] = useState<DK13Row[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If "all" is selected, pass undefined to service to fetch aggregate
        const effectiveStoreId =
          storeId === "__all__" ? undefined : storeId || undefined;
        const res = await ReportService.getQuarterlyReport(
          parseInt(year),
          parseInt(quarter),
          effectiveStoreId,
        );
        setData(res);

        // Map Asset Breakdown from API response
        if (res.statistics.assetBreakdown) {
          const mappedRows: DK13Row[] = res.statistics.assetBreakdown.map(
            (item: AssetBreakdownItem, index: number) => ({
              id: index.toString(),
              category: item.category,
              totalReceived: item.receivedCount,
              totalReceivedValue: item.receivedValue,
              totalRedeemed: item.releasedCount,
              totalRedeemedValue: item.releasedValue,
              totalLiquidated: item.liquidatedCount,
              totalLiquidatedValue: item.liquidatedValue,
              currentInventory: item.inStockCount,
              currentInventoryValue: item.inStockValue,
            }),
          );
          setReportRows(mappedRows);
        } else {
          setReportRows([]);
        }

        // Set Employee Count
        if (res.statistics.employees) {
          setEmployeeCount(res.statistics.employees.total);
        }
      } catch (error) {
        console.error("Failed to fetch quarterly report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, quarter, storeId]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="space-y-6">
      <div className="hidden print:block absolute top-0 left-0 w-full z-[9999]">
        <QuarterlyReportPrint
          ref={printRef}
          data={data}
          rows={reportRows}
          quarter={quarter}
          year={year}
          storeName="Cửa hàng cầm đồ" // Placeholder until StoreService.getById is integrated
        />
      </div>

      <RoleGate
        allowedRoles={[Role.ADMIN, Role.MANAGER]}
        fallback={
          <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 rounded-lg border border-dashed text-gray-400">
            <ShieldAlert className="w-10 h-10 mb-2" />
            <p className="font-medium">Bạn không có quyền xem báo cáo này</p>
          </div>
        }
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <h2 className="text-xl font-bold">Báo cáo định kỳ (Mẫu ĐK13)</h2>
            <p className="text-sm text-muted-foreground">
              Báo cáo tình hình hoạt động kinh doanh, dịch vụ cầm đồ theo Nghị
              định 96
            </p>
          </div>

          <div className="flex gap-2">
            <StoreSelector value={storeId} onChange={setStoreId} />

            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Quý" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Quý 1</SelectItem>
                <SelectItem value="2">Quý 2</SelectItem>
                <SelectItem value="3">Quý 3</SelectItem>
                <SelectItem value="4">Quý 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() =>
                data && exportQuarterlyReportToExcel(data, year, quarter)
              }
              disabled={!data}
            >
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              In
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12 print:hidden">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="print:hidden">
            {/* Summary Cards - Using Real Data if available */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tổng nhận cầm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.statistics.totalCollateralsReceived || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Hợp đồng mới</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Đã thanh lý
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.statistics.totalLiquidations || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tài sản quá hạn
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tồn kho hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.statistics.totalLoansActive || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Đang bảo quản</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tổng giá trị cầm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(data?.statistics.totalLoanAmount || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">VND</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Nhân sự
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employeeCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Tổng số nhân viên
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Report Table (ĐK13 Format) */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm mt-6">
              <div className="p-4 border-b bg-gray-50 text-center">
                <h3 className="font-bold text-lg uppercase text-gray-800">
                  Báo cáo tình hình kinh doanh {quarter}/{year}
                </h3>
                <p className="text-xs italic text-gray-500">
                  (Ban hành kèm theo Thông tư số 54/2012/TT-BCA)
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead
                        className="w-[50px] text-center border-r font-bold text-black"
                        rowSpan={2}
                      >
                        STT
                      </TableHead>
                      <TableHead
                        className="w-[200px] border-r font-bold text-black"
                        rowSpan={2}
                      >
                        Loại tài sản
                      </TableHead>
                      <TableHead
                        className="text-center border-r font-bold text-black bg-blue-50"
                        colSpan={2}
                      >
                        Nhận cầm cố
                      </TableHead>
                      <TableHead
                        className="text-center border-r font-bold text-black bg-green-50"
                        colSpan={2}
                      >
                        Đã chuộc lại
                      </TableHead>
                      <TableHead
                        className="text-center border-r font-bold text-black bg-red-50"
                        colSpan={2}
                      >
                        Đã thanh lý
                      </TableHead>
                      <TableHead
                        className="text-center border-r font-bold text-black bg-yellow-50"
                        colSpan={2}
                      >
                        Tồn kho cuối kỳ
                      </TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100">
                      {/* Sub-headers */}
                      <TableHead className="text-center border-r bg-blue-50">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-center border-r bg-blue-50">
                        Giá trị (VNĐ)
                      </TableHead>
                      <TableHead className="text-center border-r bg-green-50">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-center border-r bg-green-50">
                        Giá trị (VNĐ)
                      </TableHead>
                      <TableHead className="text-center border-r bg-red-50">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-center border-r bg-red-50">
                        Giá trị (VNĐ)
                      </TableHead>
                      <TableHead className="text-center border-r bg-yellow-50">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-center border-r bg-yellow-50">
                        Giá trị (VNĐ)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có dữ liệu phân loại
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportRows.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center border-r">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border-r font-medium">
                            {item.category}
                          </TableCell>

                          <TableCell className="text-center border-r">
                            {item.totalReceived}
                          </TableCell>
                          <TableCell className="text-right border-r">
                            {formatCurrency(item.totalReceivedValue)}
                          </TableCell>

                          <TableCell className="text-center border-r">
                            {item.totalRedeemed}
                          </TableCell>
                          <TableCell className="text-right border-r">
                            {formatCurrency(item.totalRedeemedValue)}
                          </TableCell>

                          <TableCell className="text-center border-r">
                            {item.totalLiquidated}
                          </TableCell>
                          <TableCell className="text-right border-r">
                            {formatCurrency(item.totalLiquidatedValue)}
                          </TableCell>

                          <TableCell className="text-center border-r">
                            {item.currentInventory}
                          </TableCell>
                          <TableCell className="text-right border-r">
                            {formatCurrency(item.currentInventoryValue)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </RoleGate>
    </div>
  );
};

export default QuarterlyReportTab;
