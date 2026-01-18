/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from "@/types/location";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const locationKeys = {
  all: ["locations"] as const,
  provinces: () => [...locationKeys.all, "provinces"] as const,
  wardsByProvince: (code: string) =>
    [...locationKeys.all, "provinces", code] as const,
};

export const LocationService = {
  getProvinces: async (token: string): Promise<Location[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/provinces`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) return data as Location[];
      if (data && Array.isArray((data as any).data)) return (data as any).data as Location[];
      return [];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getWardsByProvince: async (
    code: string,
    token: string
  ): Promise<Location[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/provinces/${code}/wards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) return data as Location[];
      if (data && Array.isArray((data as any).data)) return (data as any).data as Location[];
      return [];
    } catch (error) {
      throw error;
    }
  },
};
