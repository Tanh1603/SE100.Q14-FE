import { PagedCustomerResponseDTO } from "@/types/dto/customer.dto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const customerKeys = {
  all: ["customers"] as const,
  list: () => [...customerKeys.all, "list"] as const,
  detail: (id: string) => [...customerKeys.all, "detail", id] as const,
};

export const CustomerService = {
  list: async (
    token: string,
    params?: { page?: number; limit?: number; search?: string },
  ): Promise<PagedCustomerResponseDTO> => {
    try {
      const url = new URL(`${API_BASE_URL}/customers`);
      if (params?.page) url.searchParams.append("page", params.page.toString());
      if (params?.limit)
        url.searchParams.append("limit", params.limit.toString());
      if (params?.search) url.searchParams.append("search", params.search);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.statusText}`);
      }

      const data = await res.json();
      return data as PagedCustomerResponseDTO;
    } catch (error) {
      console.log("Error fetching customers:", error);
      throw error;
    }
  },

  create: async (data: FormData, token: string): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // No Content-Type header needed for FormData; browser sets it with boundary
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create customer");
      }

      return await res.json();
    } catch (error) {
      console.log("Error creating customer:", error);
      throw error;
    }
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("no", data);
    return data;
  },

  //   create: async (data: CreateCustomerDto) => {
  //     const customer = await fetch(`${API_BASE_URL}/customers`);
  //     return res.data;
  //   },

  //   update: async (id: string, data: Partial<CreateCustomerDto>) => {
  //     const customer = await fetch(`${API_BASE_URL}/customers`);
  //     return res.data;
  //   },
};
