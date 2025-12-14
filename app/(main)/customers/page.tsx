"use client";

import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockCustomer } from "@/mock-data/customer";
import { Customer } from "@/types/customer";
import { CUSTOMER_STATUS_OPTIONS } from "@/types/enum";
import { Edit, PlusCircle, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { CustomerColumn } from "./columns";
import CustomerForm from "./customer-form";

const CustomerPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  return (
    <SidebarInset className="bg-red">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <Users className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">
            Danh sách khách hàng
          </p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Họ tên, CCCD khách hàng" />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Tình trạng</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
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
                setSelectedCustomer(undefined);
              }}
            >
              <PlusCircle />
              Thêm mới
            </Button>

            <Button
              onClick={() => {
                setOpenDialog(true);
              }}
              disabled={selectedCustomer === undefined}
            >
              <Edit />
              Sửa
            </Button>

            <Button
              variant="destructive"
              disabled={selectedCustomer === undefined}
            >
              <Trash2 />
              Xóa
            </Button>
          </div>

          <div className="mt-5">
            <DataTable
              columns={CustomerColumn}
              data={mockCustomer}
              selectedRow={selectedCustomer}
              onRowClick={(customer) => {
                setSelectedCustomer(customer);
              }}
            />
          </div>
        </div>
      </div>

      <AppDialog
        title="Thêm mới khách hàng"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
      >
        <CustomerForm initialCustomer={selectedCustomer} />
      </AppDialog>
    </SidebarInset>
  );
};

export default CustomerPage;
