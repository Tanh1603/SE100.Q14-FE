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
  period_number: number;
  component: PaymentComponentDTO;
  amount: number;
  description?: string;
}

// Nested Loan DTO
export interface PaymentLoanDTO {
  id: string;
  contract_number?: string;
  customer_name?: string;
  outstanding_balance?: number;
}

// Main Payment DTO (The Raw API Response)
export interface PaymentDTO {
  id: string;
  loan_id: string;
  amount: number;
  flow: PaymentFlowDTO;
  payment_method: PaymentMethodDTO;
  payment_type: PaymentTypeDTO;
  reference_code?: string;
  notes?: string;
  paid_at: string; // ISO String
  created_at: string;
  updated_at: string;
  allocations?: PaymentAllocationDTO[];
  loan?: PaymentLoanDTO;
}

// Response Wrapper DTO (if pagination is standardized)
export interface PagedResponseDTO<T> {
  data: T[];
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
  stats?: {
    total_money: number;
    total_income: number;
    total_expense: number;
  };
}
