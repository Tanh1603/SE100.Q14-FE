"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  ShoppingBag,
  Sparkles,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ValuationService, ValuationResponse } from "@/lib/valuation.service";
import { CollateralService } from "@/lib/collateral.service";
import { StoreService } from "@/lib/store.service";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Collateral Type from API
interface CollateralType {
  id: number;
  name: string;
  feeRateMonthly: number;
  custodyFeeRateMonthly?: number;
}

// Store from API
interface Store {
  id: string;
  name: string;
  address?: string;
}

// Hardcoded field definitions for common asset types
// These are matched by collateral type NAME (case-insensitive contains match)
interface FieldDefinition {
  id: string;
  label: string;
  required: boolean;
  placeholder?: string;
}

const COMMON_ASSET_FIELDS: Record<string, FieldDefinition[]> = {
  // Motorbike / Xe máy
  "xe máy": [
    {
      id: "licensePlate",
      label: "Biển kiểm soát",
      required: true,
      placeholder: "VD: 30B1-12345",
    },
    {
      id: "frameNumber",
      label: "Số khung",
      required: true,
      placeholder: "VD: RLHJA...",
    },
    {
      id: "engineNumber",
      label: "Số máy",
      required: true,
      placeholder: "VD: HA...",
    },
    {
      id: "brand",
      label: "Hãng xe",
      required: false,
      placeholder: "VD: Honda, Yamaha",
    },
    {
      id: "model",
      label: "Dòng xe",
      required: false,
      placeholder: "VD: Wave, Exciter",
    },
    {
      id: "year",
      label: "Năm sản xuất",
      required: false,
      placeholder: "VD: 2020",
    },
    {
      id: "color",
      label: "Màu sắc",
      required: false,
      placeholder: "VD: Đen, Trắng",
    },
    {
      id: "mileage",
      label: "Số ODO (km)",
      required: false,
      placeholder: "VD: 20000",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới 90%, Cũ",
    },
  ],
  // Car / Ô tô
  "ô tô": [
    {
      id: "licensePlate",
      label: "Biển kiểm soát",
      required: true,
      placeholder: "VD: 30A-12345",
    },
    {
      id: "frameNumber",
      label: "Số khung",
      required: true,
      placeholder: "VD: WVWZZZ...",
    },
    {
      id: "engineNumber",
      label: "Số máy",
      required: true,
      placeholder: "VD: CKT...",
    },
    {
      id: "brand",
      label: "Hãng xe",
      required: false,
      placeholder: "VD: Toyota, Honda",
    },
    {
      id: "model",
      label: "Dòng xe",
      required: false,
      placeholder: "VD: Vios, City",
    },
    {
      id: "year",
      label: "Năm sản xuất",
      required: false,
      placeholder: "VD: 2020",
    },
    {
      id: "color",
      label: "Màu sắc",
      required: false,
      placeholder: "VD: Đen, Trắng",
    },
    {
      id: "mileage",
      label: "Số ODO (km)",
      required: false,
      placeholder: "VD: 50000",
    },
    {
      id: "numberOfSeats",
      label: "Số ghế",
      required: false,
      placeholder: "VD: 4, 5, 7",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới 90%, Cũ",
    },
  ],
  // Phone / Điện thoại
  "điện thoại": [
    {
      id: "imei",
      label: "Số IMEI",
      required: true,
      placeholder: "VD: 356789012345678",
    },
    {
      id: "brand",
      label: "Hãng",
      required: false,
      placeholder: "VD: Apple, Samsung",
    },
    {
      id: "model",
      label: "Model",
      required: false,
      placeholder: "VD: iPhone 14, Galaxy S23",
    },
    {
      id: "storage",
      label: "Dung lượng",
      required: false,
      placeholder: "VD: 128GB, 256GB",
    },
    {
      id: "color",
      label: "Màu sắc",
      required: false,
      placeholder: "VD: Đen, Trắng",
    },
    {
      id: "password",
      label: "Mật khẩu màn hình",
      required: false,
      placeholder: "Mã PIN hoặc Pattern",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới 95%, Pin 90%",
    },
  ],
  // Laptop
  laptop: [
    {
      id: "serialNumber",
      label: "Số Serial",
      required: true,
      placeholder: "VD: C02Y...",
    },
    {
      id: "brand",
      label: "Hãng",
      required: false,
      placeholder: "VD: Dell, HP, Apple",
    },
    {
      id: "model",
      label: "Model",
      required: false,
      placeholder: "VD: MacBook Pro, XPS 15",
    },
    { id: "cpu", label: "CPU", required: false, placeholder: "VD: i7, M1" },
    { id: "ram", label: "RAM", required: false, placeholder: "VD: 16GB" },
    {
      id: "storage",
      label: "Ổ cứng",
      required: false,
      placeholder: "VD: 512GB SSD",
    },
    {
      id: "password",
      label: "Mật khẩu",
      required: false,
      placeholder: "Mật khẩu đăng nhập",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới 90%, Pin 85%",
    },
  ],
  // Gold / Vàng
  vàng: [
    {
      id: "weight",
      label: "Trọng lượng (chỉ/lượng)",
      required: true,
      placeholder: "VD: 5 chỉ, 2 lượng",
    },
    {
      id: "purity",
      label: "Tuổi vàng",
      required: true,
      placeholder: "VD: 9999, 24K, 18K",
    },
    {
      id: "type",
      label: "Loại vàng",
      required: false,
      placeholder: "VD: SJC, Doji, Nhẫn",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Nguyên tem, Đã cắt",
    },
  ],
  // Jewelry / Trang sức
  "trang sức": [
    {
      id: "type",
      label: "Loại trang sức",
      required: true,
      placeholder: "VD: Nhẫn, Dây chuyền, Lắc",
    },
    {
      id: "material",
      label: "Chất liệu",
      required: true,
      placeholder: "VD: Vàng 18K, Bạc 925",
    },
    {
      id: "weight",
      label: "Trọng lượng (gram)",
      required: false,
      placeholder: "VD: 5g",
    },
    {
      id: "gemstone",
      label: "Đá quý (nếu có)",
      required: false,
      placeholder: "VD: Kim cương 0.5 carat",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới, Đã sử dụng",
    },
  ],
  // Default fields for unknown types
  default: [
    {
      id: "serialNumber",
      label: "Số Serial/Mã định danh",
      required: false,
      placeholder: "Nhập số serial...",
    },
    {
      id: "brand",
      label: "Thương hiệu",
      required: false,
      placeholder: "Nhập thương hiệu...",
    },
    {
      id: "model",
      label: "Model/Dòng",
      required: false,
      placeholder: "Nhập model...",
    },
    {
      id: "condition",
      label: "Tình trạng",
      required: true,
      placeholder: "VD: Mới, Cũ, 90%",
    },
    {
      id: "notes",
      label: "Ghi chú khác",
      required: false,
      placeholder: "Mô tả thêm...",
    },
  ],
};

