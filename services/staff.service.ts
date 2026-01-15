import { PageResonse } from "@/types/result";
import { CreateStaff, Staff } from "@/types/staff";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const staffKeys = {
  all: ["staffs"] as const,
  list: (param: unknown) => [...staffKeys.all, param] as const,
};

export const StaffService = {
  list: async (token: string, query: string): Promise<PageResonse<Staff[]>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees?${query}&limit=2`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data as PageResonse<Staff[]>;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: async (token: string, request: CreateStaff): Promise<Staff> => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      return data as Staff;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  terminate: async (token: string, id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          terminatedDate: new Date().toISOString().split("T")[0],
          status: "INACTIVE",
        }),
      });
      const data = await res.json();
      return data as PageResonse<Staff[]>;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
