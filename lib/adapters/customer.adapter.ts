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
     // Note: This toDTO might need to be adjusted if we are sending data BACK to API
     // But for now we are fixing the READ path.
     // For safety, I'll update it to match new structure somewhat, but focus is on toDomain.
    return {
      fullName: domain.fullName,
      dob: domain.dob,
      phone: domain.phone,
      email: domain.email,
      nationalId: domain.cccd,
      nationalIdIssueDate: domain.issueDate,
      nationalIdIssuePlace: domain.issuePlace,
      address: domain.address,
      // ... mapping other fields back if needed for Create/Update
    };
  },
};
