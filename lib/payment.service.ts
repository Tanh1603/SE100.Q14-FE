import type {
  Payment,
  PaymentListParams,
  PaymentListResponse,
  CreatePaymentRequest,
  LoanSummary,
} from "@/types/payment";

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
    
    const domainData = PaymentResponseAdapter.toDomain(response.data);

    // Enrichment: Fetch Loan Codes
    const uniqueLoanIds = Array.from(new Set(domainData.data.map(p => p.loanId).filter(Boolean)));
    const loanMap = new Map<string, string>(); // loanId -> contractNumber

    await Promise.all(uniqueLoanIds.map(async (id) => {
        try {
             // Fetch loan details to get the code
             const res = await apiClient.get(ENDPOINTS.LOAN_BY_ID(id));
             // Handle both wrapped { data: ... } and direct responses just in case
             const loanData = res.data.data || res.data;
             if (loanData && loanData.loanCode) {
                 loanMap.set(id, loanData.loanCode);
             }
        } catch (e) { 
            // console.error(`Failed to fetch loan ${id} for payment enrichment`, e); 
        }
    }));

    // Apply enriched contract numbers
    domainData.data = domainData.data.map(p => ({
        ...p,
        loan: p.loan ? { 
            ...p.loan, 
            contractNumber: loanMap.get(p.loanId) || p.loan.contractNumber 
        } : undefined
    }));

    return domainData;
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
/**
 * Fetch paginated list of payments with optional filters
 */
export async function getPayments(
  params: PaymentListParams = {}
): Promise<PaymentListResponse> {
  return PaymentServiceReal.getPayments(params);
}

/**
 * Get a single payment by ID
 */
export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    const response = await apiClient.get<PaymentDTO>(
      `${ENDPOINTS.PAYMENTS}/${id}`
    );
    return PaymentAdapter.toDomain(response.data);
  } catch (error) {
    console.error("Error fetching payment", error);
    return null;
  }
}

/**
 * Create a new payment
 * Requires Idempotency-Key header to prevent double charges
 */
export async function createPayment(
  data: CreatePaymentRequest,
  idempotencyKey: string
): Promise<Payment> {
  return PaymentServiceReal.createPayment(data, idempotencyKey);
}

// ============== Loan API Services ==============

/**
 * Get list of loans for select dropdown
 */
export async function getLoans(): Promise<LoanSummary[]> {
  // This seems to be a lightweight list, potentially different from LoanService.getAllLoans
  // For now, let's try to fetch from the main loans endpoint or a summary endpoint if it existed
  // Using loose typing to avoid circular deps or complex mapping if LoanService is better suited
  const response = await apiClient.get(ENDPOINTS.LOANS);
  // Simplified mapping assuming response structure
  return response.data.data || [];
}

/**
 * Get loan details by ID
 */
export async function getLoanById(id: string): Promise<LoanSummary | null> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.LOANS}/${id}`);
    return response.data.data; // Adapting to the { data: ... } wrapper seen earlier
  } catch (error) {
    console.error("Error fetching loan", error);
    return null;
  }
}
