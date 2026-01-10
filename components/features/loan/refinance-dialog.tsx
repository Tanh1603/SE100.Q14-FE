"use client";

import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarClock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface RefinanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: {
    id: string;
    customerName: string;
    amount: number;
    maturityDate: string; // ISO date
    interestRate: number;
  } | null;
}

export const RefinanceDialog = ({
  open,
  onOpenChange,
  loan,
}: RefinanceDialogProps) => {
  const [newMaturityDate, setNewMaturityDate] = useState("");
  const [interestToPay, setInterestToPay] = useState(0);

  useEffect(() => {
    if (loan) {
      // Logic: Default extension is 1 month from current maturity
      // If maturity is empty/invalid, use today + 1 month
      const currentMaturity = loan.maturityDate
        ? new Date(loan.maturityDate)
        : new Date();
      currentMaturity.setMonth(currentMaturity.getMonth() + 1);
      setNewMaturityDate(currentMaturity.toISOString().split("T")[0]);

      // Estimate interest for the *past* month that needs to be paid now
      // Simple Interest = Principal * Rate / 100
      setInterestToPay((loan.amount * loan.interestRate) / 100);
    }
  }, [loan]);

  if (!loan) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <AppDialog
      title="Gia hạn hợp đồng (Refinance)"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-6 py-2">
        {/* Info Header */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-blue-900 text-lg">
                {loan.customerName}
              </p>
              <p className="text-sm text-blue-700">Hợp đồng: {loan.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 uppercase font-semibold">
                Gốc vay hiện tại
              </p>
              <p className="text-xl font-bold text-blue-800">
                {formatCurrency(loan.amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Extension Logic */}
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <Label className="text-muted-foreground text-xs uppercase">
                Ngày đáo hạn cũ
              </Label>
              <div className="font-medium bg-gray-100 p-2 rounded mt-1 border">
                {loan.maturityDate ? loan.maturityDate.split("T")[0] : "N/A"}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-6">
              <ArrowRight className="text-blue-500 w-6 h-6" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-blue-700 font-bold">
              Ngày đáo hạn mới (Dự kiến)
            </Label>
            <Input
              type="date"
              value={newMaturityDate}
              onChange={(e) => setNewMaturityDate(e.target.value)}
              className="font-bold"
            />
            <p className="text-xs text-muted-foreground">
              Hệ thống sẽ tạo <b>Phụ lục Hợp đồng</b> mới và gia hạn thêm 1 kỳ
              tính lãi.
            </p>
          </div>
        </div>

        {/* Payment Required */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <CalendarClock className="w-4 h-4 mr-2" />
            Nghĩa vụ tài chính cần thanh toán ngay
          </h4>

          <div className="bg-orange-50 p-4 rounded border border-orange-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Lãi kỳ hiện tại (bắt buộc):</span>
              <span className="font-bold">{formatCurrency(interestToPay)}</span>
            </div>
            {/* Penalty Mock */}
            <div className="flex justify-between items-center text-sm text-red-600">
              <span>Phạt quá hạn (nếu có):</span>
              <span className="font-bold">{formatCurrency(0)}</span>
            </div>

            <div className="border-t border-orange-200 pt-2 flex justify-between items-center text-lg font-bold text-orange-800">
              <span>Tổng cần thu:</span>
              <span>{formatCurrency(interestToPay)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox id="confirm-policy" />
          <label
            htmlFor="confirm-policy"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Khách hàng đã đồng ý điều khoản gia hạn và lãi suất mới.
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8">
            Xác nhận Gia hạn
          </Button>
        </div>
      </div>
    </AppDialog>
  );
};
