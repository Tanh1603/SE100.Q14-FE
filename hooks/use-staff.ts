import { buildQuery, PaginationParams } from "@/lib/page.query";
import { staffKeys, StaffService } from "@/services/staff.service";
import { PageResonse } from "@/types/result";
import { CreateStaff, Staff } from "@/types/staff";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseStaffParams = PaginationParams & {
  q?: string;
  storeId?: string;
};

export function useStaff(param: UseStaffParams) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId;
  const updatedParam = storeId ? { ...param, storeId } : param;

  const query = buildQuery(updatedParam);
  return useQuery({
    queryKey: staffKeys.list(updatedParam),
    queryFn: async (): Promise<PageResonse<Staff[]>> => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return StaffService.list(token, query);
    },
  });
}

export function useCreateStaff() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateStaff) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return StaffService.create(token, request);
    },
    onSuccess: () => {
      console.log("Thêm thành công");

      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}

export function useTerminateStaff() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return StaffService.terminate(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}
