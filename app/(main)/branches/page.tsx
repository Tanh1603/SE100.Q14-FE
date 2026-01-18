"use client";
import { AppDialog } from "@/components/app-dialog";
import { DataTable } from "@/components/data-table";
import { AppPagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { useBranch } from "@/hooks/use-branch";
import { Branch } from "@/types/branch";
import { BRANCH_STATUS_OPTIONS, BranchStatus } from "@/types/enum";
import { Label } from "@radix-ui/react-label";
import { Edit, PlusCircle, Search, Warehouse } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loading from "../loading";
import { BranchColumn } from "./columns";
import BranchForm from "./form";

const Page = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  // query
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") ?? undefined;
  const [keyword, setKeyword] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const updateQuery = (params: Record<string, string>) => {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => query.set(key, value));
    router.push(`?${query.toString()}`);
  };

  // selected branch
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();


  const { data: branch, isLoading: branchLoading } = useBranch({
    page,
    search,
    isActive,
  });


  // if (branchLoading) {
  //   return <Loading />
  // }

  return (
    <SidebarInset className="bg-red">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <Warehouse className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách chi nhánh</p>
        </div>

        {/* Fillter */}
        <div className="flex justify-between items-center pt-2 px-5 pb-5 bg-white rounded-xl ">
          <div className="flex gap-x-10">
            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Nhập tên chi nhánh, địa chỉ"
              />
            </div>

            <div className="flex flex-col gap-y-2 min-w-[300px]">
              <Label>Tình trạng</Label>
              <Select
                onValueChange={(value: BranchStatus) => {
                  setIsActive(value === BranchStatus.ACTIVE);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {BRANCH_STATUS_OPTIONS.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => {
              updateQuery({
                search: keyword,
                page: "1",
              });
            }}>
            <Search />
            Tìm kiếm
          </Button>
        </div>

        {/* Table */}
        {branchLoading ? <Loading /> : (

          <div className="mt-2 pt-2 px-5 pb-2 bg-white rounded-xl">
            <div className="flex gap-x-5">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenDialog(true);
                  setSelectedBranch(undefined);
                }}
              >
                <PlusCircle />
                Thêm mới
              </Button>

              <Button disabled={!selectedBranch} onClick={() => {
                setOpenDialog(selectedBranch !== undefined);
              }}>
                <Edit />
                Sửa
              </Button>
            </div>

            <div className="mt-5">
              <DataTable columns={BranchColumn} data={branch?.data ?? []}
                onRowClick={(row) => {
                  setSelectedBranch(row);
                }} />
            </div>
          </div>
        )}

        <div className="mt-5">
          <AppPagination
            page={page}
            totalPages={branch?.meta?.totalPages ?? 0}
          />
        </div>
      </div>

      <AppDialog
        title="Thêm mới chi nhánh"
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false)
          setSelectedBranch(undefined);
        }}
        contentClassName="sm:max-w-4xl"
      >
        <BranchForm
          onCloseForm={() => {
            setOpenDialog(false)
            setSelectedBranch(undefined);
          }}
          initial={{
            id: selectedBranch?.id ?? "",
            name: selectedBranch?.name ?? "",
            wardId: selectedBranch?.wardId ?? "",
            provinceId: selectedBranch?.provinceId ?? "",
            address: selectedBranch?.address ?? "",
            phone: selectedBranch?.phone ?? "",
            isActive: selectedBranch?.isActive ?? false,
          }} />
      </AppDialog>
    </SidebarInset>
  );
};

export default Page;
