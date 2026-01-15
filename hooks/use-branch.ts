import { branchKeys, BranchService } from "@/services/branch.service";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useBranch() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: branchKeys.list(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return BranchService.list(token);
    },
  });
}
