"use client";

import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-label";
import { LogOut, PlusCircle, Search, UserCog } from "lucide-react";
import { useState } from "react";
import StaffForm from "./staff-form";
import { DataTable } from "@/components/data-table";
import { StaffColumn } from "./columns";
import { mockStaffs } from "@/mock-data/staff";

const StaffPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <SidebarInset className="bg-red">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <UserCog className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách nhân viên</p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Họ tên, email, sđt nhân viên" />
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

            <Button variant="destructive">
              <LogOut />
              Nghỉ việc
            </Button>
          </div>

          <div className="mt-5">
            <DataTable columns={StaffColumn} data={mockStaffs} />
          </div>
        </div>
      </div>

      <AppDialog
        title="Thêm mới nhân viên"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
      >
        <StaffForm />
      </AppDialog>
    </SidebarInset>
  );
};

export default StaffPage;
