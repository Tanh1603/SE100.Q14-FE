"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset } from "@/components/ui/sidebar";
import { Archive, PlusCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { CollateralService } from "@/lib/collateral.service";
import { CollateralAssetResponse } from "@/types/dto/collateral.dto";
import { DataTable } from "@/components/data-table";
import { AssetColumns } from "./columns";
import { AssetActionPanel } from "./asset-action-panel";
import { useUser } from "@clerk/nextjs";
import { Role } from "@/types/constant";

const AssetPage = () => {
  const [assets, setAssets] = useState<CollateralAssetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CollateralAssetResponse | null>(null);
  const [panelMode, setPanelMode] = useState<"create" | "view" | "location" | "liquidate" | "sell">("view");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { user } = useUser();
  const role = (user?.publicMetadata?.role as Role) || "staff";
  const isAdminOrManager = ["admin", "manager"].includes(role);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await CollateralService.getAll(page, limit, searchTerm);
      setAssets(response.data);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]); // Refetch on page change

  const handleAction = (action: string, asset: CollateralAssetResponse) => {
      setSelectedAsset(asset);
      setPanelMode(action as any);
      setPanelOpen(true);
  };

  const handleCreate = () => {
      setSelectedAsset(null);
      setPanelMode("create");
      setPanelOpen(true);
  };
  
  const handleSearch = () => {
      setPage(1);
      fetchData();
  };

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Archive className="text-primary mr-5" />
            <p className="text-2xl text-primary font-bold">Danh sách tài sản</p>
          </div>
          <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm tài sản
          </Button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 space-y-4">
            <div className="flex gap-4 items-end w-full">
                <div className="space-y-2 flex-1">
                    <Label>Tìm kiếm tài sản</Label>
                    <div className="relative flex gap-2 w-full">
                        <Input
                        placeholder="Nhập tên tài sản, mô tả, hoặc tên chủ sở hữu để tìm kiếm..."
                        className="flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} className="px-8">
                            <Search className="h-4 w-4 mr-2" />
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <DataTable 
                        columns={AssetColumns(handleAction, isAdminOrManager)} 
                        data={assets} 
                        onRowClick={(asset) => handleAction("view", asset)}
                    />
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between p-4 border-t">
                        <p className="text-sm text-gray-500">
                            Trang {page} / {totalPages || 1} ({totalItems} kết quả)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>

      <AssetActionPanel 
        open={panelOpen} 
        onOpenChange={setPanelOpen} 
        asset={selectedAsset} 
        mode={panelMode} 
        onSuccess={fetchData} 
        isAdminOrManager={isAdminOrManager}
      />
    </SidebarInset>
  );
};

export default AssetPage;