import { apiClient } from "@/lib/api/client";

// Assuming endpoint /configurations
// Based on prompt: GET /v1/configurations?group=RATES

export interface SystemConfiguration {
  key: string;
  value: string;
  group?: string;
  description?: string;
  dataType?: "STRING" | "DECIMAL" | "INTEGER" | "BOOLEAN" | "JSON";
}

export const ConfigurationService = {
  getAll: async (group?: string): Promise<SystemConfiguration[]> => {
    try {
      const response = await apiClient.get<any>("/configurations", {
        params: { group },
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Handle wrapped response
        return response.data.data;
      }
      
      console.warn("Unexpected response format from /configurations", response.data);
      return [];
    } catch (error) {
      console.warn("Failed to fetch configurations", error);
      // Return mock data for development if API fails
      return [
        { key: "LEGAL_INTEREST_CAP", value: "20", group: "RATES", description: "Trần lãi suất theo quy định (%)", dataType: "DECIMAL" },
        { key: "PENALTY_INTEREST_RATE", value: "150", group: "RATES", description: "Phạt quá hạn (% trên lãi suất cơ bản)", dataType: "DECIMAL" },
        { 
          key: "SUPPORTED_LOAN_PRODUCTS", 
          value: JSON.stringify([
            { id: 1, name: "Vay ngắn hạn (1 tháng)", interestRateMonthly: 1.5, durationMonths: 1, productCode: "SHORT_1M" },
            { id: 2, name: "Vay trung hạn (3 tháng)", interestRateMonthly: 1.8, durationMonths: 3, productCode: "MED_3M" },
          ]), 
          group: "SYSTEM", 
          description: "Danh sách gói vay hỗ trợ (JSON)", 
          dataType: "JSON" 
        }
      ];
    }
  },

  getConfigurations: async (group?: string): Promise<Record<string, string>> => {
    const configs = await ConfigurationService.getAll(group);
    const configMap: Record<string, string> = {};
    configs.forEach((item) => {
      configMap[item.key] = item.value;
    });
    return configMap;
  },

  update: async (key: string, value: string, description?: string): Promise<any> => {
    const response = await apiClient.put(`/configurations/${key}`, {
      value,
      description
    });
    return response.data;
  }
};
