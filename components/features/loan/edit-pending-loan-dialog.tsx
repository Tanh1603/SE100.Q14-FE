"use client";

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
import { Loader2, Save } from "lucide-react";
import { LoanService } from "@/lib/loan.service";
import { LoanTypeService, LoanType } from "@/lib/loan-type.service";
import { StoreService } from "@/lib/store.service";
import { Store } from "@/types/store";
import { RepaymentMethod } from "@/types/enum";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { toast } from "sonner";

interface EditPendingLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  loanCode: string;
  onSuccess?: () => void;
}

export function EditPendingLoanDialog({
  open,
  onOpenChange,
  loanId,
  loanCode,
  onSuccess,
}: EditPendingLoanDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [repaymentMethod, setRepaymentMethod] = useState<string>(
    RepaymentMethod.INTEREST_ONLY,
  );
  const [loanTypeId, setLoanTypeId] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Options data
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(
    null,
  );

  // Fetch loan data and options when dialog opens
  useEffect(() => {
    if (open && loanId) {
      setIsLoading(true);
      Promise.all([
        LoanService.getLoanById(loanId),
        LoanTypeService.getAll(),
        StoreService.getStores({ limit: 100 }),
      ])
        .then(([loanData, typesData, storesRes]) => {
          // Set loan data
          setLoanAmount(loanData.loanAmount || 0);
          setRepaymentMethod(
            loanData.repaymentMethod || RepaymentMethod.INTEREST_ONLY,
          );
          setLoanTypeId(loanData.loanTypeId?.toString() || "");
          setStoreId(loanData.storeId || "");
          setNotes(loanData.notes || "");

          // Set options
          setLoanTypes(typesData);
          setStores(storesRes.data || []);

          // Set selected loan type
          const foundType = typesData.find(
            (t) => t.id.toString() === loanData.loanTypeId?.toString(),
          );
          setSelectedLoanType(foundType || null);
        })
        .catch((err) => {
          console.error("Failed to load loan data:", err);
          toast.error("Không thể tải thông tin khoản vay");
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, loanId]);

  // Update selected loan type when loanTypeId changes
  useEffect(() => {
    if (loanTypeId && loanTypes.length > 0) {
      const type = loanTypes.find((t) => t.id.toString() === loanTypeId);
      setSelectedLoanType(type || null);
    }
  }, [loanTypeId, loanTypes]);

  const handleSubmit = async () => {
    if (!loanAmount || loanAmount <= 0) {
      toast.error("Vui lòng nhập số tiền vay hợp lệ");
      return;
    }
    if (!loanTypeId) {
      toast.error("Vui lòng chọn gói vay");
      return;
    }
    if (!storeId) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }

    setIsSubmitting(true);
    try {
      await LoanService.updateLoan(loanId, {
        loanAmount,
        repaymentMethod,
        loanTypeId: Number(loanTypeId),
        storeId,
        notes,
      });

      toast.success("Cập nhật hồ sơ vay thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Update loan failed", error);
      const errorMessage =
        error instanceof Error ? error.message : "Cập nhật thất bại";
      toast.error(errorMessage);
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa hồ sơ vay</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin khoản vay chờ duyệt {loanCode}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Loan Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Số tiền vay</Label>
              <div className="col-span-3 relative">
                <Input
                  type="number"
                  placeholder="Nhập số tiền vay"
                  value={loanAmount || ""}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 font-bold">
                  ₫
                </span>
              </div>
            </div>

            {/* Loan Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Gói vay</Label>
              <div className="col-span-3">
                <SearchableSelect
                  options={loanTypes.map((type) => ({
                    value: type.id.toString(),
                    label: type.name,
                    detail: `${type.interestRateMonthly}%/tháng - ${type.durationMonths} tháng`,
                  }))}
                  value={loanTypeId}
                  onValueChange={setLoanTypeId}
                  placeholder="Tìm kiếm gói vay..."
                />
              </div>
            </div>

            {/* Duration (Read-only) */}
            {selectedLoanType && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-gray-500">Thời hạn</Label>
                <div className="col-span-3 text-sm text-gray-600 bg-gray-100 rounded-md px-3 py-2">
                  {selectedLoanType.durationMonths} Tháng - Lãi suất:{" "}
                  {selectedLoanType.interestRateMonthly}%/tháng
                </div>
              </div>
            )}

            {/* Store */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Chi nhánh</Label>
              <Select value={storeId} onValueChange={setStoreId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Repayment Method */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Hình thức trả</Label>
              <Select
                value={repaymentMethod}
                onValueChange={setRepaymentMethod}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RepaymentMethod.INTEREST_ONLY}>
                    Trả lãi định kỳ (Gốc cuối kỳ)
                  </SelectItem>
                  <SelectItem value={RepaymentMethod.EQUAL_INSTALLMENT}>
                    Trả góp đều (Gốc + Lãi)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Ghi chú</Label>
              <Textarea
                className="col-span-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>

            {/* Summary */}
            {loanAmount > 0 && selectedLoanType && (
              <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1 border border-gray-200 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền vay:</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lãi suất áp dụng:</span>
                  <span className="font-medium">
                    {selectedLoanType.interestRateMonthly}% / tháng
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium">
                    {selectedLoanType.durationMonths} tháng
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-300">
                  <span className="font-bold text-gray-800">
                    Lãi dự tính (ước tính):
                  </span>
                  <span className="font-bold text-primary">
                    {formatCurrency(
                      (loanAmount *
                        selectedLoanType.interestRateMonthly *
                        selectedLoanType.durationMonths) /
                        100,
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            disabled={isSubmitting || isLoading}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
