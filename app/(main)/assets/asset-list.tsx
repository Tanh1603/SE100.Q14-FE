import { Button } from "@/components/ui/button";
import { Asset } from "@/types/asset";
import Image from "next/image";
import { ASSET_STATUS_OPTIONS, AssetStatusColor } from "@/types/enum"; // object màu trạng thái
import React from "react";
import { ShieldAlert } from "lucide-react";

type Props = {
  data: Asset[];
  onSelect: (asset: Asset) => void;
};

const AssetCardList = ({ onSelect, data }: Props) => {
  return (
    <div className="pt-2 bg-transparent">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {data.map((asset) => (
          <React.Fragment key={asset.id}>
            <div className="bg-transparent rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden">
              {/* Image + Status */}
              <div className="relative w-full h-40">
                <Image
                  src={asset.image}
                  alt={asset.name}
                  fill
                  className="object-cover w-full h-full"
                />
                {/* Status badge */}
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                    AssetStatusColor[asset.status]
                  }`}
                >
                  {
                    ASSET_STATUS_OPTIONS.find(
                      (option) => option.value === asset.status
                    )?.label
                  }
                </span>

                {/* Suspicious Report Button */}
                <button
                  className="absolute top-3 left-3 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-500 hover:text-red-600 transition-colors shadow-sm"
                  title="Báo cáo nghi vấn (Công an)"
                  onClick={(e) => {
                    e.stopPropagation();
                    const reason = window.prompt(
                      "Nhập lý do nghi vấn (VD: Số khung bị đục, Tài sản trộm cắp):"
                    );
                    if (reason) {
                      alert(
                        `Đã báo cáo tài sản "${asset.name}" là nghi vấn!\nLý do: ${reason}\n(Mock Data Updated)`
                      );
                    }
                  }}
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {asset.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {asset.assetType.name}
                  </p>
                </div>

                <div className="mt-2 text-sm font-medium text-gray-600">
                  Kho: {asset.warehouses.name}
                </div>

                <Button
                  className="mt-2 w-full bg-primary text-white rounded-lg shadow-md hover:bg-primary/80 transition"
                  onClick={() => onSelect(asset)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AssetCardList;
