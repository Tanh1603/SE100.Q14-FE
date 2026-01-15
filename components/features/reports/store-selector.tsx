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

  // Get user role and assigned store from metadata (assuming Clerk structure)
  // Adjust 'storeId' key based on your actual Clerk metadata setup
  const userRole = (user?.publicMetadata?.role as Role) || "staff";
  const userStoreId = user?.publicMetadata?.storeId as string | undefined;

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        if (["admin", "store_owner"].includes(userRole)) {
          // Admin/Owner: Fetch all stores
          const response = await StoreService.getStores({ limit: 100 });
          setStores(response.data);
        } else if (userStoreId) {
          // Manager/Staff with assigned Store ID: Fetch that specific store
          const store = await StoreService.getStoreById(userStoreId);
          // Verify we got a valid store object (API might return error or empty)
          if (store && store.id) {
            setStores([store]);
            onChange(store.id);
          } else {
             // Fallback if ID is invalid: try fetching all? Or just empty.
             console.warn("Assigned store not found");
          }
        } else {
          // Fallback: User has no role or no store ID (e.g. Dev/Test environment)
          // Attempt to fetch all stores so the UI isn't broken
          console.log("No store ID found for user, fetching all stores as fallback");
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
  }, [userRole, userStoreId]); // Removed onChange to avoid loops if onChange changes identity

  // Allow selection if Admin/Owner OR if we somehow fetched multiple stores (fallback case)
  const canSelect = ["admin", "store_owner"].includes(userRole) || stores.length > 1;

  if (!canSelect && stores.length === 1) {
      // Render a read-only view or disabled select
      return (
          <div className={`text-sm font-medium border px-3 py-2 rounded-md bg-gray-50 text-gray-500 ${className}`}>
              {stores[0].name}
          </div>
      )
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={!canSelect || loading}>
      <SelectTrigger className={className || "w-[200px]"}>
        <SelectValue placeholder="Chọn cơ sở..." />
      </SelectTrigger>
      <SelectContent>
        {/* Only Admins can see "All Stores" option if the API supports null storeId for aggregation */}
         {/* <SelectItem value="all">Tất cả cơ sở</SelectItem> */}
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
