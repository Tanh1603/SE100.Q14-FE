"use client";

import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockAssets } from "@/mock-data/asset";
import { Asset } from "@/types/asset";
import { FileSignature, Search } from "lucide-react";
import { useState } from "react";
import AssetCardList from "./asset-list";
import SelectedAssetItem from "./selected-item";

const AssetPage = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <SidebarInset className="bg-red">
      <div className="mx-2">
        <div className="flex my-5 items-center">
          <FileSignature className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách tài sản</p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Nhập họ tên khách, sdt" />
            </div>
          </div>

          <Button>
            <Search />
            Tìm kiếm
          </Button>
        </div>

        {/* Table */}
        <ScrollArea className="h-[75vh] overflow-auto bg-transparent">
          <AssetCardList
            data={mockAssets}
            onSelect={(asset) => setSelectedAsset(asset)}
          />
        </ScrollArea>
      </div>

      {selectedAsset && (
        <AppDialog
          title="Thông tin tài sản"
          open={!!selectedAsset}
          onOpenChange={() => setSelectedAsset(null)}
        >
          <SelectedAssetItem item={selectedAsset} />
        </AppDialog>
      )}
    </SidebarInset>
  );
};

export default AssetPage;
