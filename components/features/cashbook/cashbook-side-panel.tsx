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
import { Branch } from "@/types/branch";
import { useEffect, useState } from "react";
import {
  Trash2,
  Plus as PlusIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { getUserRole } from "@/lib/role.helper";
import { useCreatePayment } from "@/hooks/use-payment";
import { useBranch } from "@/hooks/use-branch";
import { DisbursementService } from "@/lib/disbursement.service";
import { generateIdempotencyKey } from "@/lib/payment.service";
import { toast } from "sonner";

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
  const [recipientName, setRecipientName] = useState("");
  // const { user } = useUser(); // Removed duplicate
  // const { user } = useUser(); // Removed duplicate
  const { data: branches, isLoading: isBranchLoading } = useBranch({
    limit: 20,
    isActive: true,
  });

  const { execute: createPayment, isLoading: isPaymentLoading } =
    useCreatePayment();
  const [isDisbursementLoading, setIsDisbursementLoading] = useState(false);

  // Derived state to check if operation is loading
  const isLoading = isPaymentLoading || isDisbursementLoading;
  const { user } = useUser();
  const role = getUserRole(user?.publicMetadata);
  const isAdmin = role === Role.ADMIN;

  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === "create") {
      setFormData({
        ...emptyPayment,
        id: Math.random().toString(), // Temp ID
      });
      setDateStr(new Date().toISOString().slice(0, 16));
      // Default to user's store if available
      const userStoreId = user?.publicMetadata?.storeId as string;
      if (userStoreId) {
        // We might want to set this in a separate state if we want to allow changing it indepedently of formData
        // But since Payment doesn't have storeId field in frontend type (it's in payload), we use a separate state.
        setStoreId(userStoreId);
      }
    } else if (selectedPayment) {
      setFormData(selectedPayment);
      const d = selectedPayment.paidAt
        ? new Date(selectedPayment.paidAt)
        : new Date();
      setDateStr(d.toISOString().slice(0, 16));
      // For view/edit, we might not have storeId in payment object easily unless we fetch or map it.
      // For now, leave it empty or try to infer?
      // The user wants it for "non-loan entries creation" mostly.
    }
  }, [initialMode, selectedPayment, open, user]);

  const handleSave = async () => {
    // Validation: Require notes for Other Income/Expense
    if (
      (formData.paymentType === "OTHER_INCOME" ||
        formData.paymentType === "OTHER_EXPENSE") &&
      !formData.notes?.trim()
    ) {
      toast.error("Vui lòng nhập nội dung/ghi chú cho loại giao dịch này.");
      return;
    }

    const isExpense =
      formData.paymentType === PaymentTypeEnum.DISBURSEMENT ||
      formData.paymentType === PaymentTypeEnum.OTHER_EXPENSE;

    if (isExpense && !recipientName.trim()) {
      // For Loan Disbursement, maybe default to customer name if empty?
      // But keeping it required for now as per "recipientName is still required"
      toast.error("Vui lòng nhập tên người nhận.");
      return;
    }

    if (!storeId) {
      toast.error("Vui lòng chọn Cửa hàng/Chi nhánh.");
      return;
    }

    try {
      if (isExpense) {
        // Handle Disbursement / Other Expense
        setIsDisbursementLoading(true);
        const disbursementData = {
          storeId,
          loanId: undefined, // Explicitly no loan for side panel creation
          amount: formData.amount,
          disbursementMethod: formData.paymentMethod as
            | "CASH"
            | "BANK_TRANSFER",
          recipientName: recipientName,
          notes: formData.notes,
        };

        await DisbursementService.create(
          disbursementData,
          generateIdempotencyKey(),
        );
        setIsDisbursementLoading(false);
        toast.success("Tạo phiếu chi thành công!");
      } else {
        // Handle Payment / Other Income
        await createPayment({
          storeId, // Required for OTHER_INCOME
          loanId: undefined, // Explicitly no loan
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          paymentType: formData.paymentType,
          notes: formData.notes,
          transactionDate: new Date(dateStr).toISOString(),
        });
        toast.success("Tạo phiếu thu thành công!");
      }

      onSave({
        ...formData,
        paidAt: new Date(dateStr).toISOString(),
      });
      onOpenChange(false);
    } catch (e) {
      setIsDisbursementLoading(false);
      const msg = e instanceof Error ? e.message : "Đã có lỗi xảy ra";
      toast.error("Lỗi giao dịch: " + msg);
    }
  };

  const isView = mode === "view";

  const getTransactionColor = (type: PaymentType) => {
    const expenses: PaymentType[] = ["OTHER_EXPENSE", "DISBURSEMENT"];
    return expenses.includes(type) ? "text-red-600" : "text-green-600";
  };

  const isOtherType = true; // Always true in this context
  const isExpenseType = formData.paymentType === PaymentTypeEnum.OTHER_EXPENSE;

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
            {/* Store Selection */}
            {mode === "create" && (
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-500" />
                  Cửa hàng / Chi nhánh <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={storeId}
                  onValueChange={setStoreId}
                  disabled={isBranchLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isBranchLoading ? "Đang tải..." : "Chọn cửa hàng"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {branches?.data?.map((branch: Branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                onValueChange={(val) => {
                  const type = val as PaymentType;
                  setFormData({
                    ...formData,
                    paymentType: type,
                    // Clear loan ID if switching to type that doesn't support it or just to be clean
                    loanId: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentTypeEnum.OTHER_INCOME}>
                    Thu khác
                  </SelectItem>
                  <SelectItem value={PaymentTypeEnum.OTHER_EXPENSE}>
                    Chi khác
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Name (For Expenses) */}
            {isExpenseType && !isView && (
              <div className="grid gap-2">
                <Label>
                  Người nhận tiền <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nhập tên người nhận..."
                />
              </div>
            )}

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
                disabled={isLoading}
              >
                {isLoading
                  ? "Đang xử lý..."
                  : mode === "create"
                    ? "Tạo phiếu"
                    : "Lưu thay đổi"}
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
