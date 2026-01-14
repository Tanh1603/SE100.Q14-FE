export type RepaymentItemStatus = "PENDING" | "PAID" | "OVERDUE";

export interface RepaymentScheduleItemResponse {
  id: string;
  loanId: string;
  periodNumber: number;
  dueDate: string; // date string
  beginningBalance: number;
  principalAmount: number;
  interestAmount: number;
  feeAmount: number;
  totalAmount: number;
  status: RepaymentItemStatus;
  paidPrincipal: number;
  paidInterest: number;
  paidFee: number;
  paidAt: string | null; // date-time string
}

export interface RepaymentScheduleResponse {
  data: RepaymentScheduleItemResponse[];
}
