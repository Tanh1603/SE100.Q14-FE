"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Payment, PaymentType, PaymentMethod } from "@/types/payment";
import { PaymentMethodEnum, PaymentTypeEnum } from "@/types/enum";
import { useEffect, useState } from "react";
import {
  Banknote,
  Trash2,
  Plus as PlusIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { getUserRole } from "@/lib/role.helper";

interface CashbookSidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayment: Payment | null;
  mode: "create" | "view" | "edit";
  onSave: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

const emptyPayment: Payment = {
  id: "",
  loanId: "",
  amount: 0,
  flow: "IN",
  paymentMethod: "CASH",
  paymentType: "OTHER_INCOME",
  notes: "",
  paidAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function CashbookSidePanel({
  open,
  onOpenChange,
  selectedPayment,
  mode: initialMode,
  onSave,
  onDelete,
}: CashbookSidePanelProps) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState<Payment>(emptyPayment);
  const [dateStr, setDateStr] = useState<string>("");
  const { user } = useUser();
  const role = getUserRole(user?.publicMetadata);
  const isAdmin = role === Role.ADMIN;

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === "create") {
      setFormData({
        ...emptyPayment,
        id: Math.random().toString(), // Temp ID
      });
      setDateStr(new Date().toISOString().slice(0, 16));
    } else if (selectedPayment) {
      setFormData(selectedPayment);
      const d = selectedPayment.paidAt
        ? new Date(selectedPayment.paidAt)
        : new Date();
      setDateStr(d.toISOString().slice(0, 16));
    }
  }, [initialMode, selectedPayment, open]);

  const handleSave = () => {
    // Validation: Require notes for Other Income/Expense
    if (
      (formData.paymentType === "OTHER_INCOME" ||
        formData.paymentType === "OTHER_EXPENSE") &&
      !formData.notes?.trim()
    ) {
      alert("Vui lòng nhập nội dung/ghi chú cho loại giao dịch này.");
      return;
    }

    onSave({
      ...formData,
      paidAt: new Date(dateStr).toISOString(),
    });
    onOpenChange(false);
  };

  const isView = mode === "view";

  const getTransactionColor = (type: PaymentType) => {
    const expenses: PaymentType[] = ["OTHER_EXPENSE", "DISBURSEMENT"];
    return expenses.includes(type) ? "text-red-600" : "text-green-600";
  };

  // Restrict types for manual creation
  const isOtherType =
    formData.paymentType === "OTHER_INCOME" ||
    formData.paymentType === "OTHER_EXPENSE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {mode === "create" && (
              <PlusIcon className="w-5 h-5 text-green-600" />
            )}
            {mode === "view" && <EyeIcon className="w-5 h-5 text-blue-600" />}
            {mode === "edit" && (
              <EditIcon className="w-5 h-5 text-orange-600" />
            )}

            {mode === "create"
              ? "Tạo phiếu thu/chi mới"
              : mode === "edit"
                ? "Chỉnh sửa phiếu"
                : "Chi tiết giao dịch"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? `Mã giao dịch: ${formData.id}`
              : "Nhập thông tin giao dịch bên dưới"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Display / Input */}
          <div className="bg-gray-50 p-4 rounded-xl border text-center space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Số tiền giao dịch
            </Label>
            {isView ? (
              <p
                className={cn(
                  "text-3xl font-bold",
                  getTransactionColor(formData.paymentType),
                )}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(formData.amount)}
              </p>
            ) : (
              <div className="relative">
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  className="text-2xl font-bold text-center h-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  VNĐ
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Transaction Date */}
            <div className="grid gap-2">
              <Label>Ngày giao dịch</Label>
              {isView ? (
                <div className="p-2 border rounded-md bg-gray-50 text-sm">
                  {formData.paidAt
                    ? new Date(formData.paidAt).toLocaleString("vi-VN")
                    : "N/A"}
                </div>
              ) : (
                <Input
                  type="datetime-local"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Transaction Type */}
            <div className="grid gap-2">
              <Label>Loại giao dịch</Label>
              <Select
                disabled={isView}
                value={formData.paymentType}
                onValueChange={(val) =>
                  setFormData({ ...formData, paymentType: val as PaymentType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  {mode === "create" ? (
                    <>
                      <SelectItem value={PaymentTypeEnum.OTHER_INCOME}>
                        Thu khác
                      </SelectItem>
                      <SelectItem value={PaymentTypeEnum.OTHER_EXPENSE}>
                        Chi khác
                      </SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value={PaymentTypeEnum.PERIODIC}>
                        Thu lãi định kỳ
                      </SelectItem>
                      <SelectItem value={PaymentTypeEnum.LIQUIDATION}>
                        Thanh lý tài sản
                      </SelectItem>
                      <SelectItem value={PaymentTypeEnum.OTHER_INCOME}>
                        Thu khác
                      </SelectItem>
                      <SelectItem value={PaymentTypeEnum.DISBURSEMENT}>
                        Giải ngân hợp đồng
                      </SelectItem>
                      <SelectItem value={PaymentTypeEnum.OTHER_EXPENSE}>
                        Chi khác
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="grid gap-2">
              <Label>Phương thức thanh toán</Label>
              <Select
                disabled={isView}
                value={formData.paymentMethod}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    paymentMethod: val as PaymentMethod,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethodEnum.CASH}>
                    Tiền mặt
                  </SelectItem>
                  <SelectItem value={PaymentMethodEnum.BANK_TRANSFER}>
                    Chuyển khoản
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content / Notes */}
            <div className="grid gap-2">
              <Label>
                Nội dung / Ghi chú
                {isOtherType && !isView && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Textarea
                disabled={isView}
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={
                  isOtherType
                    ? "Bắt buộc nhập nội dung..."
                    : "Nhập nội dung chi tiết..."
                }
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Related Contract (Optional) - Hide if null/empty in View, or always for Other types in Create */}
            {(formData.loanId || (mode === "create" && !isOtherType)) && (
              <div className="grid gap-2">
                <Label>Mã hợp đồng</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    disabled={isView}
                    value={formData.loanId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanId: e.target.value,
                      })
                    }
                    className="pl-9"
                    placeholder="HD-XXXXXX"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {mode === "view" ? (
            <>
              {isAdmin && (
                <>
                  <Button onClick={() => setMode("edit")} className="w-full">
                    <EditIcon className="w-4 h-4 mr-2" /> Chỉnh sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
                        onDelete(formData.id);
                        onOpenChange(false);
                      }
                    }}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Xóa giao dịch
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="w-full bg-primary font-bold"
              >
                {mode === "create" ? "Tạo phiếu" : "Lưu thay đổi"}
              </Button>
              {mode === "edit" && (
                <Button
                  variant="outline"
                  onClick={() => setMode("view")}
                  className="w-full"
                >
                  Hủy bỏ
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
