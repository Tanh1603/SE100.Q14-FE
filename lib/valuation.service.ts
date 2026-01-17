import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface ValuationRequest {
  description: string;
  images?: string[]; // URLs or base64? Usually URLs if sent as JSON, or we might need FormData if sending files directly.
  // Assuming the endpoint accepts JSON with description and maybe image URLs or base64 strings if not using multipart.
  // If the user says "Trigger evaluation on collateral addition", we usually have the files.
  // Let's assume we send a description constructed from the fields.
}

export interface ValuationResponse {
  minPrice: number;
  maxPrice: number;
  marketValue: number; // median or suggested value
  currency: string;
  reasoning: string;
}

export const ValuationService = {
  evaluate: async (data: any): Promise<ValuationResponse> => {
    // The backend expects a JSON object based on the openapi.yml
    // {
    //   "collateralTypeId": number,
    //   "brand": "string",
    //   "model": "string",
    //   "year": number,
    //   "condition": "string",
    //   "mileage": number
    // }

    const response = await apiClient.post<ValuationResponse>(
      ENDPOINTS.ASSET_EVALUATIONS,
      data
    );
    return response.data;
  },
};
