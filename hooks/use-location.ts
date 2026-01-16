import { locationKeys, LocationService } from "@/services/location.service";
import { Location } from "@/types/location";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useProvinces() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: locationKeys.provinces(),
    queryFn: async (): Promise<Location[]> => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return LocationService.getProvinces(token);
    },
  });
}

export function useWardByProvince(code: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: locationKeys.wardsByProvince(code),
    queryFn: async (): Promise<Location[]> => {
      const token = (await getToken()) as string;
      if (!code) {
        return [];
      }
      if (!token) {
        throw new Error("Unauthenticated");
      }
      return LocationService.getWardsByProvince(code, token);
    },
    enabled: !!code,
  });
}
