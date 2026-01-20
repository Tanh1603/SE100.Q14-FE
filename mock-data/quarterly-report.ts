export interface DK13ReportItem {
  id: string;
  category: string; // e.g., "Xe máy", "Điện thoại", "Laptop"
  totalReceived: number;
  totalReceivedValue: number;
  totalRedeemed: number;
  totalRedeemedValue: number;
  totalLiquidated: number;
  totalLiquidatedValue: number;
  currentInventory: number;
  currentInventoryValue: number;
}

export const mockDK13Report: DK13ReportItem[] = [
  {
    id: "1",
    category: "Xe máy (Motorbike)",
    totalReceived: 15,
    totalReceivedValue: 150000000,
    totalRedeemed: 10,
    totalRedeemedValue: 100000000,
    totalLiquidated: 2,
    totalLiquidatedValue: 18000000,
    currentInventory: 3,
    currentInventoryValue: 32000000,
  },
  {
    id: "2",
    category: "Điện thoại (Phone)",
    totalReceived: 42,
    totalReceivedValue: 210000000,
    totalRedeemed: 30,
    totalRedeemedValue: 150000000,
    totalLiquidated: 5,
    totalLiquidatedValue: 20000000,
    currentInventory: 7,
    currentInventoryValue: 40000000,
  },
  {
    id: "3",
    category: "Laptop / Máy tính",
    totalReceived: 12,
    totalReceivedValue: 96000000,
    totalRedeemed: 8,
    totalRedeemedValue: 64000000,
    totalLiquidated: 1,
    totalLiquidatedValue: 5000000,
    currentInventory: 3,
    currentInventoryValue: 27000000,
  },
  {
    id: "4",
    category: "Ô tô (Car)",
    totalReceived: 2,
    totalReceivedValue: 800000000,
    totalRedeemed: 1,
    totalRedeemedValue: 400000000,
    totalLiquidated: 0,
    totalLiquidatedValue: 0,
    currentInventory: 1,
    currentInventoryValue: 400000000,
  },
  {
    id: "5",
    category: "Trang sức / Vàng (Jewelry)",
    totalReceived: 25,
    totalReceivedValue: 125000000,
    totalRedeemed: 20,
    totalRedeemedValue: 100000000,
    totalLiquidated: 0,
    totalLiquidatedValue: 0,
    currentInventory: 5,
    currentInventoryValue: 25000000,
  },
];
