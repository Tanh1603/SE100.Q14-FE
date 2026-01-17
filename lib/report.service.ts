import { apiClient } from "./api/client";
import { ENDPOINTS } from "./api/endpoints";
import {
  DailyLogResponse,
  QuarterlyReportResponse,
  RevenueReportListResponse,
} from "@/types/report";

export const ReportService = {
  getDailyLog: async (
    date: string,
    storeId?: string,
  ): Promise<DailyLogResponse> => {
    const { data } = await apiClient.get<DailyLogResponse>(
      ENDPOINTS.REPORTS.DAILY_LOG,
      {
        params: { date, storeId },
      },
    );
    // Handle potential wrapper
    return (data as any).data || data;
  },

  getQuarterlyReport: async (
    year: number,
    quarter: number,
    storeId?: string,
  ): Promise<QuarterlyReportResponse> => {
    const { data } = await apiClient.get<QuarterlyReportResponse>(
      ENDPOINTS.REPORTS.QUARTERLY,
      {
        params: { year, quarter, storeId }, // storeId added as requested
      },
    );
    // Handle potential wrapper
    return (data as any).data || data;
  },

  getRevenueReport: async (
    startDate: string,
    endDate: string,
    storeId?: string,
  ) => {
    const { data } = await apiClient.get<RevenueReportListResponse>(
      ENDPOINTS.REPORTS.REVENUE,
      {
        params: { startDate, endDate, storeId },
      },
    );
    // Handle potential wrapper. RevenueReportListResponse has a 'data' array property.
    // If wrapped: data.data is an Object (the actual response).
    // If unwrapped: data.data is an Array.
    // Handle potential wrapper. RevenueReportListResponse has a 'data' array property.
    // If wrapped: data.data is an Object (the actual response).
    // If unwrapped: data.data is an Array.
    let responseData = data;
    if ((data as any).data && !Array.isArray((data as any).data)) {
      responseData = (data as any).data;
    }

    // Resilience: Check for alternative list property names if 'data' is missing/empty
    // Backend might return 'items', 'report', or 'entries' instead of 'data'
    if (
      !responseData.data ||
      (!Array.isArray(responseData.data) && (responseData as any).items)
    ) {
      if (Array.isArray((responseData as any).items)) {
        responseData.data = (responseData as any).items;
      } else if (Array.isArray((responseData as any).report)) {
        responseData.data = (responseData as any).report;
      } else if (Array.isArray((responseData as any).entries)) {
        responseData.data = (responseData as any).entries;
      } else if (Array.isArray((responseData as any).detail)) {
        responseData.data = (responseData as any).detail;
      }
    }

    return responseData;
  },
};
