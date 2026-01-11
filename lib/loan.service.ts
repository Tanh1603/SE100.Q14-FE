import { LoanAdapterWithContractNumber } from "@/lib/adapters/loan.adapter";
import { PagedLoanResponseDTO } from "@/types/dto/loan.dto";
import { loan } from "@/types/asset";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// Generic API fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export type LoanListResponse = {
  data: (loan & { contractNumber: string })[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export const LoanService = {
  getAllLoans: async (
    page: number = 1,
    limit: number = 20
  ): Promise<LoanListResponse> => {
    // Construct query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiFetch<PagedLoanResponseDTO>(
      `/loans?${queryParams.toString()}`
    );

    return {
      data: response.data.map(LoanAdapterWithContractNumber.toDomain),
      meta: {
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        currentPage: response.meta.currentPage,
        itemsPerPage: response.meta.itemsPerPage,
      },
    };
  },
};
