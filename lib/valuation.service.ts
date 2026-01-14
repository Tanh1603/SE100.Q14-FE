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
  evaluate: async (description: string, imageFile?: File): Promise<ValuationResponse> => {
    // If we have an image file, we might need to upload it first or send it as multipart.
    // However, usually for "Gemini" based evaluation, sending text description is the primary input, 
    // and image is secondary. 
    // Given the previous patterns, I'll use FormData to be safe if an image is involved, 
    // or just JSON if only description.
    
    // Let's assume we send JSON for simplicity as Gemini text-only is faster/cheaper, 
    // unless the user specified image analysis. "Gemini structured response" often implies multimodal.
    // Let's try FormData to support image.

    const formData = new FormData();
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await apiClient.post<ValuationResponse>(
      ENDPOINTS.ASSET_EVALUATIONS,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
