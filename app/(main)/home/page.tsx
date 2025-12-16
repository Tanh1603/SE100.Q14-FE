"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Banknote,
  FileText,
  HandCoins,
  HomeIcon,
  PiggyBank,
} from "lucide-react";
import { mockDashboardStats } from "@/mock-data/statistics";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const HomePage = () => {
  return (
    <SidebarInset>
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <HomeIcon className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Bảng điều khiển</p>
        </div>
        <div className="flex justify-between gap-5">
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
      </div>
    </SidebarInset>
  );
};

export default HomePage;
