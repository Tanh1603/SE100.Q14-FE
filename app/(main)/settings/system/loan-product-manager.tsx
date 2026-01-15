"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ConfigurationService } from "@/lib/configuration.service";
import { Edit, Plus, Save, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LoanType {
  id: number;
  name: string;
  productCode: string;
  interestRateMonthly: number;
  durationMonths: number;
  description?: string;
}

interface LoanProductManagerProps {
  initialValue: string; // JSON string
  configKey: string;
  onUpdate: () => void;
}

export function LoanProductManager({ initialValue, configKey, onUpdate }: LoanProductManagerProps) {
  const [products, setProducts] = useState<LoanType[]>(() => {
    try {
      return JSON.parse(initialValue);
    } catch {
      return [];
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit/Add Modal State
  const [isOpen, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<LoanType>>({});

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const jsonString = JSON.stringify(products);
      await ConfigurationService.update(configKey, jsonString);
      toast.success("Đã lưu cấu hình gói vay");
      onUpdate();
    } catch (error) {
      toast.error("Lỗi khi lưu cấu hình");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: LoanType) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct({
        id: Date.now(), // Temp ID
        name: "",
        productCode: "",
        interestRateMonthly: 0,
        durationMonths: 0
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa gói vay này?")) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleModalSave = () => {
    if (!editingProduct.name || !editingProduct.productCode) {
        toast.error("Vui lòng điền tên và mã gói vay");
        return;
    }

    setProducts(prev => {
        const index = prev.findIndex(p => p.id === editingProduct.id);
        if (index >= 0) {
            const newArr = [...prev];
            newArr[index] = editingProduct as LoanType;
            return newArr;
        } else {
            return [...prev, editingProduct as LoanType];
        }
    });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Danh sách gói vay (Loan Products)</h3>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" /> Thêm mới
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Lưu thay đổi
            </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên gói</TableHead>
              <TableHead>Mã (Code)</TableHead>
              <TableHead className="text-right">Lãi suất (%)</TableHead>
              <TableHead className="text-right">Thời hạn (Tháng)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-xs">{product.productCode}</TableCell>
                <TableCell className="text-right">{product.interestRateMonthly}%</TableCell>
                <TableCell className="text-right">{product.durationMonths}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingProduct.id ? "Chỉnh sửa gói vay" : "Thêm gói vay mới"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Tên gói</Label>
                    <Input className="col-span-3" value={editingProduct.name || ""} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Mã (Code)</Label>
                    <Input className="col-span-3" value={editingProduct.productCode || ""} onChange={e => setEditingProduct({...editingProduct, productCode: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Lãi suất (%)</Label>
                    <Input type="number" className="col-span-3" value={editingProduct.interestRateMonthly || 0} onChange={e => setEditingProduct({...editingProduct, interestRateMonthly: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Thời hạn</Label>
                    <Input type="number" className="col-span-3" value={editingProduct.durationMonths || 0} onChange={e => setEditingProduct({...editingProduct, durationMonths: Number(e.target.value)})} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button onClick={handleModalSave}>Cập nhật</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
