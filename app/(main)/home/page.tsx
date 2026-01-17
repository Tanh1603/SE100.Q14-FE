"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  ChevronRight,
  FileText,
  HandCoins,
  HomeIcon,
  Phone,
  Loader2,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  RepaymentScheduleService,
  RepaymentScheduleItemResponse,
} from "@/lib/repayment-schedule.service";
import {
  CommunicationService,
  PromiseToPayItem,
} from "@/lib/communication.service";
import { PaymentServiceReal } from "@/lib/payment.service";
import { LoanService } from "@/lib/loan.service";
import { DebtReminderDialog } from "@/components/features/payment/debt-reminder-dialog";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const HomePage = () => {
  const [stats, setStats] = useState({
    todayTransactions: 0,
    activeLoansMonth: 0,
    collectedMonth: 0,
  });

  const [overdueItems, setOverdueItems] = useState<any[]>([]);
  const [promisesToPay, setPromisesToPay] = useState<PromiseToPayItem[]>([]);
  const [isLoadingOverdue, setIsLoadingOverdue] = useState(true);

  // Dialog State
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedLogItem, setSelectedLogItem] = useState<any>(null);

  // Local state for "Called Today" visualization
  const [calledItems, setCalledItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchStats = async () => {
      // ... (keep existing stats fetching logic)
      try {
        const today = new Date().toISOString().split("T")[0];
        const firstDayOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        )
          .toISOString()
          .split("T")[0];

        // 1. Transactions Today
        const paymentsToday = await PaymentServiceReal.getPayments({
          dateFrom: today,
          dateTo: today,
        });
        const totalTx = paymentsToday.meta.totalItems;

        // 2. Loans This Month
        const loansRes = await LoanService.getAllLoans(1, 100);
        const loansMonth = loansRes.data.filter(
          (l) => l.loanDate >= firstDayOfMonth,
        ).length;

        // 3. Collected This Month
        const paymentsMonth = await PaymentServiceReal.getPayments({
          dateFrom: firstDayOfMonth,
        });
        const collectedCount = paymentsMonth.meta.totalItems;

        setStats((prev) => ({
          ...prev,
          todayTransactions: totalTx,
          activeLoansMonth: loansMonth,
          collectedMonth: collectedCount,
        }));
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    const fetchOverdue = async () => {
      setIsLoadingOverdue(true);
      try {
        const res = await RepaymentScheduleService.getOverdue({
          minDaysOverdue: 1,
          limit: 5,
        });
        const augmented = res.data.map((item: any) => ({
          ...item,
          id: item.loanId || item.id, // Ensure we have a primary ID for keys/dialogs
          customerName:
            item.customer?.fullName || item.customerName || "Khách hàng",
          contractCode:
            item.loanCode ||
            item.contractCode ||
            item.contractNumber ||
            "HD-ERROR",
          totalAmount:
            item.totalOverdueAmount || item.totalAmount || item.totalLoan || 0,
          dueDate: item.earliestOverdueDate || item.dueDate,
          daysOverdue: item.daysOverdue || 0,
        }));
        setOverdueItems(augmented);
      } catch (error) {
        console.error("Failed to fetch overdue", error);
      } finally {
        setIsLoadingOverdue(false);
      }
    };

    const fetchPromises = async () => {
      try {
        const res = await CommunicationService.getPromisesToPay();
        setPromisesToPay(res || []);
      } catch (error) {
        console.error("Failed to fetch promises", error);
        // Fallback or empty
        setPromisesToPay([]);
      }
    };

    fetchStats();
    fetchOverdue();
    fetchPromises();
  }, []);

  const handleOpenLogDialog = (item: RepaymentScheduleItemResponse) => {
    setSelectedLogItem(item);
    setOpenLogDialog(true);
  };

  const handleLogSuccess = () => {
    if (selectedLogItem) {
      setCalledItems((prev) => new Set(prev).add(selectedLogItem.id));
    }
    // Refresh promises list in case a new one was added
    CommunicationService.getPromisesToPay()
      .then(setPromisesToPay)
      .catch(console.error);
  };

  // Quick pay handler removed - using LogCommunicationDialog for call tracking instead

  return (
    <div className="mx-5 pb-10">
      <div className="flex my-5 items-center">
        <HomeIcon className="text-primary mr-5" />
        <p className="text-2xl text-primary font-bold">Bảng điều khiển</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* ... (Keep existing Stat Cards) ... */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Giao dịch</CardTitle>
            <CardDescription>
              Hôm nay ({new Date().toLocaleDateString("vi-VN")})
            </CardDescription>
            <CardAction>
              <div className="bg-[#e6eabf] rounded-3xl p-2">
                <FileText className="w-10 h-10 text-[#d2ea1d]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {stats.todayTransactions}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cho vay</CardTitle>
            <CardDescription>Hợp đồng tháng này</CardDescription>
            <CardAction>
              <div className="bg-[#eabfe8] rounded-3xl p-2">
                <HandCoins className="w-10 h-10 text-[#ea1ddc]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {stats.activeLoansMonth}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Đã thu</CardTitle>
            <CardDescription>Giao dịch tháng này</CardDescription>
            <CardAction>
              <div className="bg-[#bfeac9] rounded-3xl p-2">
                <Banknote className="w-10 h-10 text-[#26ed1c]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {stats.collectedMonth}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* MAIN CONTENT GRID */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* COLUMN 1: OVERDUE LIST (2/3 width) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📞 Danh sách nhắc nợ ngày mai
            </CardTitle>
            <CardDescription>
              Các khoản vay quá hạn hoặc sắp tới hạn cần xử lý gấp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOverdue ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : overdueItems.length === 0 ? (
              <div className="text-center p-8 text-gray-500 text-sm border border-dashed rounded">
                Không có khoản vay nào cần nhắc nợ.
              </div>
            ) : (
              <div className="space-y-3">
                {overdueItems.map((item) => {
                  const isCalled = calledItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md group ${
                        isCalled
                          ? "bg-green-50 border-green-200 opacity-70"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {item.customerName}
                            </p>
                            {isCalled ? (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Đã gọi
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                Quá hạn {item.daysOverdue} ngày
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            Hợp đồng: {item.contractCode} • Hạn:{" "}
                            {item.dueDate
                              ? new Date(item.dueDate).toLocaleDateString(
                                  "vi-VN",
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right mr-2 hidden sm:block">
                            <p className="text-xs text-gray-500">Phải thu</p>
                            <p
                              className={`font-bold ${
                                isCalled ? "text-green-700" : "text-red-600"
                              }`}
                            >
                              {formatCurrency(item.totalAmount || 0)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className={`${
                              isCalled
                                ? "bg-gray-400 hover:bg-gray-500"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                            onClick={() => handleOpenLogDialog(item)}
                            disabled={isCalled}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {isCalled ? "Xong" : "Gọi"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 text-center">
              <Link href="/contracts/overdue">
                <Button variant="outline" size="sm">
                  Xem tất cả hợp đồng quá hạn và sắp tới hạn
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* COLUMN 2: PROMISES & STATS (1/3 width) */}
        <div className="col-span-1 space-y-5">
          {/* PROMISES TO PAY WIDGET */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                <CalendarClock className="w-4 h-4" /> Danh sách hứa trả
              </CardTitle>
            </CardHeader>
            <CardContent>
              {promisesToPay.length > 0 ? (
                <div className="space-y-3">
                  {promisesToPay.map((promise, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded border shadow-sm text-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800">
                          {promise.customerName}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {new Date(
                            promise.promiseToPayDate,
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {promise.notes || "Không có ghi chú"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Chưa có lịch hẹn trả nợ nào.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedLogItem && (
        <DebtReminderDialog
          open={openLogDialog}
          onOpenChange={setOpenLogDialog}
          loanId={selectedLogItem.id} // ID is already correct from map
          loanCode={selectedLogItem.contractCode || ""}
          customerName={selectedLogItem.customerName}
          onSuccess={handleLogSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
