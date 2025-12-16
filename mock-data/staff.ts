import { BranchStatus, Gender } from "@/types/enum";
import { ROLE } from "@/types/constant";
import { Staff } from "@/types/staff";

// mock/staff.ts
export const mockStaffs: Staff[] = [
  {
    id: "user_36tGqcXsWnZDwGrLLBq6oGe0cgk",
    branch: {
      id: "branch_hn_01",
      name: "Cửa hàng cầm đồ Hà Nội - Cầu Giấy",
      address: "123 Trần Duy Hưng",
      phone: "0909 111 222",
      ward: { id: "1", label: "Phường Dịch Vọng Hậu" },
      province: { id: "4", label: "Hà Nội" },
      status: BranchStatus.ACTIVE,
      createdAt: "2024-01-01",
    },
    fullName: "manager1",
    email: "manager1+clerk_test@gm.com",
    role: ROLE.MANAGER,
    gender: Gender.MALE,
    dob: "16/03/2005",
    cccd: "123456789",
    phone: "123456789",
    startDate: "01/01/2025",
    endDate: null,
  },
  {
    id: "user_36TVOtMMWhPJP2x4oKOWMKgC5qO",
    branch: {
      id: "branch_hn_01",
      name: "Cửa hàng cầm đồ Hà Nội - Cầu Giấy",
      address: "123 Trần Duy Hưng",
      phone: "0909 111 222",
      ward: { id: "1", label: "Phường Dịch Vọng Hậu" },
      province: { id: "4", label: "Hà Nội" },
      status: BranchStatus.ACTIVE,
      createdAt: "2024-01-01",
    },
    fullName: "staff1",
    email: "staff@gm.com",
    role: ROLE.MANAGER,
    gender: Gender.FEMALE,
    dob: "16/03/2005",
    cccd: "123456789",
    phone: "123456789",
    startDate: "01/01/2025",
    endDate: null,
  },
];
