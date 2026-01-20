import { customerKeys, CustomerService } from "@/services/customer.service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...customerKeys.list(), params],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return CustomerService.list(token, params);
    },
    placeholderData: (previousData) => previousData,
  });
}

export const useCreateCustomer = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthenticated");
      return CustomerService.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.list() });
    },
  });
};

export const useUpdateCustomer = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthenticated");
      return CustomerService.update(id, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.list() });
    },
  });
};
