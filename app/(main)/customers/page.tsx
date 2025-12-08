"use client";

import { OpenDialogButton } from "@/components/open-dialog-button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, Trash2, Users } from "lucide-react";
import CreateCustomerForm from "./create-customer-form";

const CustomerPage = () => {
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
            <OpenDialogButton title="Thêm mới khách hàng">
              <CreateCustomerForm />
            </OpenDialogButton>

            <Button>
              <Edit />
              Sửa
            </Button>

            <Button>
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
                  <TableHead className="text-white">Tình trạng</TableHead>
                  <TableHead className="text-white">Ảnh</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.invoice}
                    className="border-t hover:bg-muted/30 transition-colors p-10"
                  >
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default CustomerPage;
