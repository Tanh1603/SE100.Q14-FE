import { Gender, Role } from "@/types/enum";
import { Staff } from "@/types/staff";

// mock/staff.ts
export const mockStaffs: Staff[] = [
  {
    id: "user_36TVS4yaVemSzHFlKszytfwqlLj",
    branch: {
      id: "branch_hn_01",
      name: "Cửa hàng cầm đồ Hà Nội - Cầu Giấy",
      address: "123 Trần Duy Hưng",
      phone: "0909 111 222",
      wardId: "1",
      provinceId: "4",
      status: "active",
    },
    fullName: "manager1",
    email: "manager@gm.com",
    role: Role.MANAGER,
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
      wardId: "1",
      provinceId: "4",
      status: "active",
    },
    fullName: "staff1",
    email: "staff@gm.com",
    role: Role.MANAGER,
    gender: Gender.FEMALE,
    dob: "16/03/2005",
    cccd: "123456789",
    phone: "123456789",
    startDate: "01/01/2025",
    endDate: null,
  },
];
