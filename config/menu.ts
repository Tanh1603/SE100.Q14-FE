import { Role } from "@/types/constant";
import {
  LayoutDashboard,
  FileSignature,
  Users,
  Archive,
  Wallet,
  BarChart3,
  LineChart,
  UserCog,
  Settings,
} from "lucide-react";

export type MenuIcon =
  | "home"
  | "contracts"
  | "customers"
  | "assets"
  | "cashbook"
  | "reports"
  | "staff"
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
  customers: Users,
  assets: Archive,
  cashbook: Wallet,
  statistics: BarChart3,
  reports: LineChart,
  staff: UserCog,
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
    roles: ["admin"],
  },

  // Settings
  {
    title: "Cài đặt hệ thống",
    href: "/settings",
    icon: "settings",
    roles: ["admin"],
  },
];
