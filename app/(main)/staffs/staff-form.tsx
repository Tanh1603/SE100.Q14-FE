"use client";

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useBranch } from "@/hooks/use-branch";
import { useCreateStaff } from "@/hooks/use-staff";
import { ROLE_OPTIONS } from "@/types/constant";
import { CreateStaff, CreateStaffSchema } from "@/types/staff";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Info } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type StaffFormProps = {
  initialStaff?: CreateStaff | undefined | null;
  onCloseForm: () => void;
};

// type StaffFormState = {
//   id: string;
//   email: string;
//   password: string;
//   role: Role;
//   branchId: string;

//   fullName: string;
//   gender: Gender;
//   dob: string;
//   cccd: string;
//   phone: string;
//   startDate: string;
//   endDate?: string;
// };

const EMPTY_STAFF: CreateStaff = {
  email: "nam@gm.com",
  password: "",
  role: undefined,
  storeId: "",
  firstName: "",
  lastName: "",
  // gender: Gender.MALE,
  // dob: "",
  // cccd: "",
  phoneNumber: "",
  hireDate: "",
};

const StaffForm = ({ initialStaff, onCloseForm }: StaffFormProps) => {
  const form = useForm<CreateStaff>({
    resolver: zodResolver(CreateStaffSchema),
    defaultValues: initialStaff || EMPTY_STAFF,
    mode: "onChange",
  });

  // handle locations

  // handle branches
  const { data: branches = [], isLoading: branchLoading } = useBranch();
  const { mutateAsync, isPending } = useCreateStaff();

  // handle submit
  const onSubmit = async (data: CreateStaff) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Thêm mới nhân viên thành công!");
      },
      onError: (error) => {
        toast.success("Thêm mới nhân viên thất bại!", {
          description: error.message,
        });
      },
    });
    onCloseForm();
  };

  const { user, isLoaded } = useUser();
  const isManager =
    (user?.publicMetadata?.role as string).toUpperCase() === "MANAGER";

  useEffect(() => {
    if (
      isManager &&
      isLoaded &&
      user?.publicMetadata?.storeId &&
      !branchLoading &&
      branches.length > 0
    ) {
      form.setValue("storeId", user?.publicMetadata?.storeId as string, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      form.trigger("storeId");
      console.log();
    }
  }, [
    isManager,
    user?.publicMetadata?.storeId,
    form,
    branchLoading,
    branches.length,
    isLoaded,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-[80vh] flex flex-col"
      >
        <ScrollArea className="flex-1 min-h-0">
          {/* <div className="space-y-4"> */}
          {/* SECTION: PERSONAL INFO */}
          <Card className="bg-gray-50 border-none shadow-none p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <IdCard className="w-6 h-6" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Thông tin cơ bản của nhân viên.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ" {...field} />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên" {...field} />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>{" "}
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày sinh<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="dd/mm/yyyy"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Giới tính<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {GENDER_OPTIONS.map((item, index) => (
                                <SelectItem key={index} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Số điện thoại<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>{" "}
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="cccd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Số CCCD<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số CCCD" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Ngày vào làm<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Nhập ngày vào làm"
                          {...field}
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>{" "}
                    </FormItem>
                  )}
                />

                {/* {initialStaff && initialStaff && (
                  <FormField
                    control={form.control}
                    name="endDate"
                    disabled={true}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Ngày vào làm<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Nhập ngày vào làm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )} */}
              </div>
            </CardContent>
          </Card>

          {/* SECTION: LOGIN ACCOUNT */}
          <Card className="bg-gray-50 border-none shadow-none p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <Info className="w-6 h-6" />
                Tài khoản đăng nhập
              </CardTitle>
              <CardDescription>
                Thông tin tài khoản đăng nhập và quyền hạn
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>{" "}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mật khẩu<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {!isManager && (
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cửa hàng làm việc
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isManager}
                          >
                            <SelectTrigger className="w-[200px] truncate">
                              <SelectValue placeholder="Cửa hàng" />
                            </SelectTrigger>
                            <SelectContent className="w-[200px] overflow-hidden truncate">
                              {branchLoading ? (
                                <SelectItem
                                  className="flex items-center justify-center h-full"
                                  value="loading"
                                  disabled
                                >
                                  <Spinner />
                                </SelectItem>
                              ) : (
                                branches?.map((item) => (
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
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phân quyền<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Phân quyền" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {ROLE_OPTIONS.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item.value)}
                                >
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* </div> */}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div className="flex justify-end">
          <Button type="submit">{isPending ? <Spinner /> : "Xác nhận"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
