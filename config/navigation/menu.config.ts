import { Role } from "@/types/constant";
import {
  Archive,
  BarChart3,
  FileSignature,
  LayoutDashboard,
  LineChart,
  Store,
  UserCog,
  Users,
  Wallet,
  Warehouse,
  FileWarning,
  ClipboardCheck,
  Settings,
} from "lucide-react";

export type MenuIcon =
  | "home"
  | "contracts"
  | "contracts-overdue"
  | "loan-approval"
  | "customers"
  | "assets"
  | "cashbook"
  | "reports"
  | "staff"
  | "branch"
  | "warehouse"
  | "settings";

export interface MenuItem {
  title: string;
  href: string;
  icon: MenuIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  roles: Role[];
}

export function getMenuByRole(role: Role): MenuItem[] {
  return menuConfig.filter((item) => item.roles.includes(role));
}

export const iconMap = {
  home: LayoutDashboard,
  contracts: FileSignature,
  "contracts-overdue": FileWarning,
  "loan-approval": ClipboardCheck,
  customers: Users,
  assets: Archive,
  cashbook: Wallet,
  statistics: BarChart3,
  reports: LineChart,
  staff: UserCog,
  branch: Store,
  warehouse: Warehouse,
  settings: Settings,
};

export const menuConfig: MenuItem[] = [
  // Dashboard
  {
    title: "Trang chủ",
    href: "/home",
    icon: "home",
    roles: ["admin", "manager"],
    isActive: true,
  },

  // Contracts
  {
    title: "Hợp đồng",
    href: "/contracts",
    icon: "contracts",
    roles: ["admin", "manager", "staff"],
  },

  {
    title: "Duyệt vay",
    href: "/loans/management",
    icon: "loan-approval",
    roles: ["admin", "manager"],
  },

  {
    title: "Hợp đồng quá hạn",
    href: "/contracts/overdue",
    icon: "contracts-overdue",
    roles: ["admin", "manager"],
  },

  // Customers
  {
    title: "Khách hàng",
    href: "/customers",
    icon: "customers",
    roles: ["admin", "manager", "staff"],
  },

  // Assets
  {
    title: "Tài sản cầm cố",
    href: "/assets",
    icon: "assets",
    roles: ["admin", "manager"],
  },

  // Cashbook
  {
    title: "Thu - Chi",
    href: "/cashbooks",
    icon: "cashbook",
    roles: ["admin", "manager"],
  },

  // Reports
  {
    title: "Báo cáo",
    href: "/reports",
    icon: "reports",
    roles: ["admin", "manager"],
  },

  // Staff Management
  {
    title: "Quản lý nhân viên",
    href: "/staffs",
    icon: "staff",
    roles: ["admin", "manager"],
  },

  //
  {
    title: "Quản lý kho",
    href: "/warehouses",
    icon: "warehouse",
    roles: ["admin"],
  },

  //
  {
    title: "Quản lý chi nhánh",
    href: "/branches",
    icon: "branch",
    roles: ["admin"],
  },

  // Settings
  {
    title: "Cài đặt hệ thống",
    href: "/settings/system",
    icon: "settings",
    roles: ["admin"],
  },
];
