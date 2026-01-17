import { Branch } from "@/types/branch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const branchKeys = {
  all: ["branchs"] as const,
  list: () => [...branchKeys.all, "provinces"] as const,
};

export const BranchService = {
  list: async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.data as Branch[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
