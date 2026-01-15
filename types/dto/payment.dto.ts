export type PaymentMethodDTO = "CASH" | "BANK_TRANSFER";
export type PaymentTypeDTO =
  | "PERIODIC"
  | "EARLY"
  | "PAYOFF"
  | "LATE_FEE"
  | "DISBURSEMENT"
  | "LIQUIDATION"
  | "OTHER_INCOME"
  | "OTHER_EXPENSE";
export type PaymentComponentDTO =
  | "PRINCIPAL"
  | "INTEREST"
  | "LATE_FEE"
  | "PENALTY"
  | "SERVICE_FEE";
export type PaymentFlowDTO = "IN" | "OUT";

// Allocation in DTO
export interface PaymentAllocationDTO {
  periodNumber: number;
  component: PaymentComponentDTO;
  amount: number;
  description?: string;
}

// Nested Loan DTO
export interface PaymentLoanDTO {
  id: string;
  contractNumber?: string;
  customerName?: string;
  outstandingBalance?: number;
}

// Main Payment DTO (The Raw API Response)
export interface PaymentDTO {
  id: string;
  loanId: string;
  amount: number;
  flow?: PaymentFlowDTO; // API might not return this for pure Payment endpoints
  paymentMethod: PaymentMethodDTO;
  paymentType: PaymentTypeDTO;
  referenceCode?: string;
  customerName?: string; // Added from API response
  customerPhone?: string; // Added from API response
  notes?: string;
  paidAt: string; // ISO String
  createdAt: string;
  updatedAt: string;
  allocations?: PaymentAllocationDTO[];
  loan?: PaymentLoanDTO;
}

// Response Wrapper DTO (if pagination is standardized)
export interface PagedResponseDTO<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  stats?: {
    totalMoney: number;
    totalIncome: number;
    totalExpense: number;
  };
}
