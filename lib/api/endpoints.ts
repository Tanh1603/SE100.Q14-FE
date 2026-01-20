export const ENDPOINTS = {
  // Loans / Contracts
  LOANS: "/loans",
  LOAN_BY_ID: (id: string) => `/loans/${id}`,
  LOAN_SIMULATIONS: "/loan-simulations",
  LOAN_TYPES: "/loan-types",

  // Payments
  PAYMENTS: "/payments",
  PAYMENT_BY_ID: (id: string) => `/payments/${id}`,
  DISBURSEMENTS: "/disbursements",

  // Customers
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,

  // Assets
  ASSETS: "/assets",
  ASSET_TYPES: "/asset-types",
  COLLATERAL_TYPES: "/collateral-types",
  COLLATERAL_ASSETS: "/collateral-assets",
  ASSET_EVALUATIONS: "/asset-evaluations",
  LIQUIDATIONS: "/liquidations",
  REPAYMENT_SCHEDULES: "/repayment-schedules",
  REPAYMENT_SCHEDULES_OVERDUE: "/loans/overdue",
  COMMUNICATIONS_LOG: "/communications/log",
  COMMUNICATIONS_PROMISES_TO_PAY: "/communications/promises-to-pay",
  COMMUNICATIONS_HISTORY: (loanId: string) =>
    `/communications/loans/${loanId}/history`,

  // Stores
  STORES: "/stores",
  STORE_BY_ID: (id: string) => `/stores/${id}`,

  // Employees
  EMPLOYEES: "/employees",

  // Reports
  REPORTS: {
    DAILY_LOG: "/reports/daily-log",
    REVENUE: "/reports/revenue",
    QUARTERLY: "/reports/quarterly",
  },
} as const;
