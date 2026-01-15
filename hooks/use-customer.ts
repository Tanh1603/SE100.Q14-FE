import { customerKeys, CustomerService } from "@/services/customer.service";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useCustomers() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: customerKeys.list(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return CustomerService.list(token);
    },
  });
}

// export function useCustomer(id: string) {
//   // const { getToken } = useAuth();
//   // const token = use(getToken()) as string;
//   return useQuery({
//     queryKey: customerKeys.detail(id),
//     queryFn: async() => CustomerService.getById(id, token),
//     enabled: !!id,
//   });
// }
