import { BaseAdapter } from "./base.adapter";
import { LoanDTO, LoanSummaryResponseDto } from "@/types/dto/loan.dto";
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
      },
    } as loan & { contractNumber: string }; 
  },
};

export const LoanSummaryAdapter: BaseAdapter<loan & { contractNumber: string; status: string }, LoanSummaryResponseDto> = {
    toDomain(dto: LoanSummaryResponseDto): loan & { contractNumber: string; status: string } {
        // Map status
        // API Status: PENDING, REJECTED, ACTIVE, CLOSED, OVERDUE
        
        let assetStatus = AssetStatus.PLEDGED;
        if (dto.status === 'CLOSED') assetStatus = AssetStatus.LIQUIDATED; // Approximation
        
        const asset: Asset = {
            id: `asset-${dto.id}`,
            name: dto.loanTypeName || "Tài sản",
            image: "",
            assetType: {
                id: "type-1",
                name: dto.loanTypeName || "Loại tài sản",
                isActive: true,
                field: []
            },
            warehouses: {
                id: "wh-1",
                name: dto.storeName || "Kho",
                address: "",
                province: { id: "0", label: "" },
                ward: { id: "0", label: "" },
                status: WarehouseStatus.AVAILABLE,
                fee: 0
            },
            status: assetStatus,
            assetValue: []
        };

        return {
            id: dto.id,
            loanDate: dto.startDate,
            totalLoan: dto.loanAmount,
            interestPeriod: dto.durationMonths,
            interestRate: 0, 
            numberPayment: 0,
            asset: asset,
            customer: {
                id: dto.customerId,
                fullName: dto.customerName || `KH: ${dto.customerId.slice(0,6)}...`, // Use API name or fallback
                avatar: "",
                dob: "2000-01-01",
                phone: dto.customerPhone || "",
                cccd: "",
                issueDate: "",
                issuePlace: "",
                address: "",
                wardId: "",
                provinceId: "",
                permanentAddress: "",
                email: "",
                otherInfo: { job: "", workplace: "", income: "", emergencyContactName: "", emergencyContactPhone: "" },
                status: CustomerStatus.NORMAL,
                familyInfo: { father: { fullName: "", phone: "", job: "" }, mother: { fullName: "", phone: "", job: "" }, spouse: { fullName: "", phone: "", job: "" } }
            },
            contractNumber: dto.loanCode || dto.id,
            status: dto.status // Keep original status string for UI badges
        };
    }
}

// Helper to handle the 'contractNumber' field which is effectively 'id' or derived
export const LoanAdapterWithContractNumber: BaseAdapter<loan & { contractNumber: string }, any> = {
  toDomain(dto: any): loan & { contractNumber: string } {
      if (dto.loanCode) {
          return LoanSummaryAdapter.toDomain(dto);
      }
    const domain = LoanAdapter.toDomain(dto);
    return {
      ...domain,
      contractNumber: dto.id,
    };
  },
};
