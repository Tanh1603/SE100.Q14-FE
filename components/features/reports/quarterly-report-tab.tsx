"use client";

import { Button } from "@/components/ui/button";
import { Printer, Download, ShieldAlert } from "lucide-react";
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
import { mockDK13Report } from "@/mock-data/quarterly-report";
import { useState } from "react";
import { RoleGate } from "@/components/features/role/role-gate";

const QuarterlyReportTab = () => {
  const [quarter, setQuarter] = useState("Q1");
  const [year, setYear] = useState("2026");

  // Calculate totals
  const totalReceived = mockDK13Report.reduce(
    (sum, item) => sum + item.totalReceived,
    0
  );
  const totalReceivedValue = mockDK13Report.reduce(
    (sum, item) => sum + item.totalReceivedValue,
    0
  );
  const totalLiquidated = mockDK13Report.reduce(
    (sum, item) => sum + item.totalLiquidated,
    0
  );
  const totalInventory = mockDK13Report.reduce(
    (sum, item) => sum + item.currentInventory,
    0
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="space-y-6">
      <RoleGate
        allowedRoles={["admin", "manager"]}
        fallback={
          <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 rounded-lg border border-dashed text-gray-400">
            <ShieldAlert className="w-10 h-10 mb-2" />
            <p className="font-medium">Bạn không có quyền xem báo cáo này</p>
          </div>
        }
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Báo cáo định kỳ (Mẫu ĐK13)</h2>
            <p className="text-sm text-muted-foreground">
              Báo cáo tình hình hoạt động kinh doanh, dịch vụ cầm đồ theo Nghị
              định 96
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Quý" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">Quý 1</SelectItem>
                <SelectItem value="Q2">Quý 2</SelectItem>
                <SelectItem value="Q3">Quý 3</SelectItem>
                <SelectItem value="Q4">Quý 4</SelectItem>
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

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              In
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng nhận cầm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReceived}</div>
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
              <div className="text-2xl font-bold">{totalLiquidated}</div>
              <p className="text-xs text-muted-foreground">Tài sản quá hạn</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tồn kho hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventory}</div>
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
                {formatCurrency(totalReceivedValue)}
              </div>
              <p className="text-xs text-muted-foreground">VND</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Report Table (ĐK13 Format) */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm">
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
                {mockDK13Report.map((item, index) => (
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
                ))}

                {/* Footer / Totals Row */}
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell className="text-center border-r" colSpan={2}>
                    TỔNG CỘNG
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {totalReceived}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {formatCurrency(totalReceivedValue)}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {mockDK13Report.reduce((s, i) => s + i.totalRedeemed, 0)}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {formatCurrency(
                      mockDK13Report.reduce(
                        (s, i) => s + i.totalRedeemedValue,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {totalLiquidated}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {formatCurrency(
                      mockDK13Report.reduce(
                        (s, i) => s + i.totalLiquidatedValue,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {totalInventory}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {formatCurrency(
                      mockDK13Report.reduce(
                        (s, i) => s + i.currentInventoryValue,
                        0
                      )
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </RoleGate>
    </div>
  );
};

export default QuarterlyReportTab;
