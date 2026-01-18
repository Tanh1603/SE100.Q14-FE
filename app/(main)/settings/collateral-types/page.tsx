"use client";

import { useEffect, useState } from "react";
import { CollateralType } from "@/types/collateral-type";
import { CollateralTypeService } from "@/lib/collateral-type.service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { Edit, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CollateralTypePage() {
  const [types, setTypes] = useState<CollateralType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CollateralType | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [custodyFeeRateMonthly, setCustodyFeeRateMonthly] = useState<number>(0);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await CollateralTypeService.getAll();
      setTypes(res.data);
    } catch (_error) {
      toast.error("Không thể tải danh sách loại tài sản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const resetForm = () => {
    setName("");
    setCustodyFeeRateMonthly(0);
    setEditingType(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (type: CollateralType) => {
    setEditingType(type);
    setName(type.name);
    setCustodyFeeRateMonthly(type.custodyFeeRateMonthly);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingType) {
        await CollateralTypeService.update(editingType.id, {
          name,
          custodyFeeRateMonthly,
        });
        toast.success("Cập nhật thành công");
      } else {
        await CollateralTypeService.create({
          name,
          custodyFeeRateMonthly,
        });
        toast.success("Tạo mới thành công");
      }
      setIsDialogOpen(false);
      fetchTypes();
    } catch (_error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  {
    /* 
  const handleDelete = async (id: number) => {
     if(!confirm("Bạn có chắc chắn muốn xóa?")) return;
     try {
         await CollateralTypeService.delete(id);
         toast.success("Xóa thành công");
         fetchTypes();
     } catch (_e) {
         toast.error("Không thể xóa (có thể đang được sử dụng)");
     }
  } 
  */
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loại tài sản</h1>
          <p className="text-muted-foreground">
            Quản lý các loại tài sản cầm cố và cấu hình phí lưu kho
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Tên loại tài sản</TableHead>
              <TableHead className="text-right">Phí lưu kho/tháng</TableHead>
              <TableHead className="text-right">Số lượng tài sản</TableHead>
              <TableHead className="w-[150px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : types.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              types.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-right">
                    {(t.custodyFeeRateMonthly * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{t.totalCollaterals || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(t)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Cập nhật loại tài sản" : "Thêm loại tài sản mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Tên loại tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Xe máy"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Phí lưu kho hàng tháng (%){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                value={custodyFeeRateMonthly * 100}
                onChange={(e) =>
                  setCustodyFeeRateMonthly(Number(e.target.value) / 100)
                }
                placeholder="Ví dụ: 1.5"
              />
              <p className="text-[10px] text-muted-foreground">
                Nhập giá trị phần trăm (Ví dụ: 1 cho 1%)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!name}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
