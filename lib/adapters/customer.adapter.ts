import { BaseAdapter } from "./base.adapter";
import { CustomerDTO } from "@/types/dto/customer.dto";
import { Customer } from "@/types/customer";
import { CustomerStatus } from "@/types/enum";

export const CustomerAdapter: BaseAdapter<Customer, CustomerDTO> = {
  toDomain(dto: CustomerDTO): Customer {
    return {
      id: dto.id,
      fullName: dto.fullName,
      dob: dto.dob,
      phone: dto.phone,
      email: dto.email,
      cccd: dto.nationalId,
      issueDate: dto.nationalIdIssueDate,
      issuePlace: dto.nationalIdIssuePlace,
      address: dto.address,
      wardId: dto.wardId || "", // Check if API returns this
      provinceId: dto.provinceId || "",
      permanentAddress: dto.permanentAddress || "",
      status: (dto.status as CustomerStatus) || CustomerStatus.NORMAL,
      otherInfo: {
        job: dto.occupation || "",
        workplace: dto.workplace || "",
        income: dto.monthlyIncome?.toString() || "",
        emergencyContactName: dto.emergencyContactName || "",
        emergencyContactPhone: dto.emergencyContactPhone || "",
      },
      familyInfo: {
        father: {
          fullName: dto.fatherName || "",
          phone: dto.fatherPhone || "",
          job: dto.fatherOccupation || "",
        },
        mother: {
          fullName: dto.motherName || "",
          phone: dto.motherPhone || "",
          job: dto.motherOccupation || "",
        },
        spouse: {
          fullName: dto.spouseName || "",
          phone: dto.spousePhone || "",
          job: dto.spouseOccupation || "",
        },
      },
      avatar: "", // Placeholder as API doesn't seem to have it yet
    };
  },

  toDTO(domain: Partial<Customer>): Partial<CustomerDTO> {
    type DomainWithExtras = Partial<Customer> & {
      customerType?: "REGULAR" | "VIP";
    };
    const d = domain as DomainWithExtras;
    return {
      fullName: domain.fullName,
      dob: domain.dob,
      phone: domain.phone,
      email: domain.email,
      nationalId: domain.cccd,
      nationalIdIssueDate: domain.issueDate,
      nationalIdIssuePlace: domain.issuePlace,
      address: domain.permanentAddress || domain.address,
      wardId: domain.wardId,
      provinceId: domain.provinceId,
      permanentAddress: domain.permanentAddress,

      status: domain.status?.toString(),
      customerType: d.customerType || "REGULAR",

      monthlyIncome: Number(domain.otherInfo?.income || 0),
      occupation: domain.otherInfo?.job,
      workplace: domain.otherInfo?.workplace,
      emergencyContactName: domain.otherInfo?.emergencyContactName,
      emergencyContactPhone: domain.otherInfo?.emergencyContactPhone,

      fatherName: domain.familyInfo?.father?.fullName,
      fatherPhone: domain.familyInfo?.father?.phone,
      fatherOccupation: domain.familyInfo?.father?.job,

      motherName: domain.familyInfo?.mother?.fullName,
      motherPhone: domain.familyInfo?.mother?.phone,
      motherOccupation: domain.familyInfo?.mother?.job,

      spouseName: domain.familyInfo?.spouse?.fullName,
      spousePhone: domain.familyInfo?.spouse?.phone,
      spouseOccupation: domain.familyInfo?.spouse?.job,
    };
  },
};
