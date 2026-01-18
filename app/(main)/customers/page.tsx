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
import { CustomerDTO } from "@/types/dto/customer.dto";
import { Edit, PlusCircle, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { CustomerColumn } from "./columns";
import CustomerForm from "./customer-form";
import { useCustomers } from "@/hooks/use-customer";

const CustomerPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerDTO | undefined
  >(undefined);

  // Search & Pagination State
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>(""); // Input value
  const [searchQuery, setSearchQuery] = useState<string>(""); // API param

  const { data, isLoading, error } = useCustomers({
    page,
    limit: 10,
    search: searchQuery,
  });

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Pagination logic
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const showPagination = (meta?.totalItems || 0) > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Lỗi khi tải dữ liệu: {error.message}
      </div>
    );
  }

  // Extract customer list from paginated response
  const customers = data?.data || [];

  return (
    <div className="pb-10">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <Users className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">
            Danh sách khách hàng
          </p>
        </div>

        {/* Fillter - Responsive */}
        <div className="flex flex-col md:flex-row justify-between md:items-center pt-2 px-5 pb-5 bg-white rounded-xl gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-x-10 w-full md:w-auto">
            <div className="flex flex-col gap-y-2 w-full md:min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input
                placeholder="Họ tên, CCCD khách hàng"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            <div className="flex flex-col gap-y-2 w-full md:w-auto">
              <Label>Loại khách hàng</Label>
              <Select disabled>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="REGULAR">Thường</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full md:w-auto" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        {/* Table - Responsive */}
        <div className="mt-2 pt-2 px-5 pb-2 bg-white rounded-xl">
          <div className="flex flex-wrap gap-3 mb-5">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(true);
                setSelectedCustomer(undefined);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>

            <Button
              onClick={() => {
                setOpenDialog(true);
              }}
              disabled={selectedCustomer === undefined}
            >
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </Button>

            {/* <Button
              variant="destructive"
              disabled={selectedCustomer === undefined}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button> */}
          </div>

          <div className="mt-5 overflow-x-auto">
            <DataTable
              columns={CustomerColumn}
              data={customers}
              selectedRow={selectedCustomer}
              onRowClick={(customer) => {
                setSelectedCustomer(customer);
              }}
            />
          </div>

          {/* Pagination Controls */}
          {showPagination && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <div className="text-sm font-medium">
                Trang {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>

      <AppDialog
        title={selectedCustomer ? "Cập nhật khách hàng" : "Thêm mới khách hàng"}
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) setSelectedCustomer(undefined);
        }}
      >
        <CustomerForm
          initialCustomer={selectedCustomer}
          onSuccess={() => setOpenDialog(false)}
        />
      </AppDialog>
    </div>
  );
};

export default CustomerPage;
