import { apiClient } from "./api/client";
import { ENDPOINTS } from "./api/endpoints";
import { StoreListResponse } from "@/types/store";

export const StoreService = {
  getStores: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const { data } = await apiClient.get<StoreListResponse>(ENDPOINTS.STORES, {
      params,
    });
    return data;
  },

  getStoreById: async (id: string) => {
    const { data } = await apiClient.get(ENDPOINTS.STORE_BY_ID(id));
    return data;
  },
};
