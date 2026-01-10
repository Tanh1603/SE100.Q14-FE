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
  PiggyBank,
} from "lucide-react";
import { mockDashboardStats } from "@/mock-data/statistics";
import Link from "next/link";
import { mockPawnContracts } from "@/mock-data/contracts";
import { ContractCommandPanel } from "@/components/features/loan/contract-command-panel";
import { loan } from "@/types/asset";
import { useState } from "react";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Derive mock data for upcoming payments based on actual contracts
// This ensures we have valid loan objects to pass to the CommandPanel
const upcomingPayments = mockPawnContracts.slice(0, 3).map((loan, index) => {
  const daysUntilDue = index; // 0, 1, 2
  const dueDate = new Date(Date.now() + daysUntilDue * 86400000)
    .toISOString()
    .split("T")[0];
  const interest = (loan.totalLoan * loan.interestRate) / 100;

  return {
    id: loan.id,
    customerName: loan.customer.fullName,
    phone: loan.customer.phoneNumber,
    assetName: loan.asset.name,
    dueDate: dueDate,
    amount: interest,
    daysUntilDue: daysUntilDue,
    contractId: (loan as any).contractNumber || `HD-${loan.id.toUpperCase()}`,
    originalLoan: loan,
  };
});

const getUrgencyColor = (daysUntilDue: number) => {
  if (daysUntilDue <= 0)
    return {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      badge: "bg-red-100",
    };
  if (daysUntilDue === 1)
    return {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
      badge: "bg-yellow-100",
    };
  return {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    badge: "bg-green-100",
  };
};

const getDueDateLabel = (daysUntilDue: number) => {
  if (daysUntilDue <= 0) return "Hôm nay";
  if (daysUntilDue === 1) return "Ngày mai";
  return `Còn ${daysUntilDue} ngày`;
};

const HomePage = () => {
  const [selectedContract, setSelectedContract] = useState<
    (loan & { contractNumber?: string; endDate?: string }) | null
  >(null);
  const [openCommandPanel, setOpenCommandPanel] = useState(false);

  const handleQuickPay = (loan: loan) => {
    setSelectedContract(loan as loan & { contractNumber?: string });
    setOpenCommandPanel(true);
  };

  return (
    <div className="mx-5 pb-10">
      <div className="flex my-5 items-center">
        <HomeIcon className="text-primary mr-5" />
        <p className="text-2xl text-primary font-bold">Bảng điều khiển</p>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Giao dịch</CardTitle>
            <CardDescription>
              Hôm nay {new Date().toISOString().split("T")[0]}
            </CardDescription>
            <CardAction>
              <div className="bg-[#e6eabf] rounded-3xl p-2">
                <FileText className="w-10 h-10 text-[#d2ea1d]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {mockDashboardStats.todayTransactions}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cho vay</CardTitle>
            <CardDescription>Hợp đồng</CardDescription>
            <CardAction>
              <div className="bg-[#eabfe8] rounded-3xl p-2">
                <HandCoins className="w-10 h-10 text-[#ea1ddc]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {mockDashboardStats.activeLoanContracts}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Đã thu</CardTitle>
            <CardDescription>Hợp đồng</CardDescription>
            <CardAction>
              <div className="bg-[#bfeac9] rounded-3xl p-2">
                <Banknote className="w-10 h-10 text-[#26ed1c]" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-500">
              {mockDashboardStats.collectedContracts}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full bg-primary">
          <CardHeader>
            <CardTitle className="text-white">Quỹ tiền còn</CardTitle>
            <CardDescription className="text-white/80 text-xs">
              {formatCurrency(mockDashboardStats.remainingFunds)}
            </CardDescription>
            <CardAction>
              <div className="bg-[#7edd94] rounded-3xl p-2">
                <PiggyBank className="text-white w-10 h-10" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {(mockDashboardStats.remainingFunds / 1000000).toFixed(0)}M
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CALL LIST WIDGET - Now Interactive */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📞 Danh sách nhắc nợ (3 ngày tới)
            </CardTitle>
            <CardDescription>
              Khách hàng đến hạn đóng lãi - Click để xem chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.map((payment) => {
                const urgency = getUrgencyColor(payment.daysUntilDue);
                return (
                  <div
                    key={payment.id}
                    className={`${urgency.bg} ${urgency.border} border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {payment.customerName}
                          </p>
                          <span
                            className={`${urgency.badge} ${urgency.text} text-xs px-2 py-0.5 rounded-full font-medium`}
                          >
                            {getDueDateLabel(payment.daysUntilDue)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {payment.assetName} • {payment.contractId}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {payment.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right mr-2">
                          <p className="text-xs text-gray-500">Lãi cần thu</p>
                          <p className={`font-bold ${urgency.text}`}>
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickPay(payment.originalLoan);
                          }}
                        >
                          <Banknote className="w-4 h-4 mr-1" />
                          Thu lãi
                        </Button>
                        <Link href="/contracts">
                          <Button
                            size="sm"
                            variant="outline"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link href="/contracts">
                <Button variant="outline" size="sm">
                  Xem tất cả hợp đồng
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Tổng quan tuần này</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Hợp đồng mới</span>
              <span className="font-bold text-blue-600">5</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Đã thanh lý</span>
              <span className="font-bold text-red-600">2</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Gia hạn</span>
              <span className="font-bold text-yellow-600">3</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Thu lãi</span>
              <span className="font-bold text-green-600">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContractCommandPanel
        open={openCommandPanel}
        onOpenChange={setOpenCommandPanel}
        contract={selectedContract}
        onPaymentSuccess={() => {
          // Refresh data or show success notification
          setOpenCommandPanel(false);
        }}
        onRefinanceSuccess={() => {
          setOpenCommandPanel(false);
        }}
      />
    </div>
  );
};

export default HomePage;
