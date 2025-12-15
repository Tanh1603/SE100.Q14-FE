"use client";

import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit, FileSignature, PlusCircle, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { LoanColumn } from "./column";
import ContractForm from "./form";

const ContractPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <SidebarInset className="bg-red">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <FileSignature className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách hợp đồng</p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Nhập họ tên khách, sdt" />
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
            <DataTable columns={LoanColumn} data={[]} />
          </div>
        </div>
      </div>

      <AppDialog
        title="Thêm mới hợp đồng cầm đồ"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
      >
        <ContractForm />
      </AppDialog>
    </SidebarInset>
  );
};

export default ContractPage;
