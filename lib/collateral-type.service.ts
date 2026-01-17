import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  CollateralType,
  CollateralTypeListResponse,
  CreateCollateralTypeDTO,
  UpdateCollateralTypeDTO,
} from "@/types/collateral-type";

export const CollateralTypeService = {
  getAll: async (): Promise<CollateralTypeListResponse> => {
    const response = await apiClient.get<CollateralTypeListResponse>(
      ENDPOINTS.COLLATERAL_TYPES
    );
    // Handle potential wrapper or direct array
    if (Array.isArray(response.data)) {
        return { data: response.data };
    }
    return response.data;
  },

  getById: async (id: number): Promise<CollateralType> => {
    const response = await apiClient.get<CollateralType>(
      `${ENDPOINTS.COLLATERAL_TYPES}/${id}`
    );
    return (response.data as any).data || response.data;
  },

  create: async (data: CreateCollateralTypeDTO): Promise<CollateralType> => {
    const response = await apiClient.post(ENDPOINTS.COLLATERAL_TYPES, data);
    return (response.data as any).data || response.data;
  },

  update: async (
    id: number,
    data: UpdateCollateralTypeDTO
  ): Promise<CollateralType> => {
    const response = await apiClient.patch(
      `${ENDPOINTS.COLLATERAL_TYPES}/${id}`,
      data
    );
    return (response.data as any).data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.COLLATERAL_TYPES}/${id}`);
  },
};
