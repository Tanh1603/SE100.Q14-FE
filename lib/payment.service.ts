import type {
  Payment,
  PaymentListParams,
  PaymentListResponse,
  CreatePaymentRequest,
  LoanSummary,
} from "@/types/payment";
import { mockPayments, mockLoans } from "@/mock-data/payment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

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

// Generic API fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============== Payment API Services ==============

/**
 * Fetch paginated list of payments with optional filters
 */
export async function getPayments(
  params: PaymentListParams = {}
): Promise<PaymentListResponse> {
  // TODO: Replace with actual API call when backend is ready
  // const queryParams = new URLSearchParams();
  // Object.entries(params).forEach(([key, value]) => {
  //   if (value !== undefined && value !== "") {
  //     queryParams.append(key, String(value));
  //   }
  // });
  // return apiFetch<PaymentListResponse>(`/payments?${queryParams.toString()}`);

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
  // TODO: Replace with actual API call
  // return apiFetch<Payment>("/payments", {
  //   method: "POST",
  //   headers: {
  //     "Idempotency-Key": idempotencyKey,
  //   },
  //   body: JSON.stringify(data),
  // });

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
