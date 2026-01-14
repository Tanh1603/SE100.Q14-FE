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

// Payment Method
export enum PaymentMethodEnum {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export const PAYMENT_METHOD_OPTIONS = [
  { label: "Tiền mặt", value: PaymentMethodEnum.CASH },
  { label: "Chuyển khoản", value: PaymentMethodEnum.BANK_TRANSFER },
];

export const PaymentMethodColor: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.CASH]: "bg-green-100 text-green-800",
  [PaymentMethodEnum.BANK_TRANSFER]: "bg-blue-100 text-blue-800",
};

// Payment Flow (direction) - for distinguishing income vs expense
export enum PaymentFlowEnum {
  IN = "IN", // Money coming in (customer payments)
  OUT = "OUT", // Money going out (contract disbursements)
}

export const PAYMENT_FLOW_OPTIONS = [
  { label: "Thu tiền", value: PaymentFlowEnum.IN },
  { label: "Chi tiền", value: PaymentFlowEnum.OUT },
];

export const PaymentFlowColor: Record<PaymentFlowEnum, string> = {
  [PaymentFlowEnum.IN]: "bg-green-100 text-green-800",
  [PaymentFlowEnum.OUT]: "bg-red-100 text-red-800",
};

// Payment Type
export enum PaymentTypeEnum {
  PERIODIC = "PERIODIC",
  EARLY = "EARLY",
  PAYOFF = "PAYOFF",
  LATE_FEE = "LATE_FEE",
  DISBURSEMENT = "DISBURSEMENT",
  LIQUIDATION = "LIQUIDATION",
  OTHER_INCOME = "OTHER_INCOME",
  OTHER_EXPENSE = "OTHER_EXPENSE",
}

export const PAYMENT_TYPE_OPTIONS = [
  { label: "Thanh toán định kỳ", value: PaymentTypeEnum.PERIODIC },
  { label: "Thanh toán sớm", value: PaymentTypeEnum.EARLY },
  { label: "Tất toán", value: PaymentTypeEnum.PAYOFF },
  { label: "Phí trễ hạn", value: PaymentTypeEnum.LATE_FEE },
  { label: "Giải ngân", value: PaymentTypeEnum.DISBURSEMENT },
  { label: "Thanh lý tài sản", value: PaymentTypeEnum.LIQUIDATION },
  { label: "Thu khác", value: PaymentTypeEnum.OTHER_INCOME },
  { label: "Chi khác", value: PaymentTypeEnum.OTHER_EXPENSE },
];

export const PaymentTypeColor: Record<PaymentTypeEnum, string> = {
  [PaymentTypeEnum.PERIODIC]: "bg-blue-100 text-blue-800",
  [PaymentTypeEnum.EARLY]: "bg-purple-100 text-purple-800",
  [PaymentTypeEnum.PAYOFF]: "bg-green-100 text-green-800",
  [PaymentTypeEnum.LATE_FEE]: "bg-red-100 text-red-800",
  [PaymentTypeEnum.DISBURSEMENT]: "bg-orange-100 text-orange-800",
  [PaymentTypeEnum.LIQUIDATION]: "bg-indigo-100 text-indigo-800",
  [PaymentTypeEnum.OTHER_INCOME]: "bg-teal-100 text-teal-800",
  [PaymentTypeEnum.OTHER_EXPENSE]: "bg-gray-100 text-gray-800",
};

// Payment Component (for allocation display)
export enum PaymentComponentEnum {
  PRINCIPAL = "PRINCIPAL",
  INTEREST = "INTEREST",
  LATE_FEE = "LATE_FEE",
  PENALTY = "PENALTY",
  SERVICE_FEE = "SERVICE_FEE",
}

export const PAYMENT_COMPONENT_LABELS: Record<PaymentComponentEnum, string> = {
  [PaymentComponentEnum.PRINCIPAL]: "Gốc",
  [PaymentComponentEnum.INTEREST]: "Lãi",
  [PaymentComponentEnum.LATE_FEE]: "Phí trễ hạn",
  [PaymentComponentEnum.PENALTY]: "Phạt",
  [PaymentComponentEnum.SERVICE_FEE]: "Phí dịch vụ",
};

// Loan
export enum RepaymentMethod {
  EQUAL_INSTALLMENT = "EQUAL_INSTALLMENT",
  INTEREST_ONLY = "INTEREST_ONLY",
}

export enum LoanStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  OVERDUE = "OVERDUE",
}
