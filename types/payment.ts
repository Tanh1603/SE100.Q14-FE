// Payment Enums
export type PaymentMethod = "CASH" | "BANK_TRANSFER";
export type PaymentType =
  | "PERIODIC"
  | "EARLY"
  | "PAYOFF"
  | "LATE_FEE"
  | "DISBURSEMENT";
export type PaymentComponent =
  | "PRINCIPAL"
  | "INTEREST"
  | "LATE_FEE"
  | "PENALTY"
  | "SERVICE_FEE";
export type PaymentFlow = "IN" | "OUT";

// Payment Allocation - how backend splits the payment
export interface PaymentAllocation {
  periodNumber: number;
  component: PaymentComponent;
  amount: number;
  description?: string;
}

// Main Payment Interface
export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  flow: PaymentFlow; // IN = money in (customer payment), OUT = money out (disbursement)
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  referenceCode?: string;
  notes?: string;
  paidAt: string; // ISO String
  createdAt: string;
  updatedAt: string;
  allocations?: PaymentAllocation[];
  // Joined data for display
  loan?: {
    id: string;
    contractNumber?: string;
    customerName?: string;
    outstandingBalance?: number;
  };
  // TODO: Add contract reference for disbursements
  // contractId?: string;
  // contract?: {
  //   id: string;
  //   contractNumber?: string;
  //   customerName?: string;
  //   approvedBy?: string;
  // };
}

// Create Payment Request
export interface CreatePaymentRequest {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  referenceCode?: string;
  notes?: string;
}

// API Response Types
export interface PaymentListResponse {
  data: Payment[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  search?: string;
  loanId?: string;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  minAmount?: number;
  maxAmount?: number;
}

// Loan summary for select options
export interface LoanSummary {
  id: string;
  contractNumber: string;
  customerName: string;
  outstandingBalance: number;
}
