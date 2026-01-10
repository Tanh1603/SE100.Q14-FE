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
import { Textarea } from "@/components/ui/textarea"; // Assuming we want description field
import { mockAssetType } from "@/mock-data/asset";
import { mockwarehouses } from "@/mock-data/warehouse";
import { AssetTypeFieldEnum } from "@/types/enum";
import { PlusCircle, ShoppingBag, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import * as z from "zod";

// Shared schema or type for Asset (can be imported if defined elsewhere, for now defining locally to match usage)
export interface AssetDraft {
  id?: string;
  name: string;
  assetTypeId: string;
  warehouseId: string;
  valuation: string;
  image?: any;
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
  });

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
      });
    }
  }, [open]);

  const handleAdd = () => {
    // Basic validation
    if (
      !currentAsset.name ||
      !currentAsset.assetTypeId ||
      !currentAsset.warehouseId
    ) {
      alert("Vui lòng điền Tên tài sản, Loại tài sản và Kho lưu trữ.");
      return;
    }

    onAddAsset({ ...currentAsset, id: Math.random().toString() });
    onOpenChange(false);
  };

  const selectedAssetType = mockAssetType.find(
    (t) => t.id === currentAsset.assetTypeId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-xl text-purple-700">
            <ShoppingBag className="w-6 h-6" />
            Thêm tài sản thế chấp
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết về tài sản.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                    }); // Reset fields on type change
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

            <div className="space-y-2">
              <Label>Định giá tài sản (VNĐ)</Label>
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
                className="font-mono text-right"
              />
            </div>
          </div>

          {/* Dynamic Fields */}
          {currentAsset.assetTypeId && selectedAssetType && (
            <div className="bg-gray-50 p-4 rounded-lg border space-y-4 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Thông tin chi tiết ({selectedAssetType.name})
              </h4>

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
          )}
        </div>

        <DialogFooter className="mt-8">
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
