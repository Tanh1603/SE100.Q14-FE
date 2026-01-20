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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockwarehouses } from "@/mock-data/warehouse";
import { Warehouse } from "@/types/warehouse";
import { WarehouseStatus } from "@/types/enum";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function WarehouseSettingsTab() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockwarehouses);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleAdd = () => {
    if (!newName || !newAddress) return;
    const newWarehouse: Warehouse = {
      id: Math.random().toString(),
      name: newName,
      address: newAddress,
      province: { id: "HN", code: "HN", name: "Hà Nội", label: "Hà Nội" }, // Default mock
      ward: {
        id: "Unknown",
        code: "Unknown",
        name: "Chưa xác định",
        label: "Chưa xác định",
      },
      status: WarehouseStatus.AVAILABLE,
      fee: 0,
    };
    setWarehouses([...warehouses, newWarehouse]);
    setNewName("");
    setNewAddress("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa kho này?")) {
      setWarehouses(warehouses.filter((w) => w.id !== id));
    }
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="bg-green-50/20 pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Danh sách Kho lưu trữ
          </span>
          <Badge variant="outline" className="bg-white">
            {warehouses.length} Kho
          </Badge>
        </CardTitle>
        <CardDescription>Quản lý các địa điểm lưu kho tài sản</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Add Form */}
        <div className="flex gap-3 items-end bg-gray-50 p-4 rounded-lg border">
          <div className="grid gap-1.5 flex-1">
            <label className="text-xs font-medium">Tên kho</label>
            <Input
              placeholder="VD: Kho Hai Bà Trưng"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5 flex-[2]">
            <label className="text-xs font-medium">Địa chỉ</label>
            <Input
              placeholder="Số 10, đường..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Thêm kho
          </Button>
        </div>

        {/* List */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Tên kho</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">
                    {warehouse.name}
                  </TableCell>
                  <TableCell>{warehouse.address}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        warehouse.status === WarehouseStatus.AVAILABLE
                          ? "default"
                          : "secondary"
                      }
                    >
                      {warehouse.status === WarehouseStatus.AVAILABLE
                        ? "Hoạt động"
                        : "Đã đầy"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(warehouse.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
