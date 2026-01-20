"use client";

import type { Payment } from "@/types/payment";
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_COMPONENT_LABELS,
  PaymentMethodEnum,
  PaymentTypeEnum,
  PaymentComponentEnum,
  PaymentMethodColor,
  PaymentTypeColor,
} from "@/types/enum";
import { formatCurrency, formatDate } from "@/lib/payment.service";
import {
  Wallet,
  Calendar,
  FileText,
  CreditCard,
  Hash,
  MessageSquare,
  BadgeDollarSign,
  User,
  Receipt,
} from "lucide-react";

type PaymentDetailProps = {
  payment: Payment;
};

// Helper to get label from options
const getMethodLabel = (value: string) =>
  PAYMENT_METHOD_OPTIONS.find((o) => o.value === value)?.label || value;

const getTypeLabel = (value: string) =>
  PAYMENT_TYPE_OPTIONS.find((o) => o.value === value)?.label || value;

const PaymentDetail = ({ payment }: PaymentDetailProps) => {
  const methodColorClass =
    PaymentMethodColor[payment.paymentMethod as PaymentMethodEnum] ||
    "bg-gray-100 text-gray-800";
  const typeColorClass =
    PaymentTypeColor[payment.paymentType as PaymentTypeEnum] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="min-w-[500px] space-y-6">
      {/* Header with amount */}
      <div className="text-center pb-4 border-b">
        <p className="text-sm text-muted-foreground mb-1">Số tiền thanh toán</p>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(payment.amount)}
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${methodColorClass}`}
          >
            {getMethodLabel(payment.paymentMethod)}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${typeColorClass}`}
          >
            {getTypeLabel(payment.paymentType)}
          </span>
        </div>
      </div>

      {/* Transaction Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Hash className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mã giao dịch</p>
            <p className="font-mono font-medium">
              {payment.referenceCode || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Thời gian</p>
            <p className="font-medium">{formatDate(payment.paidAt)}</p>
          </div>
        </div>
      </div>

      {/* Loan Info */}
      {payment.loan && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-medium text-gray-700">
              Thông tin hợp đồng
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Số hợp đồng:</span>
              <span className="font-medium">{payment.loan.contractNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Khách hàng:</span>
              <span className="font-medium">{payment.loan.customerName}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Dư nợ còn lại:</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(payment.loan.outstandingBalance || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Breakdown */}
      {payment.allocations && payment.allocations.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-3">
            <BadgeDollarSign className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-medium text-green-700">
              Phân bổ thanh toán
            </h4>
          </div>
          <div className="space-y-2">
            {payment.allocations.map((alloc, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm bg-white rounded-md px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-700">
                    {PAYMENT_COMPONENT_LABELS[
                      alloc.component as PaymentComponentEnum
                    ] || alloc.component}
                  </span>
                  {alloc.description && (
                    <span className="text-xs text-muted-foreground">
                      ({alloc.description})
                    </span>
                  )}
                </div>
                <span className="font-medium text-green-700">
                  {formatCurrency(alloc.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {payment.notes && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Ghi chú</p>
            <p className="text-sm text-gray-700">{payment.notes}</p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-muted-foreground pt-4 border-t flex justify-between">
        <span>ID: {payment.id}</span>
        <span>Tạo lúc: {formatDate(payment.createdAt)}</span>
      </div>
    </div>
  );
};

export default PaymentDetail;
