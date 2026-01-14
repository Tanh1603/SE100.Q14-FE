import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

import {
  LogCommunicationDto,
  NotificationLogResponse,
} from "@/types/dto/communication.dto";

export interface LogCommunicationDto {
  loanId: string;
  type: "INTEREST_REMINDER" | "OVERDUE_REMINDER";
  channel: "PHONE_CALL" | "SMS";
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "ANSWERED" | "NO_ANSWER" | "PROMISE_TO_PAY";
  notes?: string;
  promiseToPayDate?: string; // YYYY-MM-DD
  subject?: string;
}

export const CommunicationService = {
  log: async (data: LogCommunicationDto): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.COMMUNICATIONS_LOG, data);
    return response.data;
  },

  getPromisesToPay: async (params?: { fromDate?: string; toDate?: string }): Promise<any[]> => {
    const response = await apiClient.get("/communications/promises-to-pay", { params });
    return response.data;
  },
};
