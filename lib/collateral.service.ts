import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CollateralAssetResponse, CollateralListResponse, CreateLiquidationRequest, UpdateLocationRequest } from "@/types/dto/collateral.dto";
import { LoanService } from "./loan.service";

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
  create: async (data: CreateCollateralDTO, files?: File[]): Promise<CollateralAssetResponse> => {
    const formData = new FormData();
    
    formData.append("collateralTypeId", data.collateralTypeId.toString());
    formData.append("ownerName", data.ownerName);
    formData.append("collateralInfo", JSON.stringify(data.collateralInfo));
    if (data.status) formData.append("status", data.status);
    if (data.loanId) formData.append("loanId", data.loanId);
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

  getAll: async (page = 1, limit = 20, search = ""): Promise<CollateralListResponse> => {
    const response = await apiClient.get<CollateralListResponse>(ENDPOINTS.COLLATERAL_ASSETS, {
      params: { page, limit, search },
    });
    
    const data = response.data.data;

    // Enrichment: Fetch Loan Codes for linked assets
    const uniqueLoanIds = Array.from(new Set(data.map(c => c.loanId).filter(Boolean))) as string[];
    const loanMap = new Map<string, string>();

    await Promise.all(uniqueLoanIds.map(async (id) => {
        try {
             // Reuse the robust getLoanById from LoanService which handles the response wrapper
             const loan = await LoanService.getLoanById(id);
             if (loan && loan.loanCode) {
                 loanMap.set(id, loan.loanCode);
             }
        } catch (e) {
            // console.error(`Failed to fetch loan ${id} for collateral enrichment`, e);
        }
    }));

    // Merge loanCode into response
    const enrichedData = data.map(item => ({
        ...item,
        loanCode: item.loanId ? (loanMap.get(item.loanId) || "Unknown") : undefined
    }));

    return {
        ...response.data,
        data: enrichedData
    };
  },

  getById: async (id: string): Promise<CollateralAssetResponse> => {
      const response = await apiClient.get(`${ENDPOINTS.COLLATERAL_ASSETS}/${id}`);
      return response.data;
  },

  update: async (id: string, data: Partial<CreateCollateralDTO>, files?: File[]): Promise<CollateralAssetResponse> => {
    const formData = new FormData();
    if (data.ownerName) formData.append("ownerName", data.ownerName);
    if (data.collateralInfo) formData.append("collateralInfo", JSON.stringify(data.collateralInfo));
    if (data.status) formData.append("status", data.status);
    if (data.storageLocation) formData.append("storageLocation", data.storageLocation);

    if (files && files.length > 0) {
        files.forEach((file) => formData.append("files", file));
    }

    const response = await apiClient.patch(`${ENDPOINTS.COLLATERAL_ASSETS}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  updateLocation: async (id: string, data: UpdateLocationRequest): Promise<any> => {
      const response = await apiClient.put(`${ENDPOINTS.COLLATERAL_ASSETS.replace('collateral-assets', 'collaterals')}/${id}/location`, data);
      return response.data;
  },

  liquidate: async (data: CreateLiquidationRequest): Promise<any> => {
      const response = await apiClient.post(ENDPOINTS.LIQUIDATIONS || '/liquidations', data);
      return response.data;
  }
};
