import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { LoanService } from "@/lib/loan.service";
import { createPayment, generateIdempotencyKey } from "@/lib/payment.service";
import {
  CreatePaymentRequest,
  PaymentMethod,
  PaymentType,
} from "@/types/payment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  loanCode: string;
  onSuccess?: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  loanId,
  loanCode,
  onSuccess,
}: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Form State
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payType, setPayType] = useState<PaymentType>("PERIODIC");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("CASH");
  const [payNote, setPayNote] = useState("");

  // Payment Suggestion State
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    nextPeriod: { amount: number; period: number; dueDate: string } | null;
    totalPayoff: number;
    remainingPrincipal: number;
  }>({ nextPeriod: null, totalPayoff: 0, remainingPrincipal: 0 });

  // Fetch schedule when dialog opens to calculate suggestions
  useEffect(() => {
    if (open && loanId) {
      setScheduleLoading(true);
      LoanService.getRepaymentSchedule(loanId)
        .then((schedule) => {
          let totalPayoff = 0;
          let totalPrincipal = 0;
          let nextPeriodItem = null;

          schedule.forEach((item) => {
            const paid =
              (item.paidPrincipal || 0) +
              (item.paidInterest || 0) +
              (item.paidFee || 0);
            const remaining = item.totalAmount - paid;
            const principalRemaining =
              item.principalAmount - (item.paidPrincipal || 0);

            if (remaining > 0) {
              totalPayoff += remaining;
            }
            if (principalRemaining > 0) {
              totalPrincipal += principalRemaining;
            }

            // Find the first unpaid/partially paid item for "Periodic" suggestion
            if (!nextPeriodItem && item.status !== "PAID") {
              nextPeriodItem = {
                amount: remaining,
                period: item.periodNumber,
                dueDate: item.dueDate,
              };
            }
          });

          setSuggestions({
            nextPeriod: nextPeriodItem,
            totalPayoff,
            remainingPrincipal: totalPrincipal,
          });
        })
        .catch((err) =>
          console.error("Failed to fetch schedule for suggestion", err)
        )
        .finally(() => setScheduleLoading(false));
    }
  }, [open, loanId]);

  const handlePayment = async () => {
    if (!payAmount || payAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreatePaymentRequest = {
        loanId: loanId,
        amount: payAmount,
        paymentMethod: payMethod,
        paymentType: payType,
        notes: payNote,
        transactionDate: new Date().toISOString(),
      };

      const idempotencyKey = generateIdempotencyKey();
      await createPayment(payload, idempotencyKey);

      onOpenChange(false);
      onSuccess?.();
      // Reset form
      setPayAmount(0);
      setPayNote("");
      alert("Thanh toán thành công!");
    } catch (error: any) {
      console.error("Payment failed", error);
      alert(error.message || "Thanh toán thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán nhanh</DialogTitle>
          <DialogDescription>
            Ghi nhận thanh toán cho hợp đồng {loanCode}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Số tiền</Label>
            <div className="col-span-3 space-y-2">
              <Input
                type="number"
                placeholder="Nhập số tiền"
                value={payAmount || ""}
                onChange={(e) => setPayAmount(Number(e.target.value))}
              />

              {scheduleLoading && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang tính toán...
                </div>
              )}

              {!scheduleLoading && (
                <div className="flex flex-col gap-1">
                  {/* Suggestion based on Type */}
                  {payType === "PERIODIC" && suggestions.nextPeriod && (
                    <div
                      className="text-xs text-blue-600 bg-blue-50 p-2 rounded cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between"
                      onClick={() =>
                        setPayAmount(suggestions.nextPeriod!.amount)
                      }
                    >
                      <span>
                        💡 Kỳ tới:{" "}
                        <strong>
                          {formatCurrency(suggestions.nextPeriod.amount)}
                        </strong>{" "}
                        (Kỳ {suggestions.nextPeriod.period})
                      </span>
                    </div>
                  )}

                  {payType === "PAYOFF" && (
                    <div
                      className="text-xs text-purple-600 bg-purple-50 p-2 rounded cursor-pointer hover:bg-purple-100 transition-colors flex items-center justify-between"
                      onClick={() => setPayAmount(suggestions.totalPayoff)}
                    >
                      <span>
                        💰 Tất toán:{" "}
                        <strong>
                          {formatCurrency(suggestions.totalPayoff)}
                        </strong>{" "}
                        (Tổng nợ còn lại)
                      </span>
                    </div>
                  )}

                  {payType === "EARLY" && (
                    <div
                      className="text-xs text-green-600 bg-green-50 p-2 rounded cursor-pointer hover:bg-green-100 transition-colors flex items-center justify-between"
                      onClick={() =>
                        setPayAmount(suggestions.remainingPrincipal)
                      }
                    >
                      <span>
                        📉 Gốc còn lại:{" "}
                        <strong>
                          {formatCurrency(suggestions.remainingPrincipal)}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Loại</Label>
            <Select
              value={payType}
              onValueChange={(v) => setPayType(v as PaymentType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERIODIC">Đóng lãi định kỳ</SelectItem>
                <SelectItem value="EARLY">Trả gốc một phần</SelectItem>
                <SelectItem value="PAYOFF">Tất toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Hình thức</Label>
            <Select
              value={payMethod}
              onValueChange={(v) => setPayMethod(v as PaymentMethod)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Tiền mặt</SelectItem>
                <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ghi chú</Label>
            <Textarea
              className="col-span-3"
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isSubmitting} onClick={handlePayment}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