// Helper to find matching fields for a collateral type name
function getFieldsForCollateralType(typeName: string): FieldDefinition[] {
  const lowerName = typeName.toLowerCase();

  for (const [key, fields] of Object.entries(COMMON_ASSET_FIELDS)) {
    if (key !== "default" && lowerName.includes(key)) {
      return fields;
    }
  }

  return COMMON_ASSET_FIELDS["default"];
}

// Shared schema or type for Asset
export interface AssetDraft {
  id?: string;
  name: string;
  assetTypeId: string;
  warehouseId: string;
  valuation?: string;
  images: string[];
  imageFiles: File[];
  fieldValues: Record<string, string>;
  description?: string;
  ownerName?: string;
}

interface AssetCreationSidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAsset: (asset: AssetDraft) => void;
  initialAsset?: AssetDraft | null; // For editing existing assets
  showOwnerField?: boolean;
}

export function AssetCreationSidePanel({
  open,
  onOpenChange,
  onAddAsset,
  initialAsset,
  showOwnerField = false,
}: AssetCreationSidePanelProps) {
  const emptyAsset: AssetDraft = {
    name: "",
    assetTypeId: "",
    warehouseId: "",
    fieldValues: {},
    valuation: "",
    images: [],
    imageFiles: [],
    ownerName: "",
  };

  const [currentAsset, setCurrentAsset] = useState<AssetDraft>(emptyAsset);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [valuationResult, setValuationResult] =
    useState<ValuationResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for API data
  const [collateralTypes, setCollateralTypes] = useState<CollateralType[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch collateral types and stores on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [typesRes, storesRes] = await Promise.all([
          CollateralService.getCollateralTypes(),
          StoreService.getStores({ limit: 100 }),
        ]);
        setCollateralTypes(typesRes);
        setStores(storesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch collateral types or stores:", error);
        toast.error("Không thể tải danh sách loại tài sản hoặc cửa hàng");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Reset form when opening or set to initialAsset for editing
  useEffect(() => {
    if (open) {
      if (initialAsset) {
        // Edit mode: pre-fill with existing asset
        setCurrentAsset({ ...initialAsset });
      } else {
        // Add mode: reset to empty
        setCurrentAsset(emptyAsset);
      }
      setValuationResult(null);
    }
  }, [open, initialAsset]);

  const handleAdd = () => {
    if (
      !currentAsset.name ||
      !currentAsset.assetTypeId ||
      !currentAsset.warehouseId ||
      !currentAsset.valuation
    ) {
      toast.error(
        "Vui lòng điền Tên, Loại, Nơi lưu trữ và Định giá cho tài sản.",
      );
      return;
    }

    if (showOwnerField && !currentAsset.ownerName) {
      toast.error("Vui lòng điền tên chủ sở hữu.");
      return;
    }

    // Backend requires at least one file/image
    if (
      currentAsset.images.length === 0 &&
      currentAsset.imageFiles.length === 0
    ) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh tài sản (Bắt buộc).");
      return;
    }

    // Keep the existing ID if editing, otherwise generate new one
    onAddAsset({
      ...currentAsset,
      id: currentAsset.id || Math.random().toString(),
    });
    onOpenChange(false);
  };

  const handleEvaluate = async () => {
    if (
      !currentAsset.name &&
      Object.keys(currentAsset.fieldValues).length === 0
    ) {
      toast.error("Vui lòng nhập tên hoặc thông tin chi tiết để định giá");
      return;
    }

    setIsEvaluating(true);
    try {
      const payload = {
        collateralTypeId: Number(currentAsset.assetTypeId),
        brand: currentAsset.fieldValues["brand"],
        model: currentAsset.fieldValues["model"],
        year: Number(currentAsset.fieldValues["year"]) || undefined,
        condition: currentAsset.fieldValues["condition"] || "EXCELLENT", // Fallback or use user input
        mileage: Number(currentAsset.fieldValues["mileage"]) || undefined,
        // Optional extras
        description: currentAsset.name,
      };

      const result = await ValuationService.evaluate(payload);
      setValuationResult(result);
      toast.success("Định giá thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi định giá tài sản");
    } finally {
      setIsEvaluating(false);
    }
  };

  const applyValuation = () => {
    if (valuationResult) {
      setCurrentAsset((prev) => ({
        ...prev,
        valuation: valuationResult.marketValue.toString(),
      }));
    }
  };

  // Get the selected collateral type and its fields
  const selectedCollateralType = collateralTypes.find(
    (t) => t.id.toString() === currentAsset.assetTypeId,
  );
  const dynamicFields = selectedCollateralType
    ? getFieldsForCollateralType(selectedCollateralType.name)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl text-purple-700">
              <ShoppingBag className="w-6 h-6" />
              Thêm tài sản thế chấp
            </DialogTitle>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Trạng thái: Đề xuất (Proposed)
            </Badge>
          </div>
          <DialogDescription>
            Nhập thông tin chi tiết để tạo hồ sơ tài sản (Collateral Asset).
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Image Upload */}
              {/* Image Upload */}
              <div
                className="relative min-h-[200px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 gap-4 hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  // Prevent triggering if clicking on remove button
                  if ((e.target as HTMLElement).closest("button")) return;
                  fileInputRef.current?.click();
                }}
              >
                {currentAsset.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {currentAsset.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-md overflow-hidden bg-white shadow-sm group"
                      >
                        <Image
                          src={img}
                          alt={`Asset ${idx}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = [...currentAsset.images];
                            const newFiles = [...currentAsset.imageFiles];
                            newImages.splice(idx, 1);
                            newFiles.splice(idx, 1);
                            setCurrentAsset((prev) => ({
                              ...prev,
                              images: newImages,
                              imageFiles: newFiles,
                            }));
                          }}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <PlusCircle className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    ))}
                    <div
                      className="flex items-center justify-center aspect-video bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PlusCircle className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer">
                      <PlusCircle className="w-8 h-8 opacity-50" />
                      <span className="text-xs">
                        Tải ảnh tài sản (Nhiều ảnh){" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const newImages: string[] = [];
                      const newFiles: File[] = [];

                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setCurrentAsset((prev) => ({
                              ...prev,
                              images: [
                                ...prev.images,
                                ev.target!.result as string,
                              ],
                              imageFiles: [...prev.imageFiles, file],
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                    }
                  }}
                />
              </div>

              {/* Core Info */}
              <div className="space-y-4">
                {showOwnerField && (
                  <div className="space-y-2">
                    <Label>
                      Tên chủ sở hữu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="VD: Nguyễn Văn A"
                      value={currentAsset.ownerName}
                      onChange={(e) =>
                        setCurrentAsset({
                          ...currentAsset,
                          ownerName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>
                    Tên tài sản <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: iPhone 14 Pro Max 256GB"
                    value={currentAsset.name}
                    onChange={(e) =>
                      setCurrentAsset({ ...currentAsset, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Loại tài sản <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={currentAsset.assetTypeId}
                      onValueChange={(val) => {
                        setCurrentAsset({
                          ...currentAsset,
                          assetTypeId: val,
                          fieldValues: {},
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        {collateralTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name}
                            {t.feeRateMonthly > 0 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({t.feeRateMonthly}%/tháng)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Nơi lưu trữ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={currentAsset.warehouseId}
                      onValueChange={(val) =>
                        setCurrentAsset({ ...currentAsset, warehouseId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cửa hàng/kho" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Dynamic Fields based on Collateral Type */}
              {currentAsset.assetTypeId && dynamicFields.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Thông tin chi tiết ({selectedCollateralType?.name})
                    </h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Thông tin này sẽ được lưu vào hồ sơ tài sản
                            (Collateral Asset) và ảnh hưởng đến định giá.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {dynamicFields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className="text-xs text-gray-600">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          className="h-8 text-sm"
                          placeholder={
                            field.placeholder ||
                            `Nhập ${field.label.toLowerCase()}...`
                          }
                          value={currentAsset.fieldValues[field.id] || ""}
                          onChange={(e) =>
                            setCurrentAsset({
                              ...currentAsset,
                              fieldValues: {
                                ...currentAsset.fieldValues,
                                [field.id]: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg border border-dashed flex items-center justify-center text-gray-400 text-sm h-[200px]">
                  Chọn loại tài sản để nhập chi tiết
                </div>
              )}

              {/* Valuation Section */}
              <div className="space-y-2">
                <Label>
                  Định giá (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentAsset.valuation}
                  onChange={(e) =>
                    setCurrentAsset({
                      ...currentAsset,
                      valuation: e.target.value,
                    })
                  }
                  className="text-right"
                />

                {valuationResult && (
                  <div className="bg-white p-3 rounded border text-xs space-y-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b">
                      <div>
                        <span className="block text-gray-500 text-[10px] uppercase">
                          Thấp nhất
                        </span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("vi-VN").format(
                            valuationResult.minPrice,
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500 text-[10px] uppercase">
                          Trung bình
                        </span>
                        <span className="font-bold text-blue-600">
                          {new Intl.NumberFormat("vi-VN").format(
                            valuationResult.marketValue,
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500 text-[10px] uppercase">
                          Cao nhất
                        </span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("vi-VN").format(
                            valuationResult.maxPrice,
                          )}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-gray-600 italic line-clamp-2"
                      title={valuationResult.reasoning}
                    >
                      &quot;{valuationResult.reasoning}&quot;
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full h-7 text-xs"
                      onClick={applyValuation}
                    >
                      Áp dụng giá này <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoadingData}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {initialAsset ? "Cập nhật" : "Thêm tài sản"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
