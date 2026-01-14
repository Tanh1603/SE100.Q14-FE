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
      try {
        setLoading(true);
        const response = await StoreService.getStores({ limit: 100 });
        setStores(response.data);

        // If user is a Manager/Staff, force their store
        if (["manager", "staff"].includes(userRole) && userStoreId) {
            // Check if their store is in the list, if not (pagination?), fetch it specifically or just set it
            onChange(userStoreId);
        }
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    // If Admin/Owner, fetch all. If Manager, maybe we still fetch all but lock it? 
    // Or just fetch their own?
    // User requirement: "MANAGER can only view their branch"
    if (["admin", "store_owner"].includes(userRole)) {
      fetchStores();
    } else if (userStoreId) {
       // Just set the single store for manager
       // ideally we fetch the store details to show the name
       StoreService.getStoreById(userStoreId).then((store) => {
           setStores([store]);
           onChange(store.id);
       });
    }
  }, [userRole, userStoreId, onChange]);

  const canSelect = ["admin", "store_owner"].includes(userRole);

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
