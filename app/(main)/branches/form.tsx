"use client";

/* eslint-disable react-hooks/incompatible-library */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateBranch, useUpdateBranch } from "@/hooks/use-branch";
import { useProvinces, useWardByProvince } from "@/hooks/use-location";
import { BranchFormSchema, BranchFormValues } from "@/types/branch";
import { BRANCH_STATUS_OPTIONS, BranchStatus } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";

import { IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BranchFormProps = {
  initial?: BranchFormValues & { id: string } | undefined | null;
  onCloseForm: () => void;
};



const EMPTY_BRANCH: BranchFormValues = {
  name: "",
  wardId: "",
  phone: "",
  provinceId: "",
  address: "",
  isActive: true,
}

const BranchForm = ({ initial, onCloseForm }: BranchFormProps) => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(BranchFormSchema),
    defaultValues: initial || EMPTY_BRANCH,
    mode: "onChange",
  });

  const { mutateAsync: createBranch, isPending: createBranchPending } = useCreateBranch();
  const { mutateAsync: updateBranch, isPending: updateBranchPending } = useUpdateBranch()

  const onSubmit = async (data: BranchFormValues) => {
    if (initial && initial.id) {
      await updateBranch(
        { ...data, id: initial.id, isActive: data.isActive ?? true },
        {
          onSuccess: () => {
            toast.success("Cập nhật chi nhánh thành công!");
            onCloseForm();
          },
          onError: (error) => {
            toast.error("Thêm mới chi nhánh thất bại!", {
              description: error.message,
            });
          },
        });
    }
    else {
      await createBranch(data, {
        onSuccess: () => {
          toast.success("Thêm mới chi nhánh thành công!");
          onCloseForm();
        },
        onError: (error) => {
          toast.error("Thêm mới chi nhánh thất bại!", {
            description: error.message,
          });
        },
      });
    }

  };

  const { data: provinces = [], isLoading: provinceLoading } = useProvinces();
  const provinceId = form.watch("provinceId");
  const selectedProvince = provinces?.find((p) => p.id === provinceId);
  const provinceCode = selectedProvince?.code ?? "";
  const { data: wards = [], isLoading: wardsLoading } =
    useWardByProvince(provinceCode);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <Card className="bg-gray-50 border-none shadow-none p-5">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 text-xl text-primary">
              <IdCard className="w-6 h-6" />
              Thông tin chi nhánh
            </CardTitle>
            <CardDescription>Thông tin cơ bản của chi nhánh.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên chi nhánh<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên chi nhánh" {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Địa chỉ<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ chi nhánh" {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provinceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tỉnh/Thành phố
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn Tỉnh/Thành" />
                        </SelectTrigger>

                        <SelectContent className="h-[200px]">
                          {provinceLoading ? (
                            <SelectItem
                              className="flex items-center justify-center h-full"
                              value="loading"
                              disabled
                            >
                              <Spinner />
                            </SelectItem>
                          ) : (
                            provinces?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phường/Xã<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!provinceId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn Phường/Xã" />
                        </SelectTrigger>

                        <SelectContent className="h-[200px]">
                          {wardsLoading ? (
                            <SelectItem
                              className="flex items-center justify-center h-full"
                              value="loading"
                              disabled
                            >
                              <Spinner />
                            </SelectItem>
                          ) : (
                            wards?.map((w) => (
                              <SelectItem key={w.id} value={w.id}>
                                {w.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {
                initial?.id && (

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tình trạng<span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          value={field.value ? BranchStatus.ACTIVE : BranchStatus.CLOSE}
                          onValueChange={(value) => {
                            field.onChange(value === BranchStatus.ACTIVE);
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
                        <div className="min-h-[20px]">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                )
              }
            </div>
          </CardContent>
        </Card>

        {/* </div> */}
        <div className="flex justify-end">
          <Button type="submit">{(createBranchPending || updateBranchPending) ? <Spinner /> : "Xác nhận"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
