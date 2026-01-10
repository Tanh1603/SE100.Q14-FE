"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldAlert,
  Search,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockRevenueEntries, mockRevenueStats } from "@/mock-data/revenue";
import { useState } from "react";
import { RoleGate } from "@/components/features/role/role-gate";

const RevenueReportTab = () => {
  const [period, setPeriod] = useState("month");

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const debouncedFilters = useDebounce(filters, 500);

  // Filtered Data
  const filteredEntries = useMemo(() => {
    return mockRevenueEntries.filter((entry) => {
      const matchSearch =
        !debouncedFilters.search ||
        entry.description
          .toLowerCase()
          .includes(debouncedFilters.search.toLowerCase()) ||
        entry.customerName
          ?.toLowerCase()
          .includes(debouncedFilters.search.toLowerCase()) ||
        entry.contractId
          ?.toLowerCase()
          .includes(debouncedFilters.search.toLowerCase());

      const matchDateFrom =
        !debouncedFilters.dateFrom ||
        new Date(entry.date) >= new Date(debouncedFilters.dateFrom);

      const matchDateTo =
        !debouncedFilters.dateTo ||
        new Date(entry.date) <= new Date(debouncedFilters.dateTo);

      return matchSearch && matchDateFrom && matchDateTo;
    });
  }, [debouncedFilters]);

  // Derived Chart Data (Mocking realistic trends based on period)
  const chartData = [
    { name: "T1", revenue: 4000, expense: 2400, profit: 2400 },
    { name: "T2", revenue: 3000, expense: 1398, profit: 2210 },
    { name: "T3", revenue: 2000, expense: 9800, profit: 2290 },
    { name: "T4", revenue: 2780, expense: 3908, profit: 2000 },
    { name: "T5", revenue: 1890, expense: 4800, profit: 2181 },
    { name: "T6", revenue: 2390, expense: 3800, profit: 2500 },
    { name: "T7", revenue: 3490, expense: 4300, profit: 2100 },
  ];

  const pieData = [
    { name: "Lãi vay", value: 65, color: "#22c55e" },
    { name: "Thanh lý", value: 25, color: "#3b82f6" },
    { name: "Phí dịch vụ", value: 10, color: "#eab308" },
    { name: "Khác", value: 5, color: "#9ca3af" },
  ];

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
            <h2 className="text-xl font-bold">Báo cáo doanh thu</h2>
            <p className="text-sm text-muted-foreground">
              Phân tích lợi nhuận và dòng tiền
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="quarter">Quý này</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Báo Cáo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nội dung, mã HĐ..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({ search: "", dateFrom: "", dateTo: "" })
                }
              >
                <X className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ doanh thu {"&"} chi phí</CardTitle>
                <CardDescription>
                  Theo dõi xu hướng tài chính theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: "#333" }}
                      />
                      <Legend />
                      <Bar
                        name="Doanh thu"
                        dataKey="revenue"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        name="Chi phí"
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Cơ cấu nguồn thu</CardTitle>
                <CardDescription>
                  Phân bổ doanh thu theo danh mục
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-muted-foreground">
                      Tổng thu
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockRevenueStats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">
                  +{mockRevenueStats.monthlyGrowth}%
                </span>
                <span className="ml-1">so với tháng trước</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lợi nhuận ròng
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 font-mono">
                {formatCurrency(mockRevenueStats.totalProfit)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lãi suất thực sau chi phí
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chi phí vận hành
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 font-mono">
                {formatCurrency(mockRevenueStats.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lương, Mặt bằng, Điện nước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lãi dự thu</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 font-mono">
                {formatCurrency(mockRevenueStats.outstandingInterest)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lãi chưa thu từ các HĐ đang vay
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transaction Ledger */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Nhật ký giao dịch tài chính</CardTitle>
                <CardDescription>
                  Các khoản thu chi phát sinh gần đây
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {entry.date}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              entry.type === "INTEREST"
                                ? "bg-green-100 text-green-700"
                                : entry.type === "LIQUIDATION"
                                ? "bg-blue-100 text-blue-700"
                                : entry.type === "FEE"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {entry.type === "INTEREST"
                              ? "LÃI VAY"
                              : entry.type === "LIQUIDATION"
                              ? "THANH LÝ"
                              : entry.type === "FEE"
                              ? "PHÍ"
                              : "KHÁC"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>{entry.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.customerName}{" "}
                            {entry.contractId && `- ${entry.contractId}`}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold font-mono text-green-600">
                          +{formatCurrency(entry.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEntries.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </RoleGate>
    </div>
  );
};

export default RevenueReportTab;
