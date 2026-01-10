/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useLoans, useCreatePayment } from "@/hooks/use-payment";
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_COMPONENT_LABELS,
  PaymentComponentEnum,
} from "@/types/enum";
import { formatCurrency } from "@/lib/payment.service";
import type {
  Payment,
  CreatePaymentRequest,
  PaymentMethod,
  PaymentType,
} from "@/types/payment";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wallet,
  BadgeDollarSign,
  Calendar,
} from "lucide-react";

// Form data type
interface PaymentFormData {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  referenceCode?: string;
  notes?: string;
  transactionDate: string;
}

type PaymentFormProps = {
  onSuccess?: (payment: Payment) => void;
  onCancel?: () => void;
  initialLoanId?: string;
  initialPaymentType?: PaymentType;
};

const PaymentForm = ({
  onSuccess,
  onCancel,
  initialLoanId,
  initialPaymentType = "PERIODIC",
}: PaymentFormProps) => {
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { execute, isLoading: submitting, error, result } = useCreatePayment();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<PaymentFormData>({
    defaultValues: {
      loanId: initialLoanId || "",
      amount: 0,
      paymentMethod: "CASH",
      paymentType: initialPaymentType,
      referenceCode: "",
      notes: "",
      transactionDate: (() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
      })(),
    },
  });

  // Search state for loan combobox
  const [loanSearch, setLoanSearch] = useState("");
  const [showLoanDropdown, setShowLoanDropdown] = useState(false);

  const selectedLoanId = form.watch("loanId");
  const selectedPaymentType = form.watch("paymentType");
  const selectedLoan = loans.find((l) => l.id === selectedLoanId);

  // Filtered loans based on search
  const filteredLoans = loans.filter((loan) => {
    if (!loanSearch.trim()) return true;
    const searchLower = loanSearch.toLowerCase();
    return (
      loan.contractNumber.toLowerCase().includes(searchLower) ||
      loan.customerName.toLowerCase().includes(searchLower)
    );
  });

  // Show warning for PAYOFF type
  const isPayoff = selectedPaymentType === "PAYOFF";

  // Handle form submission
  const onSubmit = async (data: PaymentFormData) => {
    // Validation
    if (!data.loanId) {
      form.setError("loanId", { message: "Vui lòng chọn hợp đồng" });
      return;
    }

    if (data.amount <= 0) {
      form.setError("amount", { message: "Số tiền phải lớn hơn 0" });
      return;
    }

    const paymentData: CreatePaymentRequest = {
      loanId: data.loanId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentType: data.paymentType,
      referenceCode: data.referenceCode || undefined,
      notes: data.notes || undefined,
      transactionDate: new Date(data.transactionDate).toISOString(),
    };

    const payment = await execute(paymentData);

    if (payment) {
      setShowSuccess(true);
    }
  };

  // Success view
  if (showSuccess && result) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 min-w-[500px]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Thanh toán thành công!
        </h3>
        <p className="text-muted-foreground mb-4">
          Mã giao dịch:{" "}
          <span className="font-mono font-medium">{result.referenceCode}</span>
        </p>

        {/* Allocation breakdown */}
        {result.allocations && result.allocations.length > 0 && (
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4" />
              Phân bổ thanh toán
            </h4>
            <div className="space-y-2">
              {result.allocations.map((alloc, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">
                    {PAYMENT_COMPONENT_LABELS[
                      alloc.component as PaymentComponentEnum
                    ] || alloc.component}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(alloc.amount)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between items-center">
                <span className="font-medium text-gray-700">Tổng cộng</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(result.amount)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setShowSuccess(false);
            form.reset();
            onSuccess?.(result);
          }}
        >
          Đóng
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 min-w-[600px]"
      >
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Loan Selection - Magic Search */}
          <FormField
            control={form.control}
            name="loanId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  Hợp đồng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Tìm kiếm theo mã hợp đồng hoặc tên khách hàng..."
                      value={
                        selectedLoan
                          ? `${selectedLoan.contractNumber} - ${selectedLoan.customerName}`
                          : loanSearch
                      }
                      onChange={(e) => {
                        setLoanSearch(e.target.value);
                        setShowLoanDropdown(true);
                        // Clear selection when user starts typing
                        if (field.value) {
                          field.onChange("");
                        }
                      }}
                      onFocus={() => {
                        if (!initialLoanId) setShowLoanDropdown(true);
                      }}
                      onBlur={() => {
                        // Delay to allow click on dropdown item
                        setTimeout(() => setShowLoanDropdown(false), 200);
                      }}
                      disabled={loansLoading || !!initialLoanId}
                      className={`pr-10 ${
                        initialLoanId ? "bg-gray-100 font-medium" : ""
                      }`}
                    />
                    {loansLoading && (
                      <Spinner className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                    )}
                    {selectedLoan && !loansLoading && !initialLoanId && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          field.onChange("");
                          setLoanSearch("");
                        }}
                      >
                        ×
                      </button>
                    )}

                    {/* Dropdown results */}
                    {showLoanDropdown &&
                      !selectedLoan &&
                      !initialLoanId &&
                      filteredLoans.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredLoans.slice(0, 10).map((loan) => (
                            <div
                              key={loan.id}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                              onMouseDown={() => {
                                field.onChange(loan.id);
                                setLoanSearch("");
                                setShowLoanDropdown(false);
                              }}
                            >
                              <div className="font-medium text-sm">
                                {loan.contractNumber} - {loan.customerName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Dư nợ: {formatCurrency(loan.outstandingBalance)}
                              </div>
                            </div>
                          ))}
                          {filteredLoans.length > 10 && (
                            <div className="px-3 py-2 text-xs text-center text-muted-foreground bg-gray-50">
                              Còn {filteredLoans.length - 10} kết quả khác...
                            </div>
                          )}
                        </div>
                      )}

                    {/* No results message */}
                    {showLoanDropdown &&
                      !initialLoanId &&
                      loanSearch.trim() &&
                      filteredLoans.length === 0 &&
                      !loansLoading && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-sm text-muted-foreground text-center">
                          Không tìm thấy hợp đồng
                        </div>
                      )}
                  </div>
                </FormControl>
                {selectedLoan && (
                  <p className="text-sm text-blue-600">
                    Dư nợ hiện tại:{" "}
                    {formatCurrency(selectedLoan.outstandingBalance)}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số tiền <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Nhập số tiền"
                      className="pl-10"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                {field.value > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(field.value)}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transaction Date */}
          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngày giao dịch <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type="datetime-local" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Code */}
          <FormField
            control={form.control}
            name="referenceCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã tham chiếu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập mã tham chiếu (nếu có)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phương thức <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Type */}
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Loại thanh toán <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PAYMENT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payoff Warning */}
          {isPayoff && selectedLoan && (
            <div className="col-span-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Lưu ý tất toán</p>
                <p>
                  Để tất toán hợp đồng, số tiền thanh toán phải bằng hoặc lớn
                  hơn tổng dư nợ:{" "}
                  <span className="font-semibold">
                    {formatCurrency(selectedLoan.outstandingBalance)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập ghi chú (nếu có)"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Xác nhận thanh toán
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
