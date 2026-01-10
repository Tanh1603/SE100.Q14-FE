"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAssetType } from "@/mock-data/asset";
import { AssetType } from "@/types/asset";
import { AssetTypeFieldEnum } from "@/types/enum";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function AssetConfigTab() {
  // Initialize state with mock data
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(mockAssetType);
  const [newTypeName, setNewTypeName] = useState("");

  // State for adding a field to a specific type
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<AssetTypeFieldEnum>(
    AssetTypeFieldEnum.STRING
  );

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    const newType: AssetType = {
      id: Math.random().toString(),
      name: newTypeName,
      isActive: true,
      custodyFee: 0,
      field: [],
    };
    setAssetTypes([...assetTypes, newType]);
    setNewTypeName("");
  };

  const handleAddField = () => {
    if (!selectedType || !newFieldLabel.trim()) return;

    const updatedType = { ...selectedType };
    updatedType.field = [
      ...updatedType.field,
      {
        id: Math.random().toString(),
        label: newFieldLabel,
        type: newFieldType,
        required: false,
      },
    ];

    setAssetTypes(
      assetTypes.map((t) => (t.id === selectedType.id ? updatedType : t))
    );
    setSelectedType(updatedType); // Update selection
    setNewFieldLabel("");
  };

  const handleDeleteType = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa loại tài sản này?")) {
      setAssetTypes(assetTypes.filter((t) => t.id !== id));
      if (selectedType?.id === id) setSelectedType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Asset Types List */}
        <Card className="md:col-span-1 border-l-4 border-l-blue-500">
          <CardHeader className="bg-blue-50/20 pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Loại tài sản</span>
              <Badge variant="secondary">{assetTypes.length}</Badge>
            </CardTitle>
            <CardDescription>Quản lý các loại tài sản cầm cố</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tên loại mới (VD: Laptop)"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <Button
                size="icon"
                onClick={handleAddType}
                disabled={!newTypeName}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {assetTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center group ${
                    selectedType?.id === type.id
                      ? "bg-blue-50 border-blue-300 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <span className="font-medium">{type.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteType(type.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Field Configuration */}
        <Card className="md:col-span-2 border-l-4 border-l-purple-500">
          {selectedType ? (
            <>
              <CardHeader className="bg-purple-50/20 pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-purple-600" />
                  Cấu hình: {selectedType.name}
                </CardTitle>
                <CardDescription>
                  Định nghĩa các trường thông tin cần nhập cho loại tài sản này
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {/* Field List */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Tên trường (Label)</TableHead>
                        <TableHead>Kiểu dữ liệu</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedType.field.length > 0 ? (
                        selectedType.field.map((f) => (
                          <TableRow key={f.id}>
                            <TableCell className="font-medium">
                              {f.label}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{f.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-6 text-muted-foreground"
                          >
                            Chưa có trường thông tin nào. Thêm bên dưới.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Add Field Form */}
                <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Thêm trường mới
                  </h4>
                  <div className="flex gap-3 items-end">
                    <div className="space-y-1.5 flex-1">
                      <Label className="text-xs">Tên trường</Label>
                      <Input
                        placeholder="VD: Số IMEI, Màu sắc..."
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 w-[150px]">
                      <Label className="text-xs">Kiểu dữ liệu</Label>
                      <Select
                        value={newFieldType}
                        onValueChange={(v) =>
                          setNewFieldType(v as AssetTypeFieldEnum)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AssetTypeFieldEnum.STRING}>
                            Văn bản
                          </SelectItem>
                          <SelectItem value={AssetTypeFieldEnum.NUMBER}>
                            Số
                          </SelectItem>
                          <SelectItem value={AssetTypeFieldEnum.DATE}>
                            Ngày tháng
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddField}>Thêm</Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 min-h-[300px]">
              <Settings2 className="w-12 h-12 mb-4 opacity-20" />
              <p>Chọn một loại tài sản bên trái để cấu hình</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
