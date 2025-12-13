// mock-data/customer.ts
import { Customer } from "@/types/customer";

export const mockCustomer: Customer[] = [
  {
    id: "1",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    fullName: "Nguyễn Văn A",
    dob: "1995-08-20",
    phone: "0912345678",
    email: "vana@gmail.com",
    cccd: "012345678901",
    issueDate: "2015-06-10",
    issuePlace: "Cục CSQLHC",
    address: "123",
    provinceId: "1",
    wardId: "4",
    permanentAddress: "Hà Nội",

    otherInfo: {
      job: "Lập trình viên",
      workplace: "Công ty ABC",
      income: "20000000",
      emergencyContactName: "Nguyễn Văn B",
      emergencyContactPhone: "0987654321",
    },

    familyInfo: {
      father: {
        fullName: "Nguyễn Văn C",
        phone: "0901111111",
        job: "Nông dân",
      },
      mother: {
        fullName: "Trần Thị D",
        phone: "0902222222",
        job: "Nội trợ",
      },
      spouse: {
        fullName: "Nguyễn Thị E",
        phone: "0903333333",
        job: "Kế toán",
      },
    },
  },
  {
    id: "2",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    fullName: "Nguyễn Văn A",
    dob: "1995-08-20",
    phone: "0912345678",
    email: "vana@gmail.com",
    cccd: "012345678901",
    issueDate: "2015-06-10",
    issuePlace: "Cục CSQLHC",
    address: "123",
    provinceId: "1",
    wardId: "4",
    permanentAddress: "Hà Nội",

    otherInfo: {
      job: "Lập trình viên",
      workplace: "Công ty ABC",
      income: "20000000",
      emergencyContactName: "Nguyễn Văn B",
      emergencyContactPhone: "0987654321",
    },

    familyInfo: {
      father: {
        fullName: "Nguyễn Văn C",
        phone: "0901111111",
        job: "Nông dân",
      },
      mother: {
        fullName: "Trần Thị D",
        phone: "0902222222",
        job: "Nội trợ",
      },
      spouse: {
        fullName: "Nguyễn Thị E",
        phone: "0903333333",
        job: "Kế toán",
      },
    },
  },
];
