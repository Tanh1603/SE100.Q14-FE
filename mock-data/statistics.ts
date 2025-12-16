// mock-data/statistics.ts
export interface DashboardStatistics {
  todayTransactions: number;
  activeLoanContracts: number;
  collectedContracts: number;
  remainingFunds: number;
}

export interface TransactionSummary {
  date: string;
  totalIn: number;
  totalOut: number;
  netFlow: number;
  transactionCount: number;
}

export interface MonthlyStatistics {
  month: string;
  year: number;
  totalLoansIssued: number;
  totalLoanAmount: number;
  totalPaymentsReceived: number;
  totalPaymentAmount: number;
  totalInterestCollected: number;
  activeContracts: number;
  closedContracts: number;
}

// Current dashboard statistics
export const mockDashboardStats: DashboardStatistics = {
  todayTransactions: 12, // Number of transactions today
  activeLoanContracts: 15, // Currently active pawn contracts
  collectedContracts: 48, // Total collected/completed contracts
  remainingFunds: 450000000, // VND - remaining in fund (450M VND)
};

// Daily transaction summaries for the past 30 days
export const mockDailyTransactions: TransactionSummary[] = [
  {
    date: "2024-12-16",
    totalIn: 45000000,
    totalOut: 25000000,
    netFlow: 20000000,
    transactionCount: 12,
  },
  {
    date: "2024-12-15",
    totalIn: 38000000,
    totalOut: 60000000,
    netFlow: -22000000,
    transactionCount: 15,
  },
  {
    date: "2024-12-14",
    totalIn: 52000000,
    totalOut: 30000000,
    netFlow: 22000000,
    transactionCount: 18,
  },
  {
    date: "2024-12-13",
    totalIn: 41000000,
    totalOut: 45000000,
    netFlow: -4000000,
    transactionCount: 14,
  },
  {
    date: "2024-12-12",
    totalIn: 55000000,
    totalOut: 35000000,
    netFlow: 20000000,
    transactionCount: 20,
  },
  {
    date: "2024-12-11",
    totalIn: 48000000,
    totalOut: 50000000,
    netFlow: -2000000,
    transactionCount: 16,
  },
  {
    date: "2024-12-10",
    totalIn: 62000000,
    totalOut: 40000000,
    netFlow: 22000000,
    transactionCount: 22,
  },
  {
    date: "2024-12-09",
    totalIn: 39000000,
    totalOut: 55000000,
    netFlow: -16000000,
    transactionCount: 13,
  },
  {
    date: "2024-12-08",
    totalIn: 50000000,
    totalOut: 28000000,
    netFlow: 22000000,
    transactionCount: 17,
  },
  {
    date: "2024-12-07",
    totalIn: 44000000,
    totalOut: 42000000,
    netFlow: 2000000,
    transactionCount: 15,
  },
  {
    date: "2024-12-06",
    totalIn: 58000000,
    totalOut: 48000000,
    netFlow: 10000000,
    transactionCount: 19,
  },
  {
    date: "2024-12-05",
    totalIn: 47000000,
    totalOut: 35000000,
    netFlow: 12000000,
    transactionCount: 16,
  },
  {
    date: "2024-12-04",
    totalIn: 51000000,
    totalOut: 52000000,
    netFlow: -1000000,
    transactionCount: 18,
  },
  {
    date: "2024-12-03",
    totalIn: 43000000,
    totalOut: 38000000,
    netFlow: 5000000,
    transactionCount: 14,
  },
  {
    date: "2024-12-02",
    totalIn: 56000000,
    totalOut: 44000000,
    netFlow: 12000000,
    transactionCount: 20,
  },
  {
    date: "2024-12-01",
    totalIn: 49000000,
    totalOut: 50000000,
    netFlow: -1000000,
    transactionCount: 17,
  },
  {
    date: "2024-11-30",
    totalIn: 54000000,
    totalOut: 46000000,
    netFlow: 8000000,
    transactionCount: 19,
  },
  {
    date: "2024-11-29",
    totalIn: 42000000,
    totalOut: 40000000,
    netFlow: 2000000,
    transactionCount: 15,
  },
  {
    date: "2024-11-28",
    totalIn: 60000000,
    totalOut: 55000000,
    netFlow: 5000000,
    transactionCount: 21,
  },
  {
    date: "2024-11-27",
    totalIn: 46000000,
    totalOut: 42000000,
    netFlow: 4000000,
    transactionCount: 16,
  },
];

