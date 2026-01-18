/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export type AuditLog = {
    id: string;
    actorId: string;
    actorName: string;
    action: string;
    entityId: string;
    entityType: string;
    entityName: string;
    oldValue: Record<string, any>;
    newValue: Record<string, any>;
    description: string;
    createdAt: string;
};

export const AuditLogQuerySchema = z.object({
    actorId: z.string().optional(),
    action: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>;
