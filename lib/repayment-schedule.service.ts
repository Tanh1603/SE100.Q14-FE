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

export const RepaymentScheduleService = {
  getOverdue: async (params: { minDaysOverdue?: number; page?: number; limit?: number; search?: string }): Promise<{ data: RepaymentScheduleItemResponse[], meta: any }> => {
    const response = await apiClient.get(ENDPOINTS.REPAYMENT_SCHEDULES_OVERDUE, { params });
    return response.data;
  },
};