// Monthly statistics for the past 6 months
export const mockMonthlyStats: MonthlyStatistics[] = [
  {
    month: "December",
    year: 2024,
    totalLoansIssued: 28,
    totalLoanAmount: 875000000,
    totalPaymentsReceived: 142,
    totalPaymentAmount: 685000000,
    totalInterestCollected: 95000000,
    activeContracts: 15,
    closedContracts: 13,
  },
  {
    month: "November",
    year: 2024,
    totalLoansIssued: 35,
    totalLoanAmount: 1050000000,
    totalPaymentsReceived: 168,
    totalPaymentAmount: 820000000,
    totalInterestCollected: 118000000,
    activeContracts: 18,
    closedContracts: 17,
  },
  {
    month: "October",
    year: 2024,
    totalLoansIssued: 32,
    totalLoanAmount: 980000000,
    totalPaymentsReceived: 155,
    totalPaymentAmount: 758000000,
    totalInterestCollected: 108000000,
    activeContracts: 16,
    closedContracts: 16,
  },
  {
    month: "September",
    year: 2024,
    totalLoansIssued: 29,
    totalLoanAmount: 890000000,
    totalPaymentsReceived: 138,
    totalPaymentAmount: 695000000,
    totalInterestCollected: 98000000,
    activeContracts: 14,
    closedContracts: 15,
  },
  {
    month: "August",
    year: 2024,
    totalLoansIssued: 31,
    totalLoanAmount: 945000000,
    totalPaymentsReceived: 148,
    totalPaymentAmount: 738000000,
    totalInterestCollected: 105000000,
    activeContracts: 17,
    closedContracts: 14,
  },
  {
    month: "July",
    year: 2024,
    totalLoansIssued: 27,
    totalLoanAmount: 825000000,
    totalPaymentsReceived: 132,
    totalPaymentAmount: 652000000,
    totalInterestCollected: 92000000,
    activeContracts: 13,
    closedContracts: 14,
  },
];

// Asset category statistics
export interface AssetCategoryStats {
  category: string;
  totalValue: number;
  activeLoans: number;
  averageLoanAmount: number;
}

export const mockAssetCategoryStats: AssetCategoryStats[] = [
  {
    category: "Xe máy",
    totalValue: 625000000, // Total value of motorcycle pledges
    activeLoans: 8,
    averageLoanAmount: 45000000,
  },
  {
    category: "Điện thoại",
    totalValue: 425000000, // Total value of phone/electronics pledges
    activeLoans: 7,
    averageLoanAmount: 18000000,
  },
];

// Interest rate distribution
export interface InterestRateStats {
  rate: number;
  contractCount: number;
  totalAmount: number;
}

export const mockInterestRateStats: InterestRateStats[] = [
  { rate: 1.5, contractCount: 4, totalAmount: 225000000 },
  { rate: 1.6, contractCount: 2, totalAmount: 120000000 },
  { rate: 1.7, contractCount: 2, totalAmount: 90000000 },
  { rate: 1.75, contractCount: 1, totalAmount: 40000000 },
  { rate: 1.8, contractCount: 1, totalAmount: 30000000 },
  { rate: 1.9, contractCount: 1, totalAmount: 35000000 },
  { rate: 2.0, contractCount: 2, totalAmount: 43000000 },
  { rate: 2.1, contractCount: 1, totalAmount: 22000000 },
  { rate: 2.2, contractCount: 1, totalAmount: 25000000 },
  { rate: 2.3, contractCount: 1, totalAmount: 18000000 },
  { rate: 2.5, contractCount: 1, totalAmount: 12000000 },
];

// Customer status distribution
export interface CustomerStatusStats {
  status: "NORMAL" | "DEBT" | "BLOCKED";
  count: number;
  totalOutstanding: number;
}

export const mockCustomerStatusStats: CustomerStatusStats[] = [
  {
    status: "NORMAL",
    count: 12,
    totalOutstanding: 380000000,
  },
  {
    status: "DEBT",
    count: 3,
    totalOutstanding: 95000000,
  },
  {
    status: "BLOCKED",
    count: 0,
    totalOutstanding: 0,
  },
];
