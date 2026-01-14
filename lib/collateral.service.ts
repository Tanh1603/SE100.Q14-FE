import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateCollateralDTO {
  collateralTypeId: number;
  ownerName: string;
  collateralInfo: Record<string, any>;
  status?: string;
  loanId?: string;
  storageLocation?: string;
  receivedDate?: string;
}

export const CollateralService = {
  create: async (data: CreateCollateralDTO, files?: File[]): Promise<any> => {
    const formData = new FormData();
    
    // Add main data as JSON string or individual fields depending on backend preference
    // Usually for multipart, it's either individual fields or a blob
    formData.append("collateralTypeId", data.collateralTypeId.toString());
    formData.append("ownerName", data.ownerName);
    formData.append("collateralInfo", JSON.stringify(data.collateralInfo));
    if (data.status) formData.append("status", data.status);
    if (data.storageLocation) formData.append("storageLocation", data.storageLocation);
    if (data.receivedDate) formData.append("receivedDate", data.receivedDate);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.post(ENDPOINTS.COLLATERAL_ASSETS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAll: async (page = 1, limit = 20, search = ""): Promise<any> => {
    const response = await apiClient.get(ENDPOINTS.COLLATERAL_ASSETS, {
      params: { page, limit, search },
    });
    return response.data;
  },
};
