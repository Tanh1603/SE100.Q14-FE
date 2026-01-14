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
import { mockAssetType } from "@/mock-data/asset";
import { mockwarehouses } from "@/mock-data/warehouse";
import { PlusCircle, ShoppingBag, Sparkles, Loader2, ArrowRight, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ValuationService, ValuationResponse } from "@/lib/valuation.service";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Shared schema or type for Asset
export interface AssetDraft {
// ... (rest of the file)
  id?: string;
  name: string;
  assetTypeId: string;
  warehouseId: string;
  valuation: string;
  image?: any;
  imageFile?: File;
  fieldValues: Record<string, string>;
  description?: string;
}

interface AssetCreationSidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAsset: (asset: AssetDraft) => void;
}

export function AssetCreationSidePanel({
  open,
  onOpenChange,
  onAddAsset,
}: AssetCreationSidePanelProps) {
  const [currentAsset, setCurrentAsset] = useState<AssetDraft>({
    name: "",
    assetTypeId: "",
    warehouseId: "",
    fieldValues: {},
    valuation: "",
    image: null,
    imageFile: undefined,
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setCurrentAsset({
        name: "",
        assetTypeId: "",
        warehouseId: "",
        fieldValues: {},
        valuation: "",
        image: null,
        imageFile: undefined,
      });
      setValuationResult(null);
    }
  }, [open]);

  const handleAdd = () => {
    if (
      !currentAsset.name ||
      !currentAsset.assetTypeId ||
      !currentAsset.warehouseId
    ) {
      toast.error("Vui lòng điền Tên tài sản, Loại tài sản và Kho lưu trữ.");
      return;
    }

    onAddAsset({ ...currentAsset, id: Math.random().toString() });
    onOpenChange(false);
  };

  const handleEvaluate = async () => {
    if (!currentAsset.name && Object.keys(currentAsset.fieldValues).length === 0) {
      toast.error("Vui lòng nhập tên hoặc thông tin chi tiết để định giá");
      return;
    }

    setIsEvaluating(true);
    try {
      // Construct description
      const typeName = mockAssetType.find(t => t.id === currentAsset.assetTypeId)?.name || "";
      const details = Object.entries(currentAsset.fieldValues)
        .map(([key, value]) => {
            // Find label for key if possible, simplified here
            return `${key}: ${value}`;
        })
        .join(", ");
      
      const description = `${currentAsset.name}. Loại: ${typeName}. Chi tiết: ${details}`;

      const result = await ValuationService.evaluate(description, currentAsset.imageFile);
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
      setCurrentAsset(prev => ({
        ...prev,
        valuation: valuationResult.marketValue.toString()
      }));
    }
  };

  const selectedAssetType = mockAssetType.find(
    (t) => t.id === currentAsset.assetTypeId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl text-purple-700">
              <ShoppingBag className="w-6 h-6" />
              Thêm tài sản thế chấp
            </DialogTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Trạng thái: Đề xuất (Proposed)
            </Badge>
          </div>
          <DialogDescription>
            Nhập thông tin chi tiết để tạo hồ sơ tài sản (Collateral Asset).
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
             {/* Image Upload */}
             <div 
                className="relative aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
             >
                {currentAsset.image ? (
                  <Image src={currentAsset.image} alt="Asset" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <PlusCircle className="w-8 h-8 opacity-50" />
                    <span className="text-xs">Tải ảnh tài sản</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setCurrentAsset(prev => ({
                          ...prev,
                          image: ev.target?.result,
                          imageFile: file
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
             </div>

            {/* Core Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Tên tài sản <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="VD: Laptop Dell XPS 15"
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
                      {mockAssetType.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Kho lưu trữ <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentAsset.warehouseId}
                    onValueChange={(val) =>
                      setCurrentAsset({ ...currentAsset, warehouseId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockwarehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* Dynamic Fields */}
             {currentAsset.assetTypeId && selectedAssetType ? (
              <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Thuộc tính & Tình trạng
                  </h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Thông tin này sẽ được lưu vào hồ sơ tài sản (Collateral Asset) và ảnh hưởng đến định giá.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {selectedAssetType.field.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <Label className="text-xs text-gray-600">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      <Input
                        className="h-8 text-sm"
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
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
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3">
               <div className="flex items-center justify-between">
                  <Label className="text-blue-800 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Định giá (VNĐ)
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : "Định giá ngay"}
                  </Button>
               </div>
               
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
                  className="font-mono text-right font-bold text-lg"
                />

                {valuationResult && (
                  <div className="bg-white p-3 rounded border text-xs space-y-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b">
                       <div>
                          <span className="block text-gray-500 text-[10px] uppercase">Thấp nhất</span>
                          <span className="font-semibold">{new Intl.NumberFormat("vi-VN").format(valuationResult.minPrice)}</span>
                       </div>
                       <div>
                          <span className="block text-gray-500 text-[10px] uppercase">Trung bình</span>
                          <span className="font-bold text-blue-600">{new Intl.NumberFormat("vi-VN").format(valuationResult.marketValue)}</span>
                       </div>
                       <div>
                          <span className="block text-gray-500 text-[10px] uppercase">Cao nhất</span>
                          <span className="font-semibold">{new Intl.NumberFormat("vi-VN").format(valuationResult.maxPrice)}</span>
                       </div>
                    </div>
                    <p className="text-gray-600 italic line-clamp-2" title={valuationResult.reasoning}>
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

        <DialogFooter className="mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Thêm tài sản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
