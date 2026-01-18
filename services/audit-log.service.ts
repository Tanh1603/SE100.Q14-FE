/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditLog } from "@/types/audit-log";
import { PageResonse } from "@/types/result";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  list: (param: unknown) => [...auditLogKeys.all, param] as const,
};

export const AuditLogService = {
  list: async (token: string, query: string): Promise<PageResonse<AuditLog[]>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/audit-logs?${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return {
        ...data,
        data: data.data.map((item: any): AuditLog => ({
          id: item.id,
          actorId: item.actorId,
          actorName: item.actorName,
          action: item.action,
          entityId: item.entityId,
          entityType: item.entityType,
          entityName: item.entityName,
          oldValue: item.oldValue || {},
          newValue: item.newValue || {},
          description: item.description,
          createdAt: item.createdAt,
        })),
      } as PageResonse<AuditLog[]>;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
