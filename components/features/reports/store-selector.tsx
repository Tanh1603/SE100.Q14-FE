"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreService } from "@/lib/store.service";
import { Store } from "@/types/store";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";
import { getUserRole } from "@/lib/role.helper";

interface StoreSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const StoreSelector = ({
  value,
  onChange,
  className,
}: StoreSelectorProps) => {
  const { user } = useUser();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  // Get user role safely
  const userRole = getUserRole(user?.publicMetadata);
  const userStoreId = user?.publicMetadata?.storeId as string | undefined;

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        if (userRole === Role.ADMIN) {
          // Admin: Fetch all stores
          const response = await StoreService.getStores({ limit: 100 });
          setStores(response.data);

          // If no value selected yet, maybe select __all__?
          // Or let parent decide.
        } else if (userStoreId) {
          // Manager/Staff with assigned Store ID
          const store = await StoreService.getStoreById(userStoreId);
          if (store && store.id) {
            setStores([store]);
            // Force selection if not already set or invalid
            if (value !== store.id) {
              onChange(store.id);
            }
          } else {
            console.warn("Assigned store not found");
          }
        } else {
          // Fallback: User has no role or no store ID (e.g. Dev/Test environment)
          // Attempt to fetch all stores so the UI isn't broken
          console.log(
            "No store ID found for user, fetching all stores as fallback",
          );
          const response = await StoreService.getStores({ limit: 100 });
          setStores(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [userRole, userStoreId]); // Removed onChange to avoid loops

  // Allow selection if Admin OR if we somehow fetched multiple stores (fallback case)
  const canSelect = userRole === Role.ADMIN || stores.length > 1;

  if (!canSelect && stores.length === 1) {
    // Render a read-only view or disabled select
    return (
      <div
        className={`text-sm font-medium border px-3 py-2 rounded-md bg-gray-50 text-gray-500 ${className}`}
      >
        {stores[0].name}
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={!canSelect || loading}
    >
      <SelectTrigger className={className || "w-[200px]"}>
        <SelectValue placeholder="Chọn cơ sở..." />
      </SelectTrigger>
      <SelectContent>
        {/* "All Stores" option for Admins to view aggregated reports */}
        {userRole === Role.ADMIN && (
          <SelectItem value="__all__">Tất cả cơ sở (Tổng hợp)</SelectItem>
        )}
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
