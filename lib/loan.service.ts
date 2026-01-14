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

export const LoanService = {
  getAllLoans: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    storeId?: string
  ): Promise<LoanListResponse> => {
    // Construct query parameters
    const params: any = {
      page,
      limit,
    };
    if (search) params.q = search;
    if (status && status !== "ALL") params.status = status;
    if (storeId && storeId !== "ALL") params.storeId = storeId;

    const response = await apiClient.get<PagedLoanResponseDTO>(
      ENDPOINTS.LOANS,
      {
        params,
      }
    );

    const dto = response.data;

    return {
      data: dto.data.map(LoanAdapterWithContractNumber.toDomain),
      meta: {
        totalItems: dto.meta.totalItems,
        totalPages: dto.meta.totalPages,
        currentPage: dto.meta.currentPage,
        itemsPerPage: dto.meta.itemsPerPage,
      },
    };
  },

  getLoanById: async (id: string): Promise<import("@/types/dto/loan.dto").LoanDetailDTO> => {
    const response = await apiClient.get<import("@/types/dto/loan.dto").LoanDetailDTO>(
      `${ENDPOINTS.LOANS}/${id}`
    );
    return response.data;
  },

  getRepaymentSchedule: async (loanId: string): Promise<import("@/types/dto/repayment.dto").RepaymentScheduleItemResponse[]> => {
    const response = await apiClient.get<{ data: import("@/types/dto/repayment.dto").RepaymentScheduleItemResponse[] }>(
      `${ENDPOINTS.LOANS}/${loanId}/repayment-schedule`
    );
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

  approveLoan: async (id: string, note?: string): Promise<any> => {
    const response = await apiClient.patch(`${ENDPOINTS.LOANS}/${id}/status`, {
      status: "ACTIVE",
      note,
    });
    return response.data;
  },
};
