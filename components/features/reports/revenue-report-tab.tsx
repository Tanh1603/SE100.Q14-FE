"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldAlert,
  Loader2,
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
import { useState, useEffect } from "react";
import { RoleGate } from "@/components/features/role/role-gate";
import { StoreSelector } from "./store-selector";
import { ReportService } from "@/lib/report.service";
import { RevenueReportListResponse } from "@/types/report";

const RevenueReportTab = () => {
  const [period, setPeriod] = useState("month");
  const [storeId, setStoreId] = useState<string>("");
  const [data, setData] = useState<RevenueReportListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters (Client side filtering of the fetched list if needed, or simplified)
  // Since the API takes startDate/endDate, we should map "Period" to dates.
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Effect to update dates when period changes
  useEffect(() => {
    const now = new Date();
    let from = new Date();
    let to = new Date();

    if (period === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === "quarter") {
      const quarter = Math.floor((now.getMonth() + 3) / 3);
      from = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
      to = new Date(now.getFullYear(), quarter * 3, 0);
    } else if (period === "year") {
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), 11, 31);
    }

    setDateRange({
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    });
  }, [period]);

  const fetchData = async () => {
    // If Admin/Owner and no store selected, maybe fetch all?
    // Assuming API handles null storeId for aggregation
    try {
      setLoading(true);
      const res = await ReportService.getRevenueReport(
        dateRange.from,
        dateRange.to,
        storeId || undefined
      );
      setData(res);
    } catch (error) {
      console.error("Failed to fetch revenue report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchData();
    }
  }, [dateRange, storeId]);

  const formatCurrency = (val?: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);

  // Transform Data for Charts
  const chartData = (data && Array.isArray(data.data) ? data.data : []).map(
    (d) => ({
      name: new Date(d.date).getDate().toString(), // Show day number
      revenue: d.totalRevenue,
      expense: d.totalExpense,
      profit: d.totalRevenue - d.totalExpense,
    })
  );

  const pieData = data
    ? [
        {
          name: "Lãi vay",
          value: data.summary.totalInterest,
          color: "#22c55e",
        },
        {
          name: "Thanh lý",
          value: data.summary.totalLiquidationExcess,
          color: "#3b82f6",
        },
        {
          name: "Phí dịch vụ",
          value: data.summary.totalServiceFee,
          color: "#eab308",
        },
        {
          name: "Phạt quá hạn",
          value: data.summary.totalLateFee,
          color: "#9ca3af",
        },
      ].filter((i) => i.value > 0)
    : [];

  return (
    <div className="space-y-6">
      <RoleGate
        allowedRoles={["admin", "manager", "store_owner"]}
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
            <StoreSelector value={storeId} onChange={setStoreId} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => fetchData()}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Áp dụng"
                )}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !data ? (
          <div className="text-center p-12 text-muted-foreground">
            Không có dữ liệu
          </div>
        ) : (
          <>
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
                    {formatCurrency(data.summary.totalRevenue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lợi nhuận ròng (Ước tính)
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 font-mono">
                    {formatCurrency(
                      data.summary.totalRevenue - data.summary.totalExpense
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Doanh thu - Chi phí
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng chi phí
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 font-mono">
                    {formatCurrency(data.summary.totalExpense)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Giải ngân
                  </CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {formatCurrency(data.summary.totalLoanDisbursement)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vốn đã chi ra
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Biểu đồ doanh thu {"&"} chi phí</CardTitle>
                    <CardDescription>
                      Theo dõi xu hướng tài chính trong kỳ
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
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
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
                            formatter={(value) => formatCurrency(value as any)}
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
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number | undefined)
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-xl font-bold">100%</div>
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
                          <span className="font-semibold">
                            {(
                              (item.value / data.summary.totalRevenue) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Chi tiết hằng ngày</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
                        <TableHead className="text-right">Chi phí</TableHead>
                        <TableHead className="text-right">
                          Lợi nhuận ngày
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(Array.isArray(data.data) ? data.data : []).map(
                        (entry, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {new Date(entry.date).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              +{formatCurrency(entry.totalRevenue)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              -{formatCurrency(entry.totalExpense)}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(
                                entry.totalRevenue - entry.totalExpense
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </RoleGate>
    </div>
  );
};

export default RevenueReportTab;
