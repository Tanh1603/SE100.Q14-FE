import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface LoanType {
  id: number;
  name: string;
  interestRateMonthly: number;
  durationMonths: number;
  description?: string;
  productCode?: string;
}

export const LoanTypeService = {
  getAll: async (): Promise<LoanType[]> => {
    try {
      const response = await apiClient.get<{ data: LoanType[] }>(
        ENDPOINTS.LOAN_TYPES
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch loan types:", error);
      return [];
    }
  },

  getById: async (id: number): Promise<LoanType | undefined> => {
    // If there is a dedicated endpoint for getById, use it.
    // OpenAPI shows /loan-types/{id} supports PATCH but doesn't explicitly list GET (Wait, need to check).
    // Assuming we can just filter from getAll or fetch if needed.
    // Looking at openapi, GET /loan-types lists all.
    // For now, implementing via getAll to be safe or fetch if exists.
    // Actually, let's just use getAll and find.
    const types = await LoanTypeService.getAll();
    return types.find((t) => t.id === id);
  },
};
