import { apiClient, ApiResponse } from "@/lib/api/client";

export interface Province {
  id: string;
  code: string;
  name: string;
}

export interface Ward {
  id: string;
  code: string;
  name: string;
  parentId: string;
}

export const LocationService = {
  getProvinces: async (search?: string): Promise<Province[]> => {
    const response = await apiClient.get<ApiResponse<Province[]>>(
      "/provinces",
      {
        params: { search },
      }
    );
    return response.data.data || [];
  },

  getWardsByProvince: async (
    provinceCode: string,
    search?: string
  ): Promise<Ward[]> => {
    const response = await apiClient.get<ApiResponse<Ward[]>>(
      `/provinces/${provinceCode}/wards`,
      {
        params: { search },
      }
    );
    return response.data.data || [];
  },
};
