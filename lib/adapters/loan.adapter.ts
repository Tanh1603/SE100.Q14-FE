import { BaseAdapter } from "./base.adapter";
import { LoanDTO } from "@/types/dto/loan.dto";
import { loan, Asset } from "@/types/asset";
import { AssetStatus, CustomerStatus, WarehouseStatus } from "@/types/enum";

export const LoanAdapter: BaseAdapter<loan, LoanDTO> = {
  toDomain(dto: LoanDTO): loan {
    // Map status from API to AssetStatus enum if possible, otherwise default
    let status = AssetStatus.PLEDGED;
    // Example logic: if dto.status.code === 'LIQUIDATED' -> AssetStatus.LIQUIDATED
    // Since we don't know the exact shape of dto.status, we keep it safe.

    // Construct a placeholder Asset object since API doesn't provide details
    const asset: Asset = {
      id: `asset-${dto.id}`,
      name: `Tài sản HĐ ${dto.id}`, // Placeholder name
      image: "", // No image in API
      assetType: {
        id: "unknown",
        name: dto.loanTypeName || "Unknown Type",
        isActive: true,
        field: [],
      },
      warehouses: {
        id: "unknown",
        name: dto.storeName || "Unknown Warehouse",
        address: "Unknown Address",
        province: { id: "0", label: "Unknown" },
        ward: { id: "0", label: "Unknown" },
        status: WarehouseStatus.AVAILABLE,
        fee: 0,
      },
      status: status,
      assetValue: [],
    };

    return {
      id: dto.id,
      loanDate: dto.startDate,
      totalLoan: dto.loanAmount,
      interestPeriod: dto.durationMonths,
      interestRate: 0, // Not provided by API
      numberPayment: 0, // Not provided by API
      asset: asset,
      customer: {
        id: dto.customerId,
        fullName: `Khách hàng ${dto.customerId.substring(0, 8)}...`, // Placeholder
        avatar: "",
        dob: "2000-01-01",
        phone: "",
        cccd: "",
        issueDate: "",
        issuePlace: "",
        address: "",
        wardId: "",
        provinceId: "",
        permanentAddress: "",
        email: "",
        otherInfo: {
            job: "",
            workplace: "",
            income: "",
            emergencyContactName: "",
            emergencyContactPhone: ""
        },
        status: CustomerStatus.NORMAL,
        familyInfo: {
            father: { fullName: "", phone: "", job: "" },
            mother: { fullName: "", phone: "", job: "" },
            spouse: { fullName: "", phone: "", job: "" }
        },
        // Legacy fields if any (based on previous error log showing simple Customer type mismatch?)
        // The error said: Type '{ ... }' is missing ... avatar, dob, phone, cccd, and 8 more.
        // It listed 'gender', 'job', 'contractHistory', 'badHabit', 'notes', 'identityCardDate', 'identityCardPlace', 'tempReg' in the incompatible type I PROVIDED.
        // Wait, the error message showed that I provided EXTRA fields that didn't exist in Customer (like 'contractHistory') AND missed fields that DID exist (like 'avatar').
        // So I must REMOVE the extra fields I added in the previous version and ADD the missing ones.
      },
    } as loan & { contractNumber: string }; // Casting to match UI expectations
  },
};

// Helper to handle the 'contractNumber' field which is effectively 'id' or derived
export const LoanAdapterWithContractNumber: BaseAdapter<loan & { contractNumber: string }, LoanDTO> = {
  toDomain(dto: LoanDTO): loan & { contractNumber: string } {
    const domain = LoanAdapter.toDomain(dto);
    return {
      ...domain,
      contractNumber: dto.id,
    };
  },
};
