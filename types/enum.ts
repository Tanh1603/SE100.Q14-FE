// customer
export enum CustomerStatus {
  NORMAL = "NORMAL",
  DEBT = "DEBT",
}

export const CUSTOMER_STATUS_OPTIONS = [
  { label: "Bình thường", value: CustomerStatus.NORMAL },
  { label: "Nợ xấu", value: CustomerStatus.DEBT },
];

// genger
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export const GENDER_OPTIONS = [
  { label: "Nam", value: Gender.MALE },
  { label: "Nữ", value: Gender.FEMALE },
];

// branch
export enum BranchStatus {
  ACTIVE = "ACTIVE",
  CLOSE = "CLOSE",
}

export const BRANCH_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: BranchStatus.ACTIVE },
  { label: "Đóng cửa", value: BranchStatus.CLOSE },
];

// role
export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
}

export const ROLE_OPTIONS = [
  { label: "Quản lí", value: Role.MANAGER },
  { label: "Nhân viên", value: Role.STAFF },
];

// Warehouse
export enum WarehouseStatus {
  AVAILABLE = "AVAILABLE", // còn chỗ
  FULL = "FULL", // hết chỗ
}

export const WAREHOUSE_OPTIONS = [
  { label: "Còn chỗ", value: WarehouseStatus.AVAILABLE },
  { label: "Hết chỗ", value: WarehouseStatus.FULL },
];

// contracts

// assets
export enum AssetStatus {
  PLEDGED = "PLEDGED ",
  DEBT = "DEBT",
  OVERDUE = "OVERDUE",
  REDEEMED = "REDEEMED",
  SOLD = "SOLD",
  STORED = "STORED",
}

export const ASSET_STATUS_OPTIONS = [
  { label: "Đang cầm", value: AssetStatus.PLEDGED },
  { label: "Đã chuộc", value: AssetStatus.REDEEMED },
  { label: "Quá hạn", value: AssetStatus.OVERDUE },
  { label: "Đã bán", value: AssetStatus.SOLD },
  { label: "Đã lưu kho", value: AssetStatus.STORED },
];

export const AssetStatusColor: Record<AssetStatus, string> = {
  [AssetStatus.PLEDGED]: "bg-blue-100 text-blue-800", // đang cầm
  [AssetStatus.DEBT]: "bg-yellow-100 text-yellow-800", // còn nợ
  [AssetStatus.OVERDUE]: "bg-red-100 text-red-800", // quá hạn
  [AssetStatus.REDEEMED]: "bg-green-100 text-green-800", // đã chuộc
  [AssetStatus.SOLD]: "bg-gray-100 text-gray-800", // đã bán
  [AssetStatus.STORED]: "bg-purple-100 text-purple-800", // lưu kho
};

// AssetTypeField
export enum AssetTypeFieldEnum {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
}
