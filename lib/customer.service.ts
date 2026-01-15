import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CustomerAdapter } from "@/lib/adapters/customer.adapter";
import {
  CustomerDTO,
  PagedCustomerResponseDTO,
} from "@/types/dto/customer.dto";
import { Customer } from "@/types/customer";

export interface CustomerListResponse {
  data: Customer[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export const CustomerService = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<CustomerListResponse> => {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    const response = await apiClient.get<PagedCustomerResponseDTO>(
      ENDPOINTS.CUSTOMERS,
      { params }
    );

    return {
      data: response.data.data.map(CustomerAdapter.toDomain),
      meta: response.data.meta,
    };
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<{ data: CustomerDTO }>(
      ENDPOINTS.CUSTOMER_BY_ID(id)
    );
    return CustomerAdapter.toDomain(response.data.data);
  },

  create: async (data: Partial<Customer> & { mattruoc?: File; matsau?: File }): Promise<Customer> => {
    // If we have images, use FormData
    if (data.mattruoc || data.matsau) {
      const formData = new FormData();
      const payload = CustomerAdapter.toDTO!(data);
      
      // Add all fields from payload to formData
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (data.mattruoc) formData.append("mattruoc", data.mattruoc);
      if (data.matsau) formData.append("matsau", data.matsau);

      const response = await apiClient.post<CustomerDTO>(
        ENDPOINTS.CUSTOMERS,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return CustomerAdapter.toDomain(response.data);
    }

    const payload = CustomerAdapter.toDTO!(data);
    const response = await apiClient.post<CustomerDTO>(
      ENDPOINTS.CUSTOMERS,
      payload
    );
    return CustomerAdapter.toDomain(response.data);
  },

  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const payload = CustomerAdapter.toDTO!(data);
    const response = await apiClient.put<CustomerDTO>(
      ENDPOINTS.CUSTOMER_BY_ID(id),
      payload
    );
    return CustomerAdapter.toDomain(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CUSTOMER_BY_ID(id));
  },
};
