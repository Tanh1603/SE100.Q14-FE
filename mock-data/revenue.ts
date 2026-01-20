export interface RevenueEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: "INTEREST" | "FEE" | "LIQUIDATION" | "OTHER";
  description: string;
  amount: number;
  customerName?: string;
  contractId?: string;
}

export interface RevenueStats {
  totalRevenue: number;
  totalProfit: number;
  totalExpenses: number;
  outstandingInterest: number;
  monthlyGrowth: number; // Percentage
}

export const mockRevenueStats: RevenueStats = {
  totalRevenue: 450000000,
  totalProfit: 320000000,
  totalExpenses: 130000000,
  outstandingInterest: 85000000,
  monthlyGrowth: 12.5,
};

export const mockRevenueEntries: RevenueEntry[] = [
  {
    id: "REV001",
    date: "2026-01-08",
    type: "INTEREST",
    description: "Thu tiền lãi tháng 1 - Honda Vision",
    amount: 1500000,
    customerName: "Nguyen Van A",
    contractId: "HD001",
  },
  {
    id: "REV002",
    date: "2026-01-08",
    type: "FEE",
    description: "Phí hồ sơ & kho bãi",
    amount: 500000,
    customerName: "Tran Thi B",
    contractId: "HD002",
  },
  {
    id: "REV003",
    date: "2026-01-07",
    type: "LIQUIDATION",
    description: "Thanh lý iPhone 13 Pro Max",
    amount: 18500000,
    customerName: "Le Van C (Defaulted)",
    contractId: "HD-LIQ-003",
  },
  {
    id: "REV004",
    date: "2026-01-07",
    type: "INTEREST",
    description: "Thu tiền lãi - Laptop Dell",
    amount: 800000,
    customerName: "Pham Thi D",
    contractId: "HD004",
  },
  {
    id: "REV005",
    date: "2026-01-06",
    type: "OTHER",
    description: "Phạt quá hạn (5 ngày)",
    amount: 250000,
    customerName: "Nguyen Van A",
    contractId: "HD001",
  },
];
