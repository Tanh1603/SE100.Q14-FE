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
    province: {
      id: "HN",
      label: "Hà Nội",
    },
    ward: {
      id: "DVH",
      label: "Phường Dịch Vọng Hậu",
    },
    createdAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "branch_hcm_01",
    name: "Cửa hàng cầm đồ TP.HCM - Quận 1",
    address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0909 333 444",
    status: BranchStatus.CLOSE,
    province: {
      id: "HN",
      label: "Hà Nội",
    },
    ward: {
      id: "DVH",
      label: "Phường Dịch Vọng Hậu",
    },
    createdAt: new Date().toISOString().split("T")[0],
  },
];
