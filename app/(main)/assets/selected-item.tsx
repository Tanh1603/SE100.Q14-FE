import { Asset } from "@/types/asset";
import { ASSET_STATUS_OPTIONS, AssetStatusColor } from "@/types/enum";
import Image from "next/image";

type Props = {
  item: Asset;
};

const SelectedAssetItem = ({ item }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Tên & hình */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3 h-48 rounded-xl overflow-hidden shadow-md">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p className="text-gray-600">
            <strong>Loại tài sản:</strong> {item.assetType.name}
          </p>
          <p className="text-gray-600">
            <strong>Kho:</strong> {item.warehouses.name}
          </p>
          <p className="text-gray-600">
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${AssetStatusColor[item.status]}`}
            >
              {
                ASSET_STATUS_OPTIONS.find(
                  (option) => option.value === item.status
                )?.label
              }
            </span>
          </p>
        </div>
      </div>

      {/* Thuộc tính */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Thuộc tính tài sản</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {item.assetValue.map((val) => {
            const field = item.assetType.field.find(
              (f) => f.id === val.assetTypeField
            );
            return (
              <div
                key={val.id}
                className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
              >
                <p className="text-gray-500 text-sm">{field?.label}</p>
                <p className="font-medium">{val.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectedAssetItem;
