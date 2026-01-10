"use client";
import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockwarehouses } from "@/mock-data/warehouse";
import { CUSTOMER_STATUS_OPTIONS } from "@/types/enum";
import { Label } from "@radix-ui/react-label";
import { Edit, PlusCircle, Search, Trash2, Warehouse } from "lucide-react";
import { useState } from "react";
import { WarehouseColumn } from "./columns";
import WarehouseForm from "./form";

const Page = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <SidebarInset className="bg-red">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <Warehouse className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách kho</p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Nhập tên kho" />
            </div>

            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Địa chỉ kho</Label>
              <Input placeholder="Nhập địa chỉ kho" />
            </div>

            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tình trạng</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CUSTOMER_STATUS_OPTIONS.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button>
            <Search />
            Tìm kiếm
          </Button>
        </div>

        {/* Table */}
        <div className="mt-2 pt-2 px-5 pb-2 bg-white rounded-xl">
          <div className="flex gap-x-5">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <PlusCircle />
              Thêm mới
            </Button>

            <Button>
              <Edit />
              Sửa
            </Button>

            <Button variant="destructive">
              <Trash2 />
              Xóa
            </Button>
          </div>

          <div className="mt-5">
            <DataTable columns={WarehouseColumn} data={mockwarehouses} />
          </div>
        </div>
      </div>

      <AppDialog
        title="Thêm mới kho"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
        contentClassName="sm:max-w-4xl"
      >
        <WarehouseForm />
      </AppDialog>
    </SidebarInset>
  );
};

export default Page;
