"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { AppPagination } from "@/components/pagination";
import { useStaff, useTerminateStaff } from "@/hooks/use-staff";
import { Staff } from "@/types/staff";
import { Label } from "@radix-ui/react-label";
import { LogOut, PlusCircle, RotateCcw, Search, UserCog } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import { StaffColumn } from "./columns";
import StaffForm from "./staff-form";

const StaffPage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  //URl state
  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") ?? undefined;

  const {
    data: staffs,
    isLoading: staffLoading,
    refetch,
    isFetching,
  } = useStaff({
    page,
    limit: 20,
    q,
  });
  const { mutate, isPending } = useTerminateStaff();

  const [selectedStaff, setSelectedStaff] = useState<Staff>();

  const [keyword, setKeyword] = useState("");

  const updateQuery = (params: Record<string, string>) => {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => query.set(key, value));
    router.push(`?${query.toString()}`);
  };

  // if (staffLoading) {
  //   return <Loading />;
  // }


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
              <Input
                placeholder="Họ tên, email, sđt nhân viên"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={() => {
              updateQuery({
                q: keyword,
                page: "1",
              });
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        {/* Table - Responsive */}

        <div className="mt-5 pt-5 px-5 pb-5 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-5">
            <Button onClick={() => setOpenDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>

            <Button
              variant="destructive"
              disabled={
                selectedStaff === undefined ||
                selectedStaff?.status === "INACTIVE" ||
                isPending
              }
              onClick={() => {
                console.log(selectedStaff);

                if (selectedStaff?.id) {
                  mutate(selectedStaff.id, {
                    onSuccess: () => {
                      toast.success("Cập nhật nhân viên thành công");
                      setSelectedStaff(undefined);
                    },
                    onError: () => {
                      toast.error("Cập nhật thất bại");
                    },
                  });
                }
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Nghỉ việc
            </Button>

            <Button
              disabled={isFetching}
              onClick={() => refetch()}
              variant="secondary"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
          </div>

          {staffLoading || isFetching || isPending ? (
            <Loading />
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={StaffColumn}
                data={staffs?.data ?? []}
                selectedRow={selectedStaff}
                onRowClick={(staff) => setSelectedStaff(staff)}
              />
            </div>
          )}
        </div>

        <div className="mt-5">
          <AppPagination
            page={page}
            totalPages={staffs?.meta?.totalPages ?? 0}
          />
        </div>
      </div>

      <AppDialog
        title="Thêm mới nhân viên"
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
      >
        <StaffForm onCloseForm={() => setOpenDialog(false)} />
      </AppDialog>
    </div>
  );
};

export default StaffPage;
