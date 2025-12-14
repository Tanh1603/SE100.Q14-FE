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
