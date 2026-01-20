import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

import {
  LogCommunicationDto,
  NotificationLogResponse,
} from "@/types/dto/communication.dto";

// Type alias for Promise to Pay items - these are NotificationLogResponse records
// with status="PROMISE_TO_PAY" and promiseToPayDate populated
export type PromiseToPayItem = NotificationLogResponse;

export const CommunicationService = {
  log: async (data: LogCommunicationDto): Promise<NotificationLogResponse> => {
    const response = await apiClient.post(ENDPOINTS.COMMUNICATIONS_LOG, data);
    return response.data;
  },

  getPromisesToPay: async (params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<PromiseToPayItem[]> => {
    const response = await apiClient.get<PromiseToPayItem[]>(
      ENDPOINTS.COMMUNICATIONS_PROMISES_TO_PAY,
      { params }
    );
    return response.data;
  },

  getLogsByLoanId: async (
    loanId: string
  ): Promise<NotificationLogResponse[]> => {
    const response = await apiClient.get<NotificationLogResponse[]>(
      ENDPOINTS.COMMUNICATIONS_HISTORY(loanId)
    );
    return response.data;
  },
};

// Re-export for backward compatibility
export type { LogCommunicationDto };
