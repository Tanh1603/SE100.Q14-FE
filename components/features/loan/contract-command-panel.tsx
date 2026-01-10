"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { loan } from "@/types/asset";
import {
  Banknote,
  ChevronDown,
  Clock,
  Eye,
  History,
  RefreshCcw,
} from "lucide-react";
import { useState, useMemo } from "react";

interface ContractCommandPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: (loan & { contractNumber?: string; endDate?: string }) | null;
  onPaymentSuccess?: () => void;
  onRefinanceSuccess?: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

// Mock payment history
const mockPaymentHistory = [
  {
    id: "1",
    date: "2024-01-01",
    type: "Tạo hợp đồng",
    amount: 5000000,
    status: "success",
  },
  {
    id: "2",
    date: "2024-02-01",
    type: "Thu lãi kỳ 1",
    amount: 75000,
    status: "success",
  },
  {
    id: "3",
    date: "2024-03-01",
    type: "Thu lãi kỳ 2",
    amount: 75000,
    status: "success",
  },
  {
    id: "4",
    date: "2024-04-01",
    type: "Nhắc nợ",
    amount: 0,
    status: "pending",
  },
];

export function ContractCommandPanel({
  open,
  onOpenChange,
  contract,
  onPaymentSuccess,
  onRefinanceSuccess,
}: ContractCommandPanelProps) {
  // Calculate initial values with useMemo to avoid effect-based setState
  const initialInterest = useMemo(() => {
    if (!contract) return 0;
    return Math.round((contract.totalLoan * contract.interestRate) / 100);
  }, [contract]);

  const initialRefinanceDate = useMemo(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  }, []);

  const [paymentAmount, setPaymentAmount] = useState(initialInterest);
  const [refinanceDate, setRefinanceDate] = useState(initialRefinanceDate);
  const [refinanceConfirmed, setRefinanceConfirmed] = useState(false);
  const [openSections, setOpenSections] = useState({
    overview: true,
    payment: true,
    refinance: false,
    history: false,
  });

  if (!contract) return null;

  const interest = (contract.totalLoan * contract.interestRate) / 100;
  const contractNumber =
    contract.contractNumber || `HD-${contract.id?.slice(0, 6) || "NEW"}`;

  const handlePayment = () => {
    // Mock payment action
    alert(`Thanh toán thành công: ${formatCurrency(paymentAmount)}`);
    onPaymentSuccess?.();
  };

  const handleRefinance = () => {
    if (!refinanceConfirmed) {
      alert("Vui lòng xác nhận đồng ý điều khoản gia hạn");
      return;
    }
    alert(`Gia hạn thành công đến ngày: ${refinanceDate}`);
    onRefinanceSuccess?.();
    onOpenChange(false);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {contractNumber}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {contract.customer.fullName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Overview Section */}
          <Collapsible
            open={openSections.overview}
            onOpenChange={() => toggleSection("overview")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border text-left hover:bg-gray-100 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-800">Tổng quan</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Tài sản thế chấp</p>
                    <p className="font-medium">{contract.asset.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Kho lưu trữ</p>
                    <p className="font-medium">
                      {contract.asset.warehouses?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số tiền vay</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(contract.totalLoan)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lãi suất</p>
                    <p className="font-medium">
                      {contract.interestRate}%/tháng
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lãi kỳ này</p>
                    <p className="font-bold text-orange-600">
                      {formatCurrency(interest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số kỳ còn lại</p>
                    <p className="font-medium">
                      {contract.numberPayment || 12} kỳ
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Quick Payment Section */}
          <Collapsible
            open={openSections.payment}
            onOpenChange={() => toggleSection("payment")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg border border-green-200 text-left hover:bg-green-100 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">
                  Thanh toán nhanh
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-green-600 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="bg-green-50/50 border border-green-100 rounded-lg p-4 space-y-4">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Lãi kỳ hiện tại (dự tính)
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(interest)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Số tiền thực thu (VNĐ)
                  </Label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="text-lg font-semibold"
                  />
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-md"
                  onClick={handlePayment}
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  Xác nhận thu lãi
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Refinance Section */}
          <Collapsible
            open={openSections.refinance}
            onOpenChange={() => toggleSection("refinance")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-lg border border-blue-200 text-left hover:bg-blue-100 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Gia hạn hợp đồng
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-600 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">
                      Ngày đáo hạn cũ
                    </Label>
                    <div className="mt-1 p-2 bg-gray-100 rounded border text-sm font-medium">
                      {contract.endDate?.split("T")[0] || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">
                      Ngày đáo hạn mới
                    </Label>
                    <Input
                      type="date"
                      value={refinanceDate}
                      onChange={(e) => setRefinanceDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded border border-orange-100 space-y-2">
                  <p className="text-sm font-medium text-orange-800">
                    Nghĩa vụ thanh toán khi gia hạn:
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Lãi kỳ hiện tại:</span>
                    <span className="font-bold">
                      {formatCurrency(interest)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Phạt quá hạn (nếu có):</span>
                    <span className="font-bold">{formatCurrency(0)}</span>
                  </div>
                  <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-orange-800">
                    <span>Tổng cần thu:</span>
                    <span>{formatCurrency(interest)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refinance-confirm"
                    checked={refinanceConfirmed}
                    onCheckedChange={(checked) =>
                      setRefinanceConfirmed(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="refinance-confirm"
                    className="text-sm font-medium leading-none"
                  >
                    Khách hàng đã đồng ý điều khoản gia hạn
                  </label>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                  onClick={handleRefinance}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Xác nhận gia hạn
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Payment History Section */}
          <Collapsible
            open={openSections.history}
            onOpenChange={() => toggleSection("history")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg border border-purple-200 text-left hover:bg-purple-100 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-800">
                  Lịch sử giao dịch
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-purple-600 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="bg-white border rounded-lg divide-y max-h-64 overflow-y-auto">
                {mockPaymentHistory.map((item) => (
                  <div key={item.id} className="p-3 flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.status === "success"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status === "success" ? (
                        <Banknote className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.type}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    {item.amount > 0 && (
                      <p
                        className={`text-sm font-bold ${
                          item.type.includes("Thu")
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.type.includes("Thu") ? "+" : ""}
                        {formatCurrency(item.amount)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
}
