// mock-data/index.ts
// Central export file for all mock data

// Assets
export { mockAssets, mockAssetType, mockLoans } from "./asset";

// Branches
export { mockBranches } from "./branches";

// Contracts (Pawn Contracts)
export { mockPawnContracts } from "./contracts";

// Customers
export { mockCustomer } from "./customer";

// Locations
export { mockLocations } from "./location";

// Payments
export { mockPayments, mockLoans as mockLoanSummaries } from "./payment";

// Staff
export { mockStaff } from "./staff";

// Statistics
export {
  mockDashboardStats,
  mockDailyTransactions,
  mockMonthlyStats,
  mockAssetCategoryStats,
  mockInterestRateStats,
  mockCustomerStatusStats,
} from "./statistics";

// Warehouses
export { mockwarehouses } from "./warehouse";
