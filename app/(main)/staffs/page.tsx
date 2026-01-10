"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@radix-ui/react-label";
import { LogOut, PlusCircle, Search, UserCog } from "lucide-react";
import { useState } from "react";
import StaffForm from "./staff-form";
import { DataTable } from "@/components/data-table";
import { StaffColumn } from "./columns";
import { mockStaff } from "@/mock-data/staff";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StaffPage = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  return (
    // Removed SidebarInset wrapper
    <div className="pb-10">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <UserCog className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách nhân viên</p>
        </div>

        {/* Fillter - Responsive */}
        <div className="flex flex-col md:flex-row justify-between md:items-center pt-2 px-5 pb-5 bg-white rounded-xl shadow-sm border gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-x-10 w-full md:w-auto">
            <div className="flex flex-col gap-y-2 w-full md:min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Họ tên, email, sđt nhân viên" />
            </div>
          </div>

          <Button className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        {/* Table - Responsive */}
        <div className="mt-5 pt-5 px-5 pb-5 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-5">
            <Button onClick={() => setOpenSheet(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>

            <Button variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Nghỉ việc
            </Button>
          </div>

          <div className="overflow-x-auto">
            <DataTable columns={StaffColumn} data={mockStaff} />
          </div>
        </div>
      </div>

      <Dialog open={openSheet} onOpenChange={setOpenSheet}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm mới nhân viên</DialogTitle>
            <DialogDescription>
              Tạo tài khoản nhân viên mới và phân quyền cửa hàng quản lý.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <StaffForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
