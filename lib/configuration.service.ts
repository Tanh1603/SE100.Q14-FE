import { apiClient } from "@/lib/api/client";

// Assuming endpoint /configurations
// Based on prompt: GET /v1/configurations?group=RATES

export interface SystemConfiguration {
  key: string;
  value: string;
  group?: string;
  description?: string;
}

export const ConfigurationService = {
  getConfigurations: async (group?: string): Promise<Record<string, string>> => {
    // Mock implementation if endpoint doesn't exist yet, but structure implies it should
    // We'll try to call it, but wrap in try-catch to return defaults if 404
    try {
      const response = await apiClient.get<SystemConfiguration[]>("/configurations", {
        params: { group },
      });
      
      // Convert array to map for easier access
      const configMap: Record<string, string> = {};
      response.data.forEach((item) => {
        configMap[item.key] = item.value;
      });
      return configMap;
    } catch (error) {
      console.warn("Failed to fetch configurations, using defaults.", error);
      return {
        "LEGAL_INTEREST_CAP": "20", // 20% per year
        "PENALTY_INTEREST_RATE": "150", // 150% of base rate
      };
    }
  },
};
