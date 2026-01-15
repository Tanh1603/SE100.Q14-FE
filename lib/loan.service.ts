import { LoanAdapterWithContractNumber } from "@/lib/adapters/loan.adapter";
import { PagedLoanResponseDTO } from "@/types/dto/loan.dto";
import { loan } from "@/types/asset";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type LoanListResponse = {
  data: (loan & { contractNumber: string })[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

import { CustomerService } from "@/lib/customer.service";

export const LoanService = {
  getAllLoans: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    storeId?: string,
    customerId?: string
  ): Promise<LoanListResponse> => {
    // Construct query parameters
    const params: any = {
      page,
      limit,
    };
    if (search) params.q = search;
    if (status && status !== "ALL") params.status = status;
    if (storeId && storeId !== "ALL") params.storeId = storeId;
    if (customerId && customerId !== "ALL") params.customerId = customerId;

    const response = await apiClient.get<PagedLoanResponseDTO>(
      ENDPOINTS.LOANS,
      {
        params,
      }
    );

    const dto = response.data;

    // Workaround for missing customer names in API response
    // Fetch customer details for each loan (optimizing for unique IDs)
    const uniqueCustomerIds = Array.from(
      new Set(dto.data.map((l) => l.customerId))
    );

    const customerMap = new Map<string, { name: string; phone: string }>();

    await Promise.all(
      uniqueCustomerIds.map(async (id) => {
        try {
          const customer = await CustomerService.getById(id);
          customerMap.set(id, {
            name: customer.fullName,
            phone: customer.phone,
          });
        } catch (e) {
          console.error(`Failed to fetch customer ${id}`, e);
        }
      })
    );

    // Merge customer info into DTOs
    const enrichedData = dto.data.map((item) => {
      const customerInfo = customerMap.get(item.customerId);
      return {
        ...item,
        customerName: customerInfo?.name,
        customerPhone: customerInfo?.phone,
      };
    });

    return {
      data: enrichedData.map(LoanAdapterWithContractNumber.toDomain),
      meta: {
        totalItems: dto.meta.totalItems,
        totalPages: dto.meta.totalPages,
        currentPage: dto.meta.currentPage,
        itemsPerPage: dto.meta.itemsPerPage,
      },
    };
  },

  getLoanById: async (
    id: string
  ): Promise<import("@/types/dto/loan.dto").LoanDetailDTO> => {
    const response = await apiClient.get<{
      data: import("@/types/dto/loan.dto").LoanDetailDTO;
    }>(`${ENDPOINTS.LOANS}/${id}`);
    return response.data.data;
  },

  getRepaymentSchedule: async (
    loanId: string
  ): Promise<
    import("@/types/dto/repayment.dto").RepaymentScheduleItemResponse[]
  > => {
    const response = await apiClient.get<{
      data: import("@/types/dto/repayment.dto").RepaymentScheduleItemResponse[];
    }>(`${ENDPOINTS.LOANS}/${loanId}/repayment-schedule`);
    return response.data.data;
  },

  simulateLoan: async (data: {
    loanAmount: number;
    totalFeeRate: number;
    loanTypeId: number;
    repaymentMethod: string;
  }): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.LOAN_SIMULATIONS, data);
    return response.data;
  },

  createLoan: async (data: {
    customerId: string;
    loanAmount: number;
    repaymentMethod: string;
    loanTypeId: number;
    collateralIds: string[];
    notes?: string;
  }): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.LOANS, data);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: "ACTIVE" | "REJECTED",
    note?: string
  ): Promise<any> => {
    const response = await apiClient.patch(`${ENDPOINTS.LOANS}/${id}/status`, {
      status,
      note,
    });
    return response.data;
  },

  approveLoan: async (id: string, note?: string) => {
    return LoanService.updateStatus(id, "ACTIVE", note);
  },

  rejectLoan: async (id: string, note?: string) => {
    return LoanService.updateStatus(id, "REJECTED", note);
  },
};
