import { buildQuery, PaginationParams } from "@/lib/page.query";
import { branchKeys, BranchService } from "@/services/branch.service";
import { CreateBranch, UpdateBranch } from "@/types/branch";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type BranchParams = PaginationParams & {
  search?: string;
  isActive?: boolean;
};

export function useBranch(param: BranchParams) {
  const { getToken } = useAuth();
  const query = buildQuery(param);

  return useQuery({
    queryKey: branchKeys.list(query),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return BranchService.list(token, query);
    },
  });
}

export function useCreateBranch() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateBranch) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }

      return BranchService.create(token, {
        name: request.name,
        address: request.address,
        wardId: request.wardId,
        storeInfo: {
          phone: request.phone
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: branchKeys.all,
      })
    }
  });
}

export function useUpdateBranch() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBranch) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }

      return BranchService.update(token, data.id, {
        name: data.name,
        address: data.address,
        wardId: data.wardId,
        storeInfo: {
          phone: data.phone
        },
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: branchKeys.all,
      })
    }
  });
}