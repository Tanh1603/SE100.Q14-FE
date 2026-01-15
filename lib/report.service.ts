import { apiClient } from "./api/client";
import { ENDPOINTS } from "./api/endpoints";
import {
  DailyLogResponse,
  QuarterlyReportResponse,
  RevenueReportListResponse,
} from "@/types/report";

export const ReportService = {
  getDailyLog: async (date: string, storeId?: string) => {
    const { data } = await apiClient.get<DailyLogResponse>(
      ENDPOINTS.REPORTS.DAILY_LOG,
      {
        params: { date, storeId },
      }
    );
    // Handle potential wrapper
    return (data as any).data || data;
  },

  getQuarterlyReport: async (year: number, quarter: number, storeId?: string) => {
    const { data } = await apiClient.get<QuarterlyReportResponse>(
      ENDPOINTS.REPORTS.QUARTERLY,
      {
        params: { year, quarter, storeId }, // storeId added as requested
      }
    );
    // Handle potential wrapper
    return (data as any).data || data;
  },

  getRevenueReport: async (
    startDate: string,
    endDate: string,
    storeId?: string
  ) => {
    const { data } = await apiClient.get<RevenueReportListResponse>(
      ENDPOINTS.REPORTS.REVENUE,
      {
        params: { startDate, endDate, storeId },
      }
    );
    // Handle potential wrapper. RevenueReportListResponse has a 'data' array property.
    // If wrapped: data.data is an Object (the actual response).
    // If unwrapped: data.data is an Array.
    if ((data as any).data && !Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return data;
  },
};
