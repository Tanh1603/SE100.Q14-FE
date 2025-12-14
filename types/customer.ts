import { CustomerStatus } from "./enum";

// types/customer.ts
export type Customer = {
  id: string;
  avatar: string;
  fullName: string;
  dob: string;
  phone: string;
  email?: string;
  cccd: string;
  issueDate: string;
  issuePlace: string;
  address: string;
  wardId: string;
  provinceId: string;
  permanentAddress: string;

  otherInfo: {
    job: string;
    workplace: string;
    income: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };

  status: CustomerStatus

  familyInfo: {
    father: Person;
    mother: Person;
    spouse?: Person;
  };
};

export type Person = {
  fullName: string;
  phone: string;
  job: string;
};
