export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// --- Revenue Report ---
export interface RevenueBreakdown {
  interest: number;
  serviceFee: number;
  lateFee: number;
  liquidationExcess: number;
}

export interface ExpenseBreakdown {
  loanDisbursement: number;
}

export interface RevenueReportResponse {
  date: string;
  totalRevenue: number;
  breakdown: RevenueBreakdown;
  totalExpense: number;
  expenseBreakdown: ExpenseBreakdown;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalInterest: number;
  totalServiceFee: number;
  totalLateFee: number;
  totalLiquidationExcess: number;
  totalExpense: number;
  totalLoanDisbursement: number;
}

export interface RevenueReportListResponse {
  data: RevenueReportResponse[];
  summary: RevenueSummary;
}

// --- Daily Log (Police Book) ---
export interface DailyLogEntry {
  contractId: string;
  customerName: string;
  nationalId: string;
  address: string;
  phone: string;
  collateralDescription: string;
  loanAmount: number;
  loanDate: string;
  closedDate?: string;
  status: string;
}

export interface EnrichedDailyLogEntry extends DailyLogEntry {
  loanCode?: string;
  interestRate?: number;
  duration?: number; // months
}

export interface DailyLogSummary {
  totalNewLoans: number;
  totalClosedLoans: number;
  totalNewLoanAmount: number;
}

export interface DailyLogResponse {
  date: string;
  newLoans: DailyLogEntry[];
  closedLoans: DailyLogEntry[];
  summary: DailyLogSummary;
}

// --- Quarterly Report (DK13) ---
export interface QuarterlyStatistics {
  totalLoansIssued: number;
  totalLoanAmount: number;
  totalLoansClosed: number;
  totalLoansActive: number;
  totalLoansOverdue: number;
  totalCollateralsReceived: number;
  totalCollateralsReleased: number;
  totalLiquidations: number;
  totalRevenue: number;
  revenueBreakdown: {
    interest: number;
    serviceFee: number;
    lateFee: number;
    liquidationProfit: number;
  };
}

export interface QuarterlyCompliance {
  averageLTV: number;
  averageInterestRate: number;
  kycCompletionRate: number;
}

export interface QuarterlyReportResponse {
  quarter: number;
  year: number;
  period: string;
  statistics: QuarterlyStatistics;
  compliance: QuarterlyCompliance;
}

// Mock Types for DK13 Table (Frontend specific usually, but good to have)
export interface DK13Row {
  id: string;
  category: string;
  totalReceived: number;
  totalReceivedValue: number;
  totalRedeemed: number;
  totalRedeemedValue: number;
  totalLiquidated: number;
  totalLiquidatedValue: number;
  currentInventory: number;
  currentInventoryValue: number;
}
