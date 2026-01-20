import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Staff } from "@/types/staff";

export const StaffService = {
  getEmployees: async (storeId?: string): Promise<Staff[]> => {
    const params = storeId ? { storeId } : {};
    const response = await apiClient.get<any>(ENDPOINTS.EMPLOYEES, { params });
    // Handle both { data: [...] } and [...] formats just in case
    return response.data.data || response.data;
  },
};
