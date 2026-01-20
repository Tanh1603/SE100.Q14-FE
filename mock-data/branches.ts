import { Branch } from "@/types/branch";
import { BranchStatus } from "@/types/enum";

// mock/branches.ts
export const mockBranches: Branch[] = [
  {
    id: "branch_hn_01",
    name: "Cửa hàng cầm đồ Hà Nội - Cầu Giấy",
    address: "123 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    phone: "0909 111 222",
    status: BranchStatus.ACTIVE,
    isActive: true,
    provinceId: "HN",
    provinceName: "Hà Nội",
    wardId: "DVH",
    wardName: "Phường Dịch Vọng Hậu",
    createdAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "branch_hcm_01",
    name: "Cửa hàng cầm đồ TP.HCM - Quận 1",
    address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0909 333 444",
    status: BranchStatus.CLOSE,
    isActive: false,
    provinceId: "HCM",
    provinceName: "TP.HCM",
    wardId: "Q1",
    wardName: "Quận 1",
    createdAt: new Date().toISOString().split("T")[0],
  },
];
