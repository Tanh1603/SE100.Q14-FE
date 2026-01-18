import { buildQuery, PaginationParams } from "@/lib/page.query";
import { auditLogKeys, AuditLogService } from "@/services/audit-log.service";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type AuditLogParams = PaginationParams & {
    startDate?: string;
    endDate?: string;
};

export function useAuditLog(param: AuditLogParams) {
    const { getToken } = useAuth();
    const query = buildQuery(param);

    return useQuery({
        queryKey: auditLogKeys.list(query),
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                throw new Error("Unauthenticated");
            }
            return AuditLogService.list(token, query);
        },
    });
}
