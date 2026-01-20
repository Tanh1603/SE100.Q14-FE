import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface RepaymentScheduleItemResponse {
  id: string;
  loanId: string;
  periodNumber: number;
  dueDate: string;
  beginningBalance: number;
  principalAmount: number;
  interestAmount: number;
  feeAmount: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "OVERDUE";
  paidPrincipal: number;
  paidInterest: number;
  paidFee: number;
  paidAt?: string;
  // Augmented for UI convenience if backend includes joins, otherwise we might need to fetch loan details separately
  customerName?: string;
  contractCode?: string;
  daysOverdue?: number;
}

// New response type based on corrected API
export interface OverdueLoanResponse {
  loanId: string;
  loanCode: string;
  loanStatus: string;
  customer: {
    fullName: string;
    phone: string;
    nationalId: string;
  };
  totalOverdueAmount: number;
  overduePeriodsCount: number;
  earliestOverdueDate: string;
  daysOverdue: number;
  overdueItems: {
    id: string;
    loanId: string;
    periodNumber: number;
    dueDate: string;
    beginningBalance: number;
    principalAmount: number;
    interestAmount: number;
    feeAmount: number;
    totalAmount: number;
    status: string;
    paidPrincipal: number;
    paidInterest: number;
    paidFee: number;
    paidAt: string | null;
  }[];
}

export const RepaymentScheduleService = {
  getOverdue: async (params: {
    minDaysOverdue?: number;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: OverdueLoanResponse[]; meta: any }> => {
    // Using the corrected endpoint
    const response = await apiClient.get(
      ENDPOINTS.REPAYMENT_SCHEDULES_OVERDUE,
      {
        params,
      },
    );

    return response.data;
  },
};
