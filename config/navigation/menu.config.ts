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
  Tags,
  Banknote,
} from "lucide-react";

export type MenuIcon =
  | "home"
  | "contracts"
  | "contracts-overdue"
  | "loan-approval"
  | "loan-active"
  | "customers"
  | "assets"
  | "cashbook"
  | "reports"
  | "staff"
  | "branch"
  | "warehouse"
  | "settings"
  | "collateral-type";

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
  "loan-active": Banknote,
  customers: Users,
  assets: Archive,
  cashbook: Wallet,
  statistics: BarChart3,
  reports: LineChart,
  staff: UserCog,
  branch: Store,
  warehouse: Warehouse,
  settings: Settings,
  "collateral-type": Tags,
};

export const menuConfig: MenuItem[] = [
  // Dashboard
  {
    title: "Trang chủ",
    href: "/home",
    icon: "home",
    roles: [Role.ADMIN, Role.MANAGER],
    isActive: true,
  },

  // Contracts
  {
    title: "Hợp đồng",
    href: "/contracts",
    icon: "contracts",
    roles: [Role.ADMIN, Role.MANAGER, Role.STAFF],
  },

  {
    title: "Duyệt vay",
    href: "/loans/management",
    icon: "loan-approval",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  {
    title: "Thu lãi",
    href: "/loans/active",
    icon: "loan-active",
    roles: [Role.ADMIN, Role.MANAGER, Role.STAFF],
  },

  {
    title: "Hợp đồng quá hạn",
    href: "/contracts/overdue",
    icon: "contracts-overdue",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  // Customers
  {
    title: "Khách hàng",
    href: "/customers",
    icon: "customers",
    roles: [Role.ADMIN, Role.MANAGER, Role.STAFF],
  },
  // ... rest of the file ...

  // Assets
  {
    title: "Tài sản cầm cố",
    href: "/assets",
    icon: "assets",
    roles: [Role.ADMIN, Role.MANAGER, Role.STAFF],
  },

  // Cashbook
  {
    title: "Thu - Chi",
    href: "/cashbooks",
    icon: "cashbook",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  // Reports
  {
    title: "Báo cáo",
    href: "/reports",
    icon: "reports",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  // Staff Management
  {
    title: "Quản lý nhân viên",
    href: "/staffs",
    icon: "staff",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  //
  // {
  //   title: "Quản lý kho",
  //   href: "/warehouses",
  //   icon: "warehouse",
  //   roles: [Role.ADMIN],
  // },

  //
  {
    title: "Quản lý chi nhánh",
    href: "/branches",
    icon: "branch",
    roles: [Role.ADMIN],
  },

  // Collateral Types
  {
    title: "Loại tài sản",
    href: "/settings/collateral-types",
    icon: "collateral-type",
    roles: [Role.ADMIN, Role.MANAGER],
  },

  // Settings
  {
    title: "Cài đặt hệ thống",
    href: "/settings/system",
    icon: "settings",
    roles: [Role.ADMIN],
  },
];
