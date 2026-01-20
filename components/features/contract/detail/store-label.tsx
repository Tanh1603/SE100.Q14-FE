"use client";

import { useEffect, useState } from "react";
import { StoreService } from "@/lib/store.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Store } from "@/types/store";

interface StoreLabelProps {
  storeId: string;
}

export function StoreLabel({ storeId }: StoreLabelProps) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchStore() {
      if (!storeId) {
        setLoading(false);
        return;
      }

      try {
        const data = await StoreService.getStoreById(storeId);
        if (mounted) {
          setStore(data); // Assuming data is the Store object
        }
      } catch (error) {
        console.error("Failed to fetch store:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchStore();

    return () => {
      mounted = false;
    };
  }, [storeId]);

  if (loading) {
    return <Skeleton className="h-4 w-24 inline-block align-middle" />;
  }

  if (!store) {
    // Fallback to displaying ID if store not found or error
    return <span className="text-foreground">{storeId}</span>;
  }

  return <span className="font-medium text-foreground">{store.name}</span>;
}
