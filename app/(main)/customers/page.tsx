"use client";

import { AppDialog } from "@/components/app-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, PlusCircle, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import CustomerForm from "./customer-form";
import { mockCustomer } from "@/mock-data/customer";
import { Customer } from "@/types/customer";
import Image from "next/image";

const CustomerPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const customers = mockCustomer;
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
                    <SelectItem value="apple">Bình thường </SelectItem>
                    <SelectItem value="banana">Nợ xấu</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>{" "}
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

          <div className="mt-5 rounded-lg border shadow-sm overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary ">
                  <TableHead className=" text-white">STT</TableHead>
                  <TableHead className=" text-white">Tên khách hàng</TableHead>
                  <TableHead className=" text-white">Ngày sinh</TableHead>
                  <TableHead className="text-white">Số CCCD</TableHead>
                  <TableHead className="text-white">Địa chỉ</TableHead>
                  <TableHead className="text-white">Ảnh</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className={`border-t cursor-pointer transition-colors ${
                      selectedCustomer?.id.includes(customer.id)
                        ? "bg-blue-200"
                        : "hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>{customer.dob}</TableCell>
                    <TableCell>{customer.cccd}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={customer.avatar}
                          alt={customer.fullName}
                          width={50}
                          height={50}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
