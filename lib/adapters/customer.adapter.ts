import { BaseAdapter } from "./base.adapter";
import { CustomerDTO } from "@/types/dto/customer.dto";
import { Customer } from "@/types/customer";
import { CustomerStatus } from "@/types/enum";

export const CustomerAdapter: BaseAdapter<Customer, CustomerDTO> = {
  toDomain(dto: CustomerDTO): Customer {
    return {
      id: dto.id,
      fullName: dto.full_name,
      dob: dto.date_of_birth,
      phone: dto.phone_number,
      email: dto.email,
      cccd: dto.identity_number,
      issueDate: dto.issue_date,
      issuePlace: dto.issue_place,
      address: dto.address,
      wardId: dto.ward_id,
      provinceId: dto.province_id,
      permanentAddress: dto.permanent_address,
      status: (dto.status as CustomerStatus) || CustomerStatus.NORMAL,
      otherInfo: dto.other_info
        ? {
            job: dto.other_info.job,
            workplace: dto.other_info.workplace,
            income: dto.other_info.income,
            emergencyContactName: dto.other_info.emergency_contact_name,
            emergencyContactPhone: dto.other_info.emergency_contact_phone,
          }
        : {
            job: "",
            workplace: "",
            income: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
          },
      familyInfo: {
        father: dto.family_info?.father
          ? {
              fullName: dto.family_info.father.full_name,
              phone: dto.family_info.father.phone,
              job: dto.family_info.father.job,
            }
          : { fullName: "", phone: "", job: "" },
        mother: dto.family_info?.mother
          ? {
              fullName: dto.family_info.mother.full_name,
              phone: dto.family_info.mother.phone,
              job: dto.family_info.mother.job,
            }
          : { fullName: "", phone: "", job: "" },
        spouse: dto.family_info?.spouse
          ? {
              fullName: dto.family_info.spouse.full_name,
              phone: dto.family_info.spouse.phone,
              job: dto.family_info.spouse.job,
            }
          : undefined,
      },
      avatar: "", // Placeholder as API doesn't seem to have it yet
    };
  },

  toDTO(domain: Partial<Customer>): Partial<CustomerDTO> {
    return {
      full_name: domain.fullName,
      date_of_birth: domain.dob,
      phone_number: domain.phone,
      email: domain.email,
      identity_number: domain.cccd,
      issue_date: domain.issueDate,
      issue_place: domain.issuePlace,
      address: domain.address,
      ward_id: domain.wardId,
      province_id: domain.provinceId,
      permanent_address: domain.permanentAddress,
      status: domain.status,
      other_info: domain.otherInfo
        ? {
            job: domain.otherInfo.job,
            workplace: domain.otherInfo.workplace,
            income: domain.otherInfo.income,
            emergency_contact_name: domain.otherInfo.emergencyContactName,
            emergency_contact_phone: domain.otherInfo.emergencyContactPhone,
          }
        : undefined,
      family_info: domain.familyInfo
        ? {
            father: domain.familyInfo.father
              ? {
                  full_name: domain.familyInfo.father.fullName,
                  phone: domain.familyInfo.father.phone,
                  job: domain.familyInfo.father.job,
                }
              : undefined,
            mother: domain.familyInfo.mother
              ? {
                  full_name: domain.familyInfo.mother.fullName,
                  phone: domain.familyInfo.mother.phone,
                  job: domain.familyInfo.mother.job,
                }
              : undefined,
            spouse: domain.familyInfo.spouse
              ? {
                  full_name: domain.familyInfo.spouse.fullName,
                  phone: domain.familyInfo.spouse.phone,
                  job: domain.familyInfo.spouse.job,
                }
              : undefined,
          }
        : undefined,
    };
  },
};
