import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface DisbursementRequestDto {
  loanId: string;
  storeId: string;
  amount: number;
  disbursementMethod: "CASH" | "BANK_TRANSFER";
  recipientName: string;
  recipientIdNumber?: string;
  witnessName?: string;
  bankTransferRef?: string;
  bankAccountNumber?: string;
  bankName?: string;
  notes?: string;
}

export const DisbursementService = {
  create: async (data: DisbursementRequestDto, idempotencyKey: string): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.DISBURSEMENTS, data, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
    return response.data;
  },

  getAll: async (page = 1, limit = 20, search = "", loanId?: string): Promise<any> => {
    const response = await apiClient.get(ENDPOINTS.DISBURSEMENTS, {
      params: { page, limit, search, loanId },
    });
    return response.data;
  },
};
