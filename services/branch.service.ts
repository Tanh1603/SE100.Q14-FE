/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchStatus } from "@/types/enum";
import { Branch } from "@/types/branch";
import { PageResonse } from "@/types/result";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const branchKeys = {
  all: ["branchs"] as const,
  list: (param: unknown) => [...branchKeys.all, param] as const,
};

export const BranchService = {
  list: async (
    token: string,
    query: string,
  ): Promise<PageResonse<Branch[]>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores?${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return {
        ...data,
        data: data.data.map(
          (item: any): Branch => ({
            id: item.id,
            name: item.name,
            address: item.address,
            phone: item.storeInfo?.phone,
            isActive: item.isActive,
            status: item.isActive ? BranchStatus.ACTIVE : BranchStatus.CLOSE,
            wardId: item.wardId,
            wardName: item.wardName,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            createdAt: item.createdAt,
          }),
        ),
      } as PageResonse<Branch[]>;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: async (token: string, branch: unknown): Promise<Branch> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branch),
      });
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.storeInfo?.phone,
        isActive: data.isActive,
        status: data.isActive ? BranchStatus.ACTIVE : BranchStatus.CLOSE,
        wardId: data.wardId,
        wardName: data.wardName,
        provinceId: data.provinceId,
        provinceName: data.provinceName,
        createdAt: data.createdAt,
      } as Branch;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  update: async (
    token: string,
    id: string,
    branch: unknown,
  ): Promise<Branch> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branch),
      });
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.storeInfo?.phone,
        isActive: data.isActive,
        status: data.isActive ? BranchStatus.ACTIVE : BranchStatus.CLOSE,
        wardId: data.wardId,
        wardName: data.wardName,
        provinceId: data.provinceId,
        provinceName: data.provinceName,
        createdAt: data.createdAt,
      } as Branch;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
