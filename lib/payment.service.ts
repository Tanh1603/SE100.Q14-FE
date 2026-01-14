import type {
  Payment,
  PaymentListParams,
  PaymentListResponse,
  CreatePaymentRequest,
  LoanSummary,
} from "@/types/payment";
import { mockPayments, mockLoans } from "@/mock-data/payment";
import {
  PaymentResponseAdapter,
  PaymentAdapter,
  CreatePaymentAdapter,
} from "@/lib/adapters/payment.adapter";
import { PaymentDTO, PagedResponseDTO } from "@/types/dto/payment.dto";

import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

// Utility to generate UUID for Idempotency-Key
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

// Utility to format currency in VND
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Utility to format date for display
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// ============== Payment API Services ==============

/**
 * Real API Implementation (Future Use)
 * This uses the Adapter Pattern to decouple from Backend
 */
export const PaymentServiceReal = {
  getPayments: async (
    params: PaymentListParams
  ): Promise<PaymentListResponse> => {
    const queryParams: Record<string, string | number | boolean> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams[key] = value;
      }
    });

    const response = await apiClient.get<PagedResponseDTO<PaymentDTO>>(
      ENDPOINTS.PAYMENTS,
      { params: queryParams }
    );
    return PaymentResponseAdapter.toDomain(response.data);
  },

  createPayment: async (
    data: CreatePaymentRequest,
    idempotencyKey: string
  ): Promise<Payment> => {
    const payload = CreatePaymentAdapter.toPayload(data);
    const response = await apiClient.post<PaymentDTO>(
      ENDPOINTS.PAYMENTS,
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
    return PaymentAdapter.toDomain(response.data);
  },
};

/**
 * Fetch paginated list of payments with optional filters
 */
export async function getPayments(
  params: PaymentListParams = {}
): Promise<PaymentListResponse> {
  // To switch to real API: return PaymentServiceReal.getPayments(params);

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPayments = [...mockPayments];

      // Apply filters
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredPayments = filteredPayments.filter(
          (p) =>
            p.referenceCode?.toLowerCase().includes(searchLower) ||
            p.loan?.customerName?.toLowerCase().includes(searchLower) ||
            p.loan?.contractNumber?.toLowerCase().includes(searchLower)
        );
      }

      if (params.loanId) {
        filteredPayments = filteredPayments.filter(
          (p) => p.loanId === params.loanId
        );
      }

      if (params.paymentMethod) {
        filteredPayments = filteredPayments.filter(
          (p) => p.paymentMethod === params.paymentMethod
        );
      }

      if (params.paymentType) {
        filteredPayments = filteredPayments.filter(
          (p) => p.paymentType === params.paymentType
        );
      }

      if (params.dateFrom) {
        filteredPayments = filteredPayments.filter(
          (p) => new Date(p.paidAt) >= new Date(params.dateFrom!)
        );
      }

      if (params.dateTo) {
        filteredPayments = filteredPayments.filter(
          (p) => new Date(p.paidAt) <= new Date(params.dateTo!)
        );
      }

      if (params.minAmount !== undefined) {
        filteredPayments = filteredPayments.filter(
          (p) => p.amount >= params.minAmount!
        );
      }

      if (params.maxAmount !== undefined) {
        filteredPayments = filteredPayments.filter(
          (p) => p.amount <= params.maxAmount!
        );
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedPayments = filteredPayments.slice(
        startIndex,
        startIndex + limit
      );

      // Calculate stats
      const totalMoney = mockPayments.reduce((acc, p) => {
        return acc + (p.flow === "IN" ? p.amount : -p.amount);
      }, 0);

      const totalIncome = filteredPayments.reduce((acc, p) => {
        return acc + (p.flow === "IN" ? p.amount : 0);
      }, 0);

      const totalExpense = filteredPayments.reduce((acc, p) => {
        return acc + (p.flow === "OUT" ? p.amount : 0);
      }, 0);

      resolve({
        data: paginatedPayments,
        meta: {
          totalItems: filteredPayments.length,
          totalPages: Math.ceil(filteredPayments.length / limit),
          currentPage: page,
          limit,
        },
        stats: {
          totalMoney,
          totalIncome,
          totalExpense,
        },
      });
    }, 300);
  });
}

/**
 * Get a single payment by ID
 */
export async function getPaymentById(id: string): Promise<Payment | null> {
  // TODO: Replace with actual API call
  // return apiFetch<Payment>(`/payments/${id}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const payment = mockPayments.find((p) => p.id === id);
      resolve(payment || null);
    }, 200);
  });
}

/**
 * Create a new payment
 * Requires Idempotency-Key header to prevent double charges
 */
export async function createPayment(
  data: CreatePaymentRequest,
  idempotencyKey: string
): Promise<Payment> {
  // To switch to real API: return PaymentServiceReal.createPayment(data, idempotencyKey);

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate amount
      if (data.amount <= 0) {
        reject(new Error("Số tiền thanh toán phải lớn hơn 0"));
        return;
      }

      // Mock payoff validation
      if (data.paymentType === "PAYOFF") {
        const loan = mockLoans.find((l) => l.id === data.loanId);
        if (loan && data.amount < loan.outstandingBalance) {
          reject(
            new Error(
              `Số tiền tất toán phải bằng tổng dư nợ: ${formatCurrency(
                loan.outstandingBalance
              )}`
            )
          );
          return;
        }
      }

      // Create mock payment
      const loan = mockLoans.find((l) => l.id === data.loanId);
      const now = new Date().toISOString();
      const paidAt = data.transactionDate
        ? new Date(data.transactionDate).toISOString()
        : now;

      // Mock waterfall allocation
      const interestAmount = Math.floor(data.amount * 0.2);
      const principalAmount = data.amount - interestAmount;

      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        loanId: data.loanId,
        amount: data.amount,
        flow: "IN",
        paymentMethod: data.paymentMethod,
        paymentType: data.paymentType,
        referenceCode: data.referenceCode || `RC-${Date.now()}`,
        notes: data.notes,
        paidAt: paidAt,
        createdAt: now,
        updatedAt: now,
        allocations: [
          {
            periodNumber: 1,
            component: "INTEREST",
            amount: interestAmount,
            description: "Tiền lãi",
          },
          {
            periodNumber: 1,
            component: "PRINCIPAL",
            amount: principalAmount,
            description: "Tiền gốc",
          },
        ],
        loan: loan
          ? {
              id: loan.id,
              contractNumber: loan.contractNumber,
              customerName: loan.customerName,
              outstandingBalance: loan.outstandingBalance - data.amount,
            }
          : undefined,
      };

      resolve(newPayment);
    }, 500);
  });
}

// ============== Loan API Services ==============

/**
 * Get list of loans for select dropdown
 */
export async function getLoans(): Promise<LoanSummary[]> {
  // TODO: Replace with actual API call
  // return apiFetch<LoanSummary[]>("/loans/summary");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLoans);
    }, 200);
  });
}

/**
 * Get loan details by ID
 */
export async function getLoanById(id: string): Promise<LoanSummary | null> {
  // TODO: Replace with actual API call
  // return apiFetch<LoanSummary>(`/loans/${id}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const loan = mockLoans.find((l) => l.id === id);
      resolve(loan || null);
    }, 200);
  });
}
